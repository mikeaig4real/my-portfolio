import { BentoCardType, ProjectViewType } from '@/types/portfolio';
import { BENTO_CARD_TYPES, PROJECT_VIEW_TYPES } from '@/lib/constants';

export interface CardTemplateOption {
  type: BentoCardType;
  title: string;
  category: string;
  description: string;
  accentColor: string;
  viewType?: ProjectViewType;
  defaultContent?: Record<string, string>;
}

export const CARD_TEMPLATES: CardTemplateOption[] = [
  {
    type: BENTO_CARD_TYPES.HERO_PROFILE,
    title: 'Hero Profile',
    category: 'PROFILE',
    description: 'Bio, avatar, availability, and main introduction.',
    accentColor: '#facc15',
  },
  {
    type: BENTO_CARD_TYPES.WORKPLACE,
    title: 'Work Experience',
    category: 'TIMELINE',
    description: 'Interactive career history tabs and tech stack badges.',
    accentColor: '#70d6ff',
  },
  {
    type: BENTO_CARD_TYPES.TECH_STACK,
    title: 'Tech Stack Matrix',
    category: 'SKILLS',
    description: 'Categorized technical skills & proficiency badges.',
    accentColor: '#a7f3d0',
  },
  {
    type: BENTO_CARD_TYPES.SOCIALS,
    title: 'Connect & Links',
    category: 'CONTACT',
    description: 'Social links grid (GitHub, LinkedIn, Twitter, Email).',
    accentColor: '#d8b4fe',
  },
  {
    type: BENTO_CARD_TYPES.CERTIFICATION,
    title: 'Certification Badge',
    category: 'CREDENTIALS',
    description: 'Professional or technical certifications with verification link.',
    accentColor: '#ff70a6',
    defaultContent: {
      title: 'Professional Certified Engineer',
      issuer: 'Certification Authority / Training',
      issueDate: '2025',
      credentialUrl: 'https://example.com',
    },
  },
  {
    type: BENTO_CARD_TYPES.FEATURED_PROJECT,
    title: 'Featured Flagship Showcase',
    category: 'PROJECT',
    description: 'Large cover image, carousel slides, metrics, tags, live & repo links.',
    accentColor: '#ff9f1c',
    viewType: PROJECT_VIEW_TYPES.FEATURED,
  },
  {
    type: BENTO_CARD_TYPES.PROJECT_VIEW,
    title: 'Gallery Slide Project',
    category: 'PROJECT',
    description: 'Multi-image slide carousel showcasing project UI & screenshots.',
    accentColor: '#ff70a6',
    viewType: PROJECT_VIEW_TYPES.GALLERY,
  },
  {
    type: BENTO_CARD_TYPES.PROJECT_VIEW,
    title: 'Code Snippet Project',
    category: 'PROJECT',
    description: 'Code snippet preview with syntax highlighting & copy button.',
    accentColor: '#a7f3d0',
    viewType: PROJECT_VIEW_TYPES.CODE,
  },
  {
    type: BENTO_CARD_TYPES.PROJECT_VIEW,
    title: 'Stats & Metrics Project',
    category: 'PROJECT',
    description: 'Highlighted performance metric & analytics dashboard link.',
    accentColor: '#70d6ff',
    viewType: PROJECT_VIEW_TYPES.METRIC,
  },
  {
    type: BENTO_CARD_TYPES.CUSTOM_NOTE,
    title: 'Custom Note Card',
    category: 'NOTE',
    description: 'Custom markdown note, verification badge, or text highlight.',
    accentColor: '#facc15',
    defaultContent: {
      title: 'Architecture & System Note',
      body: 'Building scalable modern web applications with agentic workflows, responsive UI, and high-performance serverless backends.',
      metricValue: 'Verified',
      metricLabel: 'Status',
    },
  },
];
