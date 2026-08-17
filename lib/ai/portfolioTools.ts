import OpenAI from 'openai';
import { getPortfolioDataUnified } from '@/lib/db';
import { recordChatMessageAndLeadUnified } from '@/lib/db/analyticsDb';

export const portfolioChatTools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'checkAvailability',
      description: 'Check my current employment availability, preferred roles, contract terms, and timezone.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'searchProjects',
      description: 'Search for specific projects in my portfolio by technology, framework, or category.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Technology name, keyword, or category (e.g. React, Next.js, AI, FastAPI, Agentic).',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getExperienceDetails',
      description: 'Retrieve detailed workplace experience and key accomplishments for a specific company or role.',
      parameters: {
        type: 'object',
        properties: {
          company: {
            type: 'string',
            description: 'The name of the company to query.',
          },
        },
        required: ['company'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'captureVisitorLead',
      description: 'Record the visitor’s contact details, company, and project/hiring intent when they share them.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The visitor or recruiter’s full name.',
          },
          email: {
            type: 'string',
            description: 'The visitor’s email address.',
          },
          company: {
            type: 'string',
            description: 'The company or client name they represent.',
          },
          intent: {
            type: 'string',
            description: 'The reason for reaching out (e.g. Full-time Senior Engineer role, freelance contract, project consultation).',
          },
        },
        required: ['name', 'email'],
      },
    },
  },
];

export function createPortfolioToolMap(visitorId: string = 'anonymous') {
  return {
    checkAvailability: async () => {
      const portfolio = await getPortfolioDataUnified();
      return {
        availability: portfolio.profile.availability || 'Available for Senior Full-Stack & AI Roles / Contracts',
        location: portfolio.profile.location || 'Remote / Worldwide',
        email: portfolio.profile.email,
        github: portfolio.profile.githubUrl,
      };
    },

    searchProjects: async ({ query }: { query: string }) => {
      const portfolio = await getPortfolioDataUnified();
      const lower = (query || '').toLowerCase();

      const matches = portfolio.projects.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower)) ||
          p.category.toLowerCase().includes(lower)
      );

      if (matches.length === 0) {
        return {
          found: false,
          message: `No specific project matched "${query}", but here are all available projects: ${portfolio.projects.map((p) => p.title).join(', ')}`,
        };
      }

      return {
        found: true,
        count: matches.length,
        projects: matches.map((p) => ({
          title: p.title,
          category: p.category,
          tagline: p.tagline,
          description: p.description,
          tags: p.tags,
          metric: p.metric,
          demoUrl: p.demoUrl,
          githubUrl: p.githubUrl,
        })),
      };
    },

    getExperienceDetails: async ({ company }: { company: string }) => {
      const portfolio = await getPortfolioDataUnified();
      const lower = (company || '').toLowerCase();

      const match = portfolio.workplaces.find((w) => w.company.toLowerCase().includes(lower));

      if (!match) {
        return {
          found: false,
          availableWorkplaces: portfolio.workplaces.map((w) => w.company),
        };
      }

      return {
        found: true,
        company: match.company,
        role: match.role,
        period: match.period,
        location: match.location,
        description: match.description,
        skills: match.skills,
      };
    },

    captureVisitorLead: async ({
      name,
      email,
      company,
      intent,
    }: {
      name: string;
      email: string;
      company?: string;
      intent?: string;
    }) => {
      await recordChatMessageAndLeadUnified(
        visitorId,
        `Shared Contact Info: ${name} (${email})`,
        `Thank you ${name}, I have recorded your contact details.`,
        {
          name,
          email,
          company,
          intent,
        }
      );

      return {
        recorded: true,
        message: `Thank you, ${name}! Your contact info has been safely recorded. I look forward to connecting with you soon.`,
      };
    },

  };
}
