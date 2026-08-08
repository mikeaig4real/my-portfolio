import { z } from 'zod';

export const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().nullish().transform(v => v || ''),
  avatar: z.string().nullish().transform(v => v || ''),
  location: z.string().nullish().transform(v => v || 'Remote'),
  availability: z.string().nullish().transform(v => v || 'Available for Hire'),
  email: z.string().nullish().transform(v => v || ''),
  resumeUrl: z.string().nullish().transform(v => v || ''),
  githubUrl: z.string().nullish().transform(v => v || 'https://github.com'),
  statusEmoji: z.string().nullish().transform(v => v || '⚡'),
});

export const WorkplaceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().nullish().transform(v => v || ''),
  location: z.string().nullish().transform(v => v || ''),
  description: z.string().nullish().transform(v => v || ''),
  skills: z.array(z.string()).nullish().transform(v => v || []),
  isCurrent: z.boolean().nullish().transform(v => Boolean(v)),
  logoBg: z.string().nullish().transform(v => v || 'bg-yellow-300'),
});

export const ProjectMetricSchema = z.object({
  label: z.string().nullish().transform(v => v || 'Metric'),
  value: z.string().nullish().transform(v => v || '99.9%'),
});

export const CodeSnippetSchema = z.object({
  language: z.string().nullish().transform(v => v || 'typescript'),
  code: z.string().nullish().transform(v => v || ''),
});

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  tagline: z.string().nullish().transform(v => v || ''),
  description: z.string().nullish().transform(v => v || ''),
  category: z.string().nullish().transform(v => v || 'Web App'),
  coverImage: z.string().nullish().transform(v => v || ''),
  galleryImages: z.array(z.string()).nullish().transform(v => v || []),
  viewType: z.enum(['featured', 'gallery', 'metric', 'compact', 'code']).nullish().transform(v => v || 'compact'),
  tags: z.array(z.string()).nullish().transform(v => v || []),
  accentColor: z.string().nullish().transform(v => v || '#70d6ff'),
  metric: ProjectMetricSchema.nullish(),
  codeSnippet: CodeSnippetSchema.nullish(),
  demoUrl: z.string().nullish().transform(v => v || ''),
  githubUrl: z.string().nullish().transform(v => v || ''),
  featured: z.boolean().nullish().transform(v => Boolean(v)),
  order: z.number().nullish().transform(v => v ?? 0),
});

export const SkillGroupSchema = z.object({
  id: z.string().nullish().transform(v => v || 'sg_1'),
  category: z.string(),
  skills: z.array(z.string()).nullish().transform(v => v || []),
  badgeColor: z.string().nullish().transform(v => v || 'bg-yellow-300'),
});

export const SocialLinkSchema = z.object({
  id: z.string(),
  platform: z.string(),
  url: z.string().nullish().transform(v => v || ''),
  username: z.string().nullish().transform(v => v || ''),
});

export const BentoCustomContentSchema = z.object({
  title: z.string().nullish().transform(v => v || ''),
  body: z.string().nullish().transform(v => v || ''),
  metricValue: z.string().nullish().transform(v => v || ''),
  metricLabel: z.string().nullish().transform(v => v || ''),
  issuer: z.string().nullish().transform(v => v || ''),
  issueDate: z.string().nullish().transform(v => v || ''),
  credentialUrl: z.string().nullish().transform(v => v || ''),
});

export const BentoCardTypeSchema = z.enum([
  'hero_profile',
  'workplace',
  'featured_project',
  'project_view',
  'tech_stack',
  'socials',
  'quick_stats',
  'certification',
  'custom_note',
]);

export const BentoCardConfigSchema = z.object({
  id: z.string(),
  type: BentoCardTypeSchema,
  title: z.string().nullish().transform(v => v || 'Bento Card'),
  colSpan: z.number().min(1).max(4).nullish().transform(v => v ?? 1),
  rowSpan: z.number().min(1).max(3).nullish().transform(v => v ?? 1),
  order: z.number().nullish().transform(v => v ?? 0),
  visible: z.boolean().nullish().transform(v => v ?? true),
  accentColor: z.string().nullish().transform(v => v || '#70d6ff'),
  targetId: z.string().nullish().transform(v => v || ''),
  customContent: BentoCustomContentSchema.nullish(),
});

