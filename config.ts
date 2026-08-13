import { z } from 'zod';

const isServer = typeof window === 'undefined';

const envSchema = z.object({
  // Server-only security variables (strictly required on the server without fallbacks!)
  ADMIN_PASSWORD: isServer
    ? z.string().min(1, 'ADMIN_PASSWORD environment variable is required on the server')
    : z.string().optional().default(''),
  SECRET_KEY: isServer
    ? z.string().min(1, 'SECRET_KEY environment variable is required on the server')
    : z.string().optional().default(''),
  JWT_ACCESS_SECRET: isServer
    ? z.string().min(1, 'JWT_ACCESS_SECRET environment variable is required on the server')
    : z.string().optional().default(''),
  JWT_REFRESH_SECRET: isServer
    ? z.string().min(1, 'JWT_REFRESH_SECRET environment variable is required on the server')
    : z.string().optional().default(''),
  COOKIE_SECRET: isServer
    ? z.string().min(1, 'COOKIE_SECRET environment variable is required on the server')
    : z.string().optional().default(''),
  ADMIN_SESSION_TOKEN_VALUE: isServer
    ? z.string().min(1, 'ADMIN_SESSION_TOKEN_VALUE environment variable is required on the server')
    : z.string().optional().default(''),

  // Client-accessible NEXT_PUBLIC security variables (strictly required everywhere without fallbacks!)
  NEXT_PUBLIC_ADMIN_UNLOCK_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_ADMIN_UNLOCK_KEY environment variable is required for security'),
  NEXT_PUBLIC_ADMIN_SESSION_COOKIE_NAME: z
    .string()
    .min(1, 'NEXT_PUBLIC_ADMIN_SESSION_COOKIE_NAME environment variable is required for security'),
  NEXT_PUBLIC_MOBILE_ADMIN_TAP_COUNT: z
    .string()
    .optional()
    .transform((val) => (val && !isNaN(Number(val)) ? Number(val) : 5))
    .default('5'),

  // Operational & debouncing constants
  NEXT_PUBLIC_AUTO_SAVE_DEBOUNCE_MS: z
    .string()
    .optional()
    .transform((val) => (val && !isNaN(Number(val)) ? Number(val) : 1500))
    .default('1500'),

  // Non-security operational constants
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/my_portfolio_db'),
  DATABASE_PROVIDER: z.enum(['mongodb', 'sqlite']).default('sqlite'),
  OPENROUTER_API_KEY: z.string().optional().default(''),
  INFERENCE_PROVIDER: z.enum(['openrouter', 'openai', 'ollama']).default('openrouter'),
  INFERENCE_MODEL: z.string().default('google/gemini-2.5-flash'),
  OLLAMA_BASE_URL: z.string().default('http://127.0.0.1:11434'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  CLOUDINARY_URL: z.string().optional().default(''),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().optional().default('3000'),
  PROJECT_NAME: z.string().optional().default('my-portfolio'),
});

const parsed = envSchema.safeParse({
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  ADMIN_SESSION_TOKEN_VALUE: process.env.ADMIN_SESSION_TOKEN_VALUE,
  NEXT_PUBLIC_ADMIN_UNLOCK_KEY: process.env.NEXT_PUBLIC_ADMIN_UNLOCK_KEY,
  NEXT_PUBLIC_ADMIN_SESSION_COOKIE_NAME: process.env.NEXT_PUBLIC_ADMIN_SESSION_COOKIE_NAME,
  NEXT_PUBLIC_MOBILE_ADMIN_TAP_COUNT: process.env.NEXT_PUBLIC_MOBILE_ADMIN_TAP_COUNT,
  NEXT_PUBLIC_AUTO_SAVE_DEBOUNCE_MS: process.env.NEXT_PUBLIC_AUTO_SAVE_DEBOUNCE_MS,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_PROVIDER: process.env.DATABASE_PROVIDER,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  INFERENCE_PROVIDER: process.env.INFERENCE_PROVIDER,
  INFERENCE_MODEL: process.env.INFERENCE_MODEL,
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PROJECT_NAME: process.env.NEXT_PUBLIC_PROJECT_NAME || process.env.PROJECT_NAME,
});

if (!parsed.success) {
  const fieldErrors = parsed.error.flatten().fieldErrors;
  console.error('❌ SECURITY ALERT: Missing required security environment variables:', fieldErrors);
  throw new Error(`Missing required security environment variables: ${JSON.stringify(fieldErrors)}`);
}

export const config = {
  security: {
    adminPassword: parsed.data.ADMIN_PASSWORD,
    secretKey: parsed.data.SECRET_KEY,
    jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
    jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
    cookieSecret: parsed.data.COOKIE_SECRET,
    adminSessionTokenValue: parsed.data.ADMIN_SESSION_TOKEN_VALUE,
    adminUnlockKey: parsed.data.NEXT_PUBLIC_ADMIN_UNLOCK_KEY,
    adminSessionCookieName: parsed.data.NEXT_PUBLIC_ADMIN_SESSION_COOKIE_NAME,
    mobileAdminTapCount: (parsed.data.NEXT_PUBLIC_MOBILE_ADMIN_TAP_COUNT as unknown as number) || 5,
  },
  database: {
    provider: parsed.data.DATABASE_PROVIDER,
  },
  ai: {
    openrouterApiKey: parsed.data.OPENROUTER_API_KEY,
    provider: parsed.data.INFERENCE_PROVIDER,
    model: parsed.data.INFERENCE_MODEL,
    ollamaBaseUrl: parsed.data.OLLAMA_BASE_URL,
  },
  mongodb: {
    uri: parsed.data.MONGODB_URI,
  },
  cloudinary: {
    cloudName: parsed.data.CLOUDINARY_CLOUD_NAME,
    apiKey: parsed.data.CLOUDINARY_API_KEY,
    apiSecret: parsed.data.CLOUDINARY_API_SECRET,
    url: parsed.data.CLOUDINARY_URL,
    isConfigured: Boolean(parsed.data.CLOUDINARY_CLOUD_NAME || parsed.data.CLOUDINARY_URL),
  },
  app: {
    env: parsed.data.NODE_ENV,
    port: parsed.data.PORT,
    projectName: parsed.data.PROJECT_NAME,
    autoSaveDebounceMs: (parsed.data.NEXT_PUBLIC_AUTO_SAVE_DEBOUNCE_MS as unknown as number) || 1500,
  },
} as const;

export default config;
