import { z } from 'zod';

const envSchema = z.object({
  // Core
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // Redis
  REDIS_URL: z.string().url(),

  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PRICE_BASIC: z.string(),
  STRIPE_PRICE_PRO: z.string(),
  STRIPE_PRICE_ADDON: z.string(),

  // AI Providers
  AI_PRIMARY_PROVIDER: z.enum(['openai', 'anthropic', 'gemini']).default('openai'),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),

  // Observability
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  METRICS_TOKEN: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  POSTMARK_API_TOKEN: z.string().optional(),

  // Security
  ENCRYPTION_KEY: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  CSP_REPORT_URI: z.string().url().optional(),

  // Feature Flags
  ENABLE_LEMON_SQUEEZY: z.string().transform(val => val === 'true').default('false'),
  ENABLE_SENTRY: z.string().transform(val => val === 'true').default('false'),
  ENABLE_OTEL: z.string().transform(val => val === 'true').default('true'),
});

export const env = envSchema.parse(process.env);

export const config = {
  app: {
    name: 'AI Consultancy',
    url: env.NEXT_PUBLIC_APP_URL,
    env: env.NODE_ENV,
  },
  database: {
    url: env.DATABASE_URL,
    directUrl: env.DIRECT_URL,
  },
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
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
    primaryProvider: env.AI_PRIMARY_PROVIDER,
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
    lemonSqueezy: env.ENABLE_LEMON_SQUEEZY,
    sentry: env.ENABLE_SENTRY,
    otel: env.ENABLE_OTEL,
  },
} as const;

export type Config = typeof config;