export const CustomizationSchema = z.object({
  layoutMode: z.enum(['bento', 'compact', 'masonry']).nullish().transform(v => v || 'bento'),
  gridColumns: z.number().nullish().transform(v => v ?? 4),
  gridGap: z.number().nullish().transform(v => v ?? 16),
  shadowOffset: z.number().nullish().transform(v => v ?? 4),
  borderWidth: z.number().nullish().transform(v => v ?? 2),
  colorScheme: z.string().nullish().transform(v => v || 'cyberpunk'),
  enableAnimations: z.boolean().nullish().transform(v => v ?? true),
  fontFamily: z.string().nullish().transform(v => v || 'inter'),
  autoSaveEnabled: z.boolean().nullish().transform(v => v ?? true),
});

export const PortfolioDataSchema = z.object({
  profile: ProfileSchema,
  workplaces: z.array(WorkplaceSchema).nullish().transform(v => v || []),
  projects: z.array(ProjectSchema).nullish().transform(v => v || []),
  skills: z.array(SkillGroupSchema).nullish().transform(v => v || []),
  socials: z.array(SocialLinkSchema).nullish().transform(v => v || []),
  cards: z.array(BentoCardConfigSchema).nullish().transform(v => v || []),
  colorScheme: z.string().nullish().transform(v => v || 'cyberpunk'),
  customization: CustomizationSchema.nullish(),
});

import { defaultPortfolioData } from '@/lib/defaultData';
import { SINGLETON_CARD_TYPES } from '@/lib/constants';
import { PortfolioData, BentoCardConfig, Project } from '@/types/portfolio';

export type PortfolioDataZod = z.infer<typeof PortfolioDataSchema>;

export function reconcilePortfolioData(data: unknown): PortfolioData {
  if (!data || typeof data !== 'object') {
    return defaultPortfolioData;
  }

  const parsed = PortfolioDataSchema.parse(data);

  // 1. Reconcile profile defaults
  const reconciledProfile = {
    ...defaultPortfolioData.profile,
    ...parsed.profile,
  };

  // 2. Reconcile cards array: ensure all singleton cards exist
  let reconciledCards: BentoCardConfig[] = (parsed.cards || []) as BentoCardConfig[];
  if (reconciledCards.length === 0) {
    reconciledCards = [...defaultPortfolioData.cards];
  } else {
    SINGLETON_CARD_TYPES.forEach((singletonType) => {
      const exists = reconciledCards.some((c) => c.type === singletonType);
      if (!exists) {
        const defaultCard = defaultPortfolioData.cards.find((c) => c.type === singletonType);
        if (defaultCard) {
          reconciledCards.push(defaultCard);
        }
      }
    });
  }

  // 3. Fallback for empty collections if missing from older data versions
  const reconciledWorkplaces = parsed.workplaces.length > 0 ? parsed.workplaces : defaultPortfolioData.workplaces;
  const reconciledProjects: Project[] = (parsed.projects.length > 0 ? parsed.projects : defaultPortfolioData.projects) as Project[];
  const reconciledSkills = parsed.skills.length > 0 ? parsed.skills : defaultPortfolioData.skills;
  const reconciledSocials = parsed.socials.length > 0 ? parsed.socials : defaultPortfolioData.socials;

  return {
    ...parsed,
    profile: reconciledProfile,
    cards: reconciledCards,
    workplaces: reconciledWorkplaces,
    projects: reconciledProjects,
    skills: reconciledSkills,
    socials: reconciledSocials,
  };
}

export function validatePortfolioData(data: unknown): PortfolioDataZod {
  return reconcilePortfolioData(data);
}

export const AIGenerateInputSchema = z.object({
  resumeText: z.string().min(1, 'Resume / CV text is required.'),
  provider: z.enum(['openrouter', 'openai', 'ollama']).optional(),
  apiKey: z.string().optional(),
  model: z.string().optional(),
});

export const LoginInputSchema = z.object({
  password: z.string().min(1, 'Password is required.'),
});

export const AnalyticsInputSchema = z.object({
  type: z.string(),
  details: z.string().optional(),
  screen: z.string().optional(),
  language: z.string().optional(),
});
