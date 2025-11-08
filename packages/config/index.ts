import { z } from 'zod';

const envSchema = z.object({
  // Core - Load dynamically from environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Database - Load dynamically from environment
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),

  // Supabase - Load dynamically from environment
  SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Redis - Optional
  REDIS_URL: z.string().url().optional(),

  // Stripe - Optional (required only if using Stripe)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_BASIC: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),
  STRIPE_PRICE_ADDON: z.string().optional(),

  // AI Providers - Optional
  AI_PRIMARY_PROVIDER: z.enum(['openai', 'anthropic', 'gemini']).default('openai'),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),

  // Observability - Optional
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  METRICS_TOKEN: z.string().optional(),

  // Email - Optional
  RESEND_API_KEY: z.string().optional(),
  POSTMARK_API_TOKEN: z.string().optional(),

  // Security - Load dynamically, validate if provided
  ENCRYPTION_KEY: z.string().min(32).optional(),
  JWT_SECRET: z.string().min(32).optional(),
  CSP_REPORT_URI: z.string().url().optional(),

  // Feature Flags
  ENABLE_LEMON_SQUEEZY: z.string().transform(val => val === 'true').default('false'),
  ENABLE_SENTRY: z.string().transform(val => val === 'true').default('false'),
  ENABLE_OTEL: z.string().transform(val => val === 'true').default('true'),
});

// Parse with safeParse to handle missing optional vars gracefully
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.warn('⚠️  Some environment variables are missing or invalid:', parseResult.error.format());
}

export const env = parseResult.success ? parseResult.data : {} as z.infer<typeof envSchema>;

// Helper to get app URL from multiple possible env vars
function getAppUrl(): string {
  return env.NEXT_PUBLIC_SITE_URL || 
         env.NEXT_PUBLIC_APP_URL || 
         env.NEXTAUTH_URL || 
         'https://aias-consultancy.com';
}

// Helper to get Supabase URL from multiple possible env vars
function getSupabaseUrl(): string {
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  if (!url) {
    throw new Error(
      'Missing required environment variable: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL\n' +
      'Please set this variable in:\n' +
      '- Vercel: Dashboard → Settings → Environment Variables\n' +
      '- Supabase: Dashboard → Settings → API\n' +
      '- GitHub Actions: Repository → Settings → Secrets\n' +
      '- Local: .env.local file'
    );
  }
  return url;
}

// Helper to get Supabase anon key from multiple possible env vars
function getSupabaseAnonKey(): string {
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      'Missing required environment variable: SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
      'Please set this variable in:\n' +
      '- Vercel: Dashboard → Settings → Environment Variables\n' +
      '- Supabase: Dashboard → Settings → API\n' +
      '- GitHub Actions: Repository → Settings → Secrets\n' +
      '- Local: .env.local file'
    );
  }
  return key;
}

export const config = {
  app: {
    name: 'AI Consultancy',
    url: getAppUrl(),
    env: env.NODE_ENV || 'development',
  },
  database: {
    url: env.DATABASE_URL,
    directUrl: env.DIRECT_URL,
  },
  supabase: {
    url: getSupabaseUrl(),
    anonKey: getSupabaseAnonKey(),
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  redis: {
    url: env.REDIS_URL,
  },
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    prices: {
      basic: env.STRIPE_PRICE_BASIC,
      pro: env.STRIPE_PRICE_PRO,
      addon: env.STRIPE_PRICE_ADDON,
    },
  },
  ai: {
    primaryProvider: env.AI_PRIMARY_PROVIDER || 'openai',
    providers: {
      openai: env.OPENAI_API_KEY,
      anthropic: env.ANTHROPIC_API_KEY,
      google: env.GOOGLE_API_KEY,
    },
  },
  observability: {
    otelEndpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
    sentryDsn: env.SENTRY_DSN,
    metricsToken: env.METRICS_TOKEN,
  },
  email: {
    resend: env.RESEND_API_KEY,
    postmark: env.POSTMARK_API_TOKEN,
  },
  security: {
    encryptionKey: env.ENCRYPTION_KEY,
    jwtSecret: env.JWT_SECRET,
    cspReportUri: env.CSP_REPORT_URI,
  },
  features: {
    lemonSqueezy: env.ENABLE_LEMON_SQUEEZY || false,
    sentry: env.ENABLE_SENTRY || false,
    otel: env.ENABLE_OTEL !== false,
  },
} as const;

export type Config = typeof config;