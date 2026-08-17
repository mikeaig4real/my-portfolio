import { cookies } from 'next/headers';
import { runStructuredInference } from '@/lib/ai/inference';
import { validateRequest } from '@/lib/schemas/validateRequest';
import {
  AIAnalyzeVisitorInputSchema,
  VisitorIntentAnalysisSchema,
} from '@/lib/schemas/portfolioSchema';
import { STORAGE_KEYS } from '@/lib/constants';
import { ApiResponse } from '@/lib/apiResponse';
import {
  AnalyticsEvent,
  ChatTranscript,
  VisitorLead,
  VisitorProfileMetadata,
  VisitorIntentAnalysis,
} from '@/types';
import { getAnalyticsUnified } from '@/lib/db/analyticsDb';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(STORAGE_KEYS.ADMIN_SESSION)?.value;

  if (session !== STORAGE_KEYS.ADMIN_SESSION_VALUE) {
    return ApiResponse.unauthorized();
  }

  const validation = await validateRequest(request, AIAnalyzeVisitorInputSchema);
  if (!validation.success) {
    return validation.errorResponse;
  }

  const {
    mode = 'single_visitor',
    visitorId,
    ip,
    events: passedEvents,
    chats: passedChats,
    lead: passedLead,
  } = validation.data;

  try {
    const isSingleVisitor = mode === 'single_visitor' && visitorId && visitorId !== 'all';
    let relevantEvents: AnalyticsEvent[] = (passedEvents as AnalyticsEvent[]) || [];
    let relevantChats: ChatTranscript[] = (passedChats as ChatTranscript[]) || [];
    let lead: VisitorLead | undefined = passedLead as VisitorLead | undefined;

    // Load from DB if needed
    const unifiedData = await getAnalyticsUnified();
    const allRecentEvents = unifiedData.recentEvents || [];
    const allChats = unifiedData.chatTranscripts || [];
    const allLeads = unifiedData.visitorLeads || [];

    if (isSingleVisitor) {
      relevantEvents = allRecentEvents.filter(
        (e) => (visitorId && e.visitorId === visitorId) || (ip && e.ip === ip)
      );
      relevantChats = allChats.filter((c) => visitorId && c.visitorId === visitorId);
      lead = allLeads.find((l) => visitorId && l.visitorId === visitorId);
    } else {
      // Aggregate traffic mode
      relevantEvents = allRecentEvents.slice(0, 50);
      relevantChats = allChats.slice(0, 30);
    }

    if (isSingleVisitor) {
      // Extract rich visitor metadata for isolated single visitor
      const latestEvent = relevantEvents[0] || {};
      const totalDwellSeconds = relevantEvents.reduce((acc, curr) => acc + (curr.duration || 0), 0);
      const locationStr =
        latestEvent.city && latestEvent.country
          ? `${latestEvent.city}, ${latestEvent.country}`
          : latestEvent.country || latestEvent.city || 'Unknown Location';

      const deviceStr = latestEvent.device
        ? `${latestEvent.device} (${latestEvent.browser || ''} on ${latestEvent.os || ''})`.trim()
        : 'Desktop Browser';

      const visitorMetadata: VisitorProfileMetadata = {
        visitorId: visitorId || latestEvent.visitorId || 'Anonymous',
        ip: ip || latestEvent.ip || 'Unknown',
        location: locationStr,
        city: latestEvent.city || '',
        country: latestEvent.country || '',
        device: latestEvent.device || 'Desktop',
        browser: latestEvent.browser || 'Browser',
        os: latestEvent.os || 'OS',
        screen: latestEvent.screen || '',
        totalEvents: relevantEvents.length,
        totalDwellSeconds,
        lastActive: latestEvent.timestamp || new Date(),
        visitCount: latestEvent.visitCount || 1,
        leadName: lead?.name,
        leadEmail: lead?.email,
        leadCompany: lead?.company,
        leadIntent: lead?.intent,
      };

      const eventsSummary = relevantEvents.map((e) => ({
        type: e.type,
        target: e.targetTitle || e.targetId || e.details,
        section: e.section,
        duration: e.duration ? `${e.duration}s` : undefined,
        scrollDepth: e.scrollDepth ? `${e.scrollDepth}%` : undefined,
        time: e.timestamp,
        location: `${e.city || ''}, ${e.country || ''}`,
      }));

      const chatSummary = relevantChats.map((c) => `${c.role.toUpperCase()}: ${c.content}`).join('\n');

      const prompt = `You are an elite Talent Intelligence & Visitor Intent Analyst for a senior software engineer's portfolio.
Analyze the following telemetry and conversation logs for THIS SPECIFIC VISITOR from ${locationStr} (${deviceStr}).

VISITOR IDENTIFIERS:
- Visitor ID: ${visitorMetadata.visitorId}
- Location / Geo: ${locationStr} (IP: ${visitorMetadata.ip})
- Device / Environment: ${deviceStr}
- Captured Lead Profile: ${JSON.stringify(lead || {})}
- Total Session Interactions: ${relevantEvents.length} actions | Active Dwell: ${totalDwellSeconds}s

VISITOR ACTIONS & TELEMETRY TIMELINE:
${JSON.stringify(eventsSummary, null, 2)}

CHAT CONVERSATIONS WITH AI ASSISTANT:
${chatSummary || 'No chat messages logged for this visitor.'}

YOUR TASK:
Synthesize this specific visitor's behavioral patterns into a crisp executive briefing adhering strictly to the structured schema.
In your "visitorSummary" and "keyObservations", explicitly mention their location (${locationStr}) and device where relevant.
`;

      const parsedSynthesis = await runStructuredInference<VisitorIntentAnalysis>({
        schema: VisitorIntentAnalysisSchema as unknown as import('zod').ZodType<VisitorIntentAnalysis>,
        schemaName: 'SingleVisitorIntentAnalysis',
        messages: [
          {
            role: 'system',
            content: 'You are a talent intelligence and visitor intent synthesis expert. Output strictly valid JSON conforming to the schema.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        maxRepairAttempts: 2,
      });

      return ApiResponse.success({
        ...parsedSynthesis,
        analysisMode: 'single_visitor',
        visitorMetadata,
      });
    } else {
      // Aggregate Portfolio Traffic Overview Mode
      const totalViews = unifiedData.totalViews || allRecentEvents.length;
      const uniqueIps = new Set(allRecentEvents.map((e) => e.ip || e.visitorId)).size;
      const totalDownloads = unifiedData.totalResumeDownloads || 0;
      const totalContactClicks = unifiedData.totalContactClicks || 0;
      const totalProjectClicks = unifiedData.totalProjectClicks || 0;

      const topLocations = Array.from(
        new Set(allRecentEvents.map((e) => `${e.city || ''}, ${e.country || ''}`).filter((l) => l.length > 2))
      ).slice(0, 6);

      const visitorMetadata: VisitorProfileMetadata = {
        visitorId: 'All Visitors',
        location: topLocations.join(' • ') || 'Worldwide',
        totalEvents: allRecentEvents.length,
        totalDwellSeconds: allRecentEvents.reduce((acc, curr) => acc + (curr.duration || 0), 0),
        leadName: `${allLeads.length} Captured Leads`,
      };

      const prompt = `You are an elite Portfolio Performance & Talent Pipeline Analyst.
Synthesize the overall visitor traffic, engagement patterns, project clicks, and chatbot leads for a software engineer's portfolio into an executive traffic intelligence briefing.

PORTFOLIO MACRO TELEMETRY:
- Total Page Views: ${totalViews}
- Unique Visitors / IPs: ${uniqueIps}
- Resume Downloads: ${totalDownloads}
- Direct Contact Clicks: ${totalContactClicks}
- Project Clicks: ${totalProjectClicks}
- Captured Chatbot Leads (${allLeads.length}): ${JSON.stringify(allLeads)}
- Active Visitor Locations: ${topLocations.join(', ') || 'Global'}

RECENT EVENT SAMPLE (${allRecentEvents.length} events):
${JSON.stringify(
  allRecentEvents.slice(0, 35).map((e) => ({
    type: e.type,
    target: e.targetTitle || e.targetId,
    section: e.section,
    duration: e.duration,
    location: `${e.city || ''}, ${e.country || ''}`,
  })),
  null,
  2
)}

RECENT CHAT CONVERSATIONS (${allChats.length}):
${allChats.slice(0, 15).map((c) => `${c.role.toUpperCase()}: ${c.content}`).join('\n') || 'No recent chats.'}

YOUR TASK:
Synthesize macro trends across all visitors adhering strictly to the structured schema. Do NOT confuse multiple visitors with one person.
`;

      const parsedSynthesis = await runStructuredInference<VisitorIntentAnalysis>({
        schema: VisitorIntentAnalysisSchema as unknown as import('zod').ZodType<VisitorIntentAnalysis>,
        schemaName: 'AggregateTrafficIntentAnalysis',
        messages: [
          {
            role: 'system',
            content: 'You are an analytics and portfolio performance synthesis expert. Output strictly valid JSON conforming to the schema.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        maxRepairAttempts: 2,
      });

      return ApiResponse.success({
        ...parsedSynthesis,
        analysisMode: 'aggregate_traffic',
        visitorMetadata,
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('Visitor intent analysis error:', error);
    return ApiResponse.serverError(error.message || 'Failed to synthesize visitor intent.');
  }
}
