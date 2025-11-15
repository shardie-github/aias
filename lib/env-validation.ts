/**
 * Runtime Environment Variable Validation with Zod Schema
 * 
 * This module provides comprehensive type-safe validation for environment variables.
 * Import and call validateEnvOnStartup() in your app initialization.
 */

import { z } from "zod";
import { validateEnv } from "./env";

/**
 * Zod schema for environment variable validation
 * Provides type-safe validation with detailed error messages
 */
export const envSchema = z.object({
  // Supabase Configuration
  SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(1).optional(),
  SUPABASE_PROJECT_REF: z.string().min(1).optional(),
  SUPABASE_ACCESS_TOKEN: z.string().min(1).optional(),

  // Database Configuration
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // Application Configuration
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_ENV: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // OAuth Configuration (optional)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Stripe Configuration (optional)
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),

  // Storage Configuration (optional)
  NEXT_PUBLIC_UPLOAD_BUCKET: z.string().default("public"),
  SIGNING_SECRET: z.string().optional(),

  // CI/CD Configuration (optional)
  VERCEL_TOKEN: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  VERCEL_ORG_ID: z.string().optional(),

  // Redis/Caching (optional)
  REDIS_URL: z.string().url().optional(),

  // Admin Access (optional)
  ADMIN_BASIC_AUTH: z.string().optional(),

  // Preview Protection (optional)
  PREVIEW_REQUIRE_AUTH: z.string().transform((val) => val === "true").optional(),

  // Monitoring & Observability (optional)
  SENTRY_DSN: z.string().url().optional(),
  DATADOG_API_KEY: z.string().optional(),
  NEW_RELIC_LICENSE_KEY: z.string().optional(),
  OTEL_SERVICE_NAME: z.string().default("aias-platform"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  ENABLE_OTEL: z.string().transform((val) => val === "true").optional(),

  // Email Configuration (optional)
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform((val) => parseInt(val, 10)).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  // GitHub Integration (optional)
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_OWNER: z.string().optional(),
  GITHUB_REPO: z.string().optional(),

  // Health Check Configuration (optional)
  HEALTH_URL: z.string().url().optional(),

  // Marketing & Ads Integrations (optional)
  META_ACCESS_TOKEN: z.string().optional(),
  META_AD_ACCOUNT_ID: z.string().optional(),
  TIKTOK_ACCESS_TOKEN: z.string().optional(),
  TIKTOK_ADVERTISER_ID: z.string().optional(),

  // E-commerce Integrations (optional)
  SHOPIFY_API_KEY: z.string().optional(),
  SHOPIFY_PASSWORD: z.string().optional(),
  SHOPIFY_STORE: z.string().optional(),

  // AI/ML Services (optional)
  OPENAI_API_KEY: z.string().startsWith("sk-").optional(),
  ELEVENLABS_API_KEY: z.string().optional(),
  CAPCUT_API_KEY: z.string().optional(),

  // Automation Platforms (optional)
  ZAPIER_SECRET: z.string().optional(),
  MINDSTUDIO_API_KEY: z.string().optional(),
  AUTODS_API_KEY: z.string().optional(),

  // Notification & Webhooks (optional)
  SLACK_WEBHOOK_URL: z.string().url().optional(),
  TELEMETRY_WEBHOOK_URL: z.string().url().optional(),
  ERROR_WEBHOOK_URL: z.string().url().optional(),
  RELIABILITY_ALERT_WEBHOOK: z.string().url().optional(),

  // Orchestrator Configuration (optional)
  ORCHESTRATOR_BUDGET: z.string().transform((val) => parseInt(val, 10)).optional(),
  ORCHESTRATOR_RELIABILITY_THRESHOLD: z.string().transform((val) => parseFloat(val)).optional(),
  ORCHESTRATOR_AUTO_PR: z.string().transform((val) => val === "true").optional(),
  ORCHESTRATOR_AUTO_FIX: z.string().transform((val) => val === "true").optional(),
}).refine(
  (data) => {
    // At least one Supabase URL must be present
    return !!(data.SUPABASE_URL || data.NEXT_PUBLIC_SUPABASE_URL);
  },
  {
    message: "Either SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL must be set",
    path: ["SUPABASE_URL"],
  }
).refine(
  (data) => {
    // At least one Supabase anon key must be present
    return !!(data.SUPABASE_ANON_KEY || data.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  },
  {
    message: "Either SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY must be set",
    path: ["SUPABASE_ANON_KEY"],
  }
);

/**
 * Validated environment variables type
 */
export type ValidatedEnv = z.infer<typeof envSchema>;

/**
 * Validate environment variables with Zod schema
 * Returns validated and typed environment variables
 */
export function validateEnvWithZod(): {
  success: boolean;
  data?: ValidatedEnv;
  errors?: z.ZodError;
} {
  try {
    const data = envSchema.parse(process.env);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Validate environment variables at application startup
 * Call this in your app's entry point or middleware
 */
export function validateEnvOnStartup(): void {
  if (typeof window !== 'undefined') {
    // Client-side: Environment variables are already validated at build time
    // Next.js will fail the build if required NEXT_PUBLIC_* vars are missing
    return;
  }

  // First try Zod validation for better error messages
  const zodValidation = validateEnvWithZod();
  
  if (!zodValidation.success && zodValidation.errors) {
    const errorMessage = [
      '❌ Application startup failed: Environment variable validation errors',
      '',
      ...zodValidation.errors.errors.map((err) => {
        const path = err.path.join('.');
        return `  - ${path}: ${err.message}`;
      }),
      '',
      'Please set these variables in:',
      '  - Vercel: Dashboard → Settings → Environment Variables',
      '  - Supabase: Dashboard → Settings → API',
      '  - GitHub Actions: Repository → Settings → Secrets',
      '  - Local: .env.local file',
      '',
      'See .env.example for all required variables.'
    ].join('\n');

    console.error(errorMessage);
    
    // In production, fail fast
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment variable validation failed. See logs for details.');
    }
    return;
  }

  // Fallback to original validation
  const validation = validateEnv();
  
  if (!validation.valid) {
    const errorMessage = [
      '❌ Application startup failed: Missing required environment variables',
      '',
      ...validation.errors.map(err => `  - ${err}`),
      '',
      'Please set these variables in:',
      '  - Vercel: Dashboard → Settings → Environment Variables',
      '  - Supabase: Dashboard → Settings → API',
      '  - GitHub Actions: Repository → Settings → Secrets',
      '  - Local: .env.local file',
      '',
      'See .env.example for all required variables.'
    ].join('\n');

    console.error(errorMessage);
    
    // In production, fail fast
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required environment variables. See logs for details.');
    }
  }
}

/**
 * Validate environment variables for API routes
 * Use this in API route handlers that require specific variables
 */
export function validateApiEnv(requiredVars: string[]): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get validated environment variable safely
 * Returns undefined if validation fails or variable is missing
 */
export function getValidatedEnvVar<T extends keyof ValidatedEnv>(
  key: T
): ValidatedEnv[T] | undefined {
  const validation = validateEnvWithZod();
  if (validation.success && validation.data) {
    return validation.data[key];
  }
  return undefined;
}
