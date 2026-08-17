import config from '@/config';
import { BentoCardType, CardUnitBounds } from '@/types/portfolio';

export const APP_CONSTANTS = {
  NAME: config.app.projectName,
  TITLE: 'Neobrutalist Bento Portfolio',
  DEFAULT_PORT: config.app.port,
  DEFAULT_ENV: config.app.env,
  AUTO_SAVE_DEBOUNCE_MS: config.app.autoSaveDebounceMs,
  GRACE_PERIOD_DAYS: 3,
  MAX_RECENT_EVENTS: 50,
} as const;

export const GRID_SYSTEM = {
  UNIT_SIZE_PX: 140,
  GRID_COLUMNS: 4,
  MAX_ROWS: 6,
} as const;

export const BENTO_CARD_TYPES = {
  HERO_PROFILE: 'hero_profile' as const,
  WORKPLACE: 'workplace' as const,
  TECH_STACK: 'tech_stack' as const,
  FEATURED_PROJECT: 'featured_project' as const,
  PROJECT_VIEW: 'project_view' as const,
  SOCIALS: 'socials' as const,
  QUICK_STATS: 'quick_stats' as const,
  CERTIFICATION: 'certification' as const,
  CUSTOM_NOTE: 'custom_note' as const,
} as const;

export const PROJECT_VIEW_TYPES = {
  FEATURED: 'featured' as const,
  GALLERY: 'gallery' as const,
  CODE: 'code' as const,
  METRIC: 'metric' as const,
  COMPACT: 'compact' as const,
} as const;

export const CARD_TYPE_BOUNDS: Record<BentoCardType, CardUnitBounds> = {
  hero_profile: { minCol: 2, maxCol: 4, minRow: 2, maxRow: 3 },
  workplace: { minCol: 2, maxCol: 4, minRow: 2, maxRow: 3 },
  tech_stack: { minCol: 2, maxCol: 4, minRow: 1, maxRow: 3 },
  featured_project: { minCol: 2, maxCol: 4, minRow: 2, maxRow: 3 },
  project_view: { minCol: 1, maxCol: 3, minRow: 1, maxRow: 3 },
  socials: { minCol: 1, maxCol: 2, minRow: 1, maxRow: 2 },
  quick_stats: { minCol: 1, maxCol: 2, minRow: 1, maxRow: 2 },
  certification: { minCol: 1, maxCol: 2, minRow: 1, maxRow: 2 },
  custom_note: { minCol: 1, maxCol: 2, minRow: 1, maxRow: 2 },
};

export const SINGLETON_CARD_TYPES: BentoCardType[] = [
  BENTO_CARD_TYPES.HERO_PROFILE,
  BENTO_CARD_TYPES.WORKPLACE,
  BENTO_CARD_TYPES.TECH_STACK,
  BENTO_CARD_TYPES.SOCIALS,
];

export const STORAGE_KEYS = {
  PORTFOLIO_DRAFT: 'neobrutal_portfolio',
  ADMIN_SESSION: config.security.adminSessionCookieName,
  ADMIN_SESSION_VALUE: config.security.adminSessionTokenValue,
  CHECKPOINTS: 'neobrutal_checkpoints',
  THEME_MODE: 'neobrutal_theme_mode',
  VISITOR_ID: 'neobrutal_visitor_id',
  VISITOR_VISIT_COUNT: 'neobrutal_visit_count',
  LAST_ACTIVE_TS: 'neobrutal_last_active_ts',
} as const;

export const SHORTCUT_KEYS = {
  ADMIN_UNLOCK_KEY: config.security.adminUnlockKey.toLowerCase(),
  MOBILE_ADMIN_TAP_COUNT: config.security.mobileAdminTapCount,
} as const;

export const FONT_PRESETS = [
  { id: 'font-mono', name: '💻 Space Mono / Code', cssValue: "'Space Mono', monospace" },
  { id: 'font-sans', name: '✨ Modern Sans (Inter / Outfit)', cssValue: "'Outfit', 'Inter', sans-serif" },
  { id: 'font-serif', name: '📜 Elegant Serif (Playfair)', cssValue: "'Playfair Display', Georgia, serif" },
  { id: 'font-brutal', name: '⚡ Cyber Heavy (Impact)', cssValue: 'Impact, "Arial Black", sans-serif' },
] as const;

export const COLOR_SWATCHES = [
  '#facc15',
  '#ff70a6',
  '#70d6ff',
  '#a7f3d0',
  '#d8b4fe',
  '#ff9f1c',
  '#18181b',
  '#064e3b',
] as const;

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  PROJECT_CLICK: 'project_click',
  RESUME_DOWNLOAD: 'resume_download',
  CONTACT_CLICK: 'contact_click',
  SOCIAL_CLICK: 'social_click',
  CERTIFICATE_CLICK: 'certificate_click',
  CODE_COPY: 'code_copy',
  SESSION_DURATION: 'session_duration',
  SCROLL_DEPTH: 'scroll_depth',
  SECTION_DWELL: 'section_dwell',
  CHAT_INTERACTION: 'chat_interaction',
  OUTBOUND_LINK: 'outbound_link',
} as const;

export const DEFAULT_CUSTOMIZATION = {
  layoutMode: 'bento',
  gridColumns: 4,
  gridGap: 20,
  shadowOffset: 4,
  borderWidth: 2,
  colorScheme: 'cyber_yellow',
  enableAnimations: true,
  fontFamily: 'font-mono',
  autoSaveEnabled: false,
} as const;

export const DATABASE_CONSTANTS = {
  PROVIDERS: {
    MONGODB: 'mongodb',
    SQLITE: 'sqlite',
    DRIZZLE: 'drizzle',
  },
  STORAGE_DIR: '.storage',
  SQLITE_DB_NAME: 'portfolio.db',
  JSON_DB_NAME: 'portfolio.json',
  SQLITE_DB_FILE_PATH: '.storage/portfolio.db',
  PORTFOLIO_TABLE_NAME: 'portfolio_data',
} as const;

export const AI_CONSTANTS = {
  SCHEMA_NAME: 'portfolio_data',
  DEFAULT_MODEL: config.ai.model || 'google/gemini-2.5-flash',
  DEFAULT_PROVIDER: config.ai.provider || 'openrouter',
  ROLES: {
    SYSTEM: 'system' as const,
    USER: 'user' as const,
    ASSISTANT: 'assistant' as const,
  },
  SYSTEM_PROMPT: 'You are an elite Resume-to-Bento Portfolio Architect. Extract 100% of all experiences, skills, projects, certifications, and links from the user CV. Create matching Bento cards for ALL projects and ALL certifications without truncating data.',
} as const;

export const CLOUDINARY_CONSTANTS = {
  RESUME_FOLDER: 'portfolio_resumes',
  RESOURCE_TYPES: {
    RAW: 'raw' as const,
    AUTO: 'auto' as const,
    IMAGE: 'image' as const,
  },
} as const;
