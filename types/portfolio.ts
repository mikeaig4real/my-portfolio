export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  availability: string;
  email: string;
  resumeUrl: string;
  githubUrl?: string;
  statusEmoji: string;
}

export interface Workplace {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  skills: string[];
  isCurrent: boolean;
  logoBg: string;
}

export type ProjectViewType = 'featured' | 'gallery' | 'metric' | 'compact' | 'code';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface CodeSnippet {
  language: string;
  code: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  viewType: ProjectViewType;
  coverImage: string;
  galleryImages: string[];
  demoUrl?: string;
  githubUrl?: string;
  metric?: ProjectMetric;
  codeSnippet?: CodeSnippet;
  featured: boolean;
  accentColor: string;
  order?: number;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
  badgeColor: string;
}

export interface SocialLink {
  id: string;
  platform: 'GitHub' | 'LinkedIn' | 'Twitter' | 'Email' | 'YouTube' | 'Discord' | string;
  url: string;
  username: string;
}

export type BentoCardType =
  | 'hero_profile'
  | 'workplace'
  | 'featured_project'
  | 'project_view'
  | 'tech_stack'
  | 'socials'
  | 'quick_stats'
  | 'certification'
  | 'custom_note';

export interface BentoCustomContent {
  title?: string;
  body?: string;
  metricValue?: string;
  metricLabel?: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface BentoCardConfig {
  id: string;
  type: BentoCardType;
  title: string;
  colSpan: number; // 1, 2, 3, 4
  rowSpan: number; // 1, 2, 3
  order: number;
  visible: boolean;
  accentColor: string;
  targetId?: string; // links to specific project or entity
  customContent?: BentoCustomContent;
}

export interface CardUnitBounds {
  minCol: number;
  maxCol: number;
  minRow: number;
  maxRow: number;
}

export interface CheckpointSnapshot {
  id: string;
  name: string;
  timestamp: string;
  data: PortfolioData;
}

export interface BentoCustomizationConfig {
  layoutMode: 'bento' | 'compact' | 'masonry';
  gridColumns: number;
  gridGap: number;
  shadowOffset: number;
  borderWidth: number;
  colorScheme: string;
  enableAnimations: boolean;
  fontFamily?: string;
  autoSaveEnabled?: boolean;
  /** Text shown in the branding badge on the footer, e.g. "NEOBRUTALISM v2.0" */
  footerBadgeText?: string;
}

export interface ChatConfig {
  enabled?: boolean;
  bubbleVisible?: boolean;
  bubbleText?: string;
  triggerButtonText?: string;
  triggerButtonSubtext?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerBadge?: string;
  introMessage?: string;
  quickQuestions?: string[];
  accentColor?: string;
}

export interface PortfolioData {
  profile: Profile;
  workplaces: Workplace[];
  projects: Project[];
  skills: SkillGroup[];
  socials: SocialLink[];
  cards: BentoCardConfig[];
  colorScheme?: string;
  customization?: BentoCustomizationConfig;
  chatConfig?: ChatConfig;
  // NOTE: checkpoints are intentionally NOT part of PortfolioData.
  // They live in usePortfolioStore state + localStorage only,
  // so restoring a checkpoint never overwrites the checkpoints list itself.
}

