import { runInference, runAgentLoop } from '@/lib/ai/inference';
import { portfolioChatTools, createPortfolioToolMap } from '@/lib/ai/portfolioTools';
import { getPortfolioDataUnified } from '@/lib/db';
import { validateRequest } from '@/lib/schemas/validateRequest';
import { AIChatInputSchema } from '@/lib/schemas/portfolioSchema';
import { ApiResponse } from '@/lib/apiResponse';
import { recordChatMessageAndLeadUnified } from '@/lib/db/analyticsDb';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  // Public AI Chatbot Rate Limiting: Max 30 messages per minute per IP
  const rateLimitResult = checkRateLimit(request, {
    keyPrefix: 'ai_chat',
    intervalMs: 60 * 1000, // 1 minute
    maxRequests: 30,
  });

  if (!rateLimitResult.success) {
    return createRateLimitResponse(
      rateLimitResult,
      'You are chatting a bit too fast! Please wait a moment before sending another message.'
    );
  }

  const validation = await validateRequest(request, AIChatInputSchema);
  if (!validation.success) {
    return validation.errorResponse;
  }


  const { messages, visitorId = 'anonymous', visitorName, visitorEmail, visitorCompany, visitorIntent } = validation.data;
  const lastUserMsg = messages[messages.length - 1]?.content || '';

  try {
    const portfolio = await getPortfolioDataUnified();

    // Construct grounded knowledge base string from live portfolio
    const knowledgeBase = `
=== DEVELOPER PROFILE ===
Name: ${portfolio.profile.name}
Title: ${portfolio.profile.title}
Bio: ${portfolio.profile.bio}
Location: ${portfolio.profile.location}
Availability: ${portfolio.profile.availability}
Email: ${portfolio.profile.email}
GitHub: ${portfolio.profile.githubUrl}
Resume URL: ${portfolio.profile.resumeUrl}

=== WORK EXPERIENCE & EMPLOYMENT ===
${portfolio.workplaces
  .map(
    (w) =>
      `• Role: ${w.role} at ${w.company} (${w.period}) | Location: ${w.location}\n  Description: ${w.description}\n  Tech/Skills: ${w.skills?.join(', ')}`
  )
  .join('\n\n')}

=== FEATURED PROJECTS ===
${portfolio.projects
  .map(
    (p) =>
      `• Project: ${p.title} (${p.category})\n  Tagline: ${p.tagline}\n  Description: ${p.description}\n  Tags/Tech: ${p.tags?.join(', ')}\n  Demo: ${p.demoUrl || 'N/A'} | GitHub: ${p.githubUrl || 'N/A'}`
  )
  .join('\n\n')}

=== SKILLS & EXPERTISE ===
${portfolio.skills
  .map((s) => `• ${s.category}: ${s.skills?.join(', ')}`)
  .join('\n')}

=== SOCIAL & CONTACT LINKS ===
${portfolio.socials.map((s) => `• ${s.platform}: ${s.url} (${s.username})`).join('\n')}
`;

    const systemPrompt = `You are the interactive Digital Twin and Senior Engineering Assistant of ${portfolio.profile.name}.
You speak and interact directly as ${portfolio.profile.name} in the FIRST PERSON ('I', 'me', 'my', 'myself').

Your mission is two-fold:
1. Provide sharp, insightful, grounded answers about my technical expertise, featured architectures, tech stacks, and career history.
2. Actively engage and discover who the visitor is, warmly guiding and encouraging them to share their name, company, email, and project/hiring requirements so we can connect.

### CRITICAL RULES & BEHAVIOR:
1. FIRST-PERSON VOICE: Always speak as me in the first person ('I specialize in...', 'My featured projects include...', 'At BeevaAI, I built...', 'Feel free to reach out to me directly at ${portfolio.profile.email}'). NEVER refer to me in the third person.
2. GROUNDING & SPECIFICITY: Ground answers strictly in the knowledge base below. Cite real technologies, project names, and measurable impact metrics.
3. TONE & STYLE: Confident, enthusiastic, sharp, professional, Senior Engineer vibe with Neobrutalist developer charm! Keep replies punchy, engaging, and well-formatted (usually 2 to 4 sentences). Use emojis and markdown highlights tastefully.
4. NO REPETITION / NO ECHO: NEVER repeat previous greetings, introductions, or welcome phrases. Jump straight into answering the user's latest question.

### PROACTIVE LEAD ATTRACTION & CONVERSATION HOOKS:
- **Value + Hook + Question Formula**: After answering the visitor's question with authority, ALWAYS end your response with a natural, friendly probe that encourages them to share details:
  - *"Are you scouting for an open senior role on your team, planning a client build, or exploring the architecture? What company or project are you working on?"*
  - *"I'd love to learn more about what your team is building—who am I speaking with, and what stack does your company use?"*
  - *"If you have an opportunity or project in mind, drop your name and email or company—I can send over custom case studies or we can set up a quick 15-min chat!"*
  - *"I'm currently considering select full-time roles and high-impact contracts—what kind of engineering problem are you hiring for?"*
- **TOOL CALLING TRIGGER**: Whenever the visitor shares ANY contact detail (their name, company, email, or what project/role they have in mind), IMMEDIATELY invoke the 'captureVisitorLead' tool in the background before continuing!

KNOWLEDGE BASE:
${knowledgeBase}
`;


    // Filter out client-side initial greeting if it appears as the first message to avoid prompting loops
    const conversationMessages = messages.filter((m, idx) => {
      if (idx === 0 && m.role === 'assistant' && /Hey there|AI Assistant|AI Twin/i.test(m.content)) {
        return false;
      }
      return true;
    });

    const aiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationMessages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ];

    // Execute agent loop with tool-calling capabilities
    const toolMap = createPortfolioToolMap(visitorId);
    const aiResponse = await runAgentLoop(
      aiMessages,
      portfolioChatTools,
      toolMap,
      {
        temperature: 0.6,
      },
      4
    );

    // Clean and sanitize reply: strip any accidental duplicated intro phrase
    let cleanedReply = aiResponse.trim();
    cleanedReply = cleanedReply
      .replace(/^Hey there!?[^.!?\n]*AI (?:Assistant|Twin)[^.!?\n]*\n+/i, '')
      .replace(/^Ask me anything about[^.!?\n]*today\??\s*🚀?/i, '')
      .trim();



    // Persist transcript asynchronously across Mongo -> Drizzle SQLite -> JSON file
    recordChatMessageAndLeadUnified(visitorId, lastUserMsg, cleanedReply, {
      name: visitorName,
      email: visitorEmail,
      company: visitorCompany,
      intent: visitorIntent,
    }).catch((err: unknown) => logger.warn('Async chat persistence error:', err));

    return ApiResponse.success({
      reply: cleanedReply,
      lead: {
        name: visitorName,
        email: visitorEmail,
        company: visitorCompany,
        intent: visitorIntent,
      },
    });

  } catch (err: unknown) {
    const error = err as Error;
    logger.error('AI Chatbot Endpoint Error:', error);
    return ApiResponse.serverError(error.message || 'AI Chatbot is currently taking a quick coffee break!');
  }
}
