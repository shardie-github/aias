/**
 * Centralized Environment Variable Management
 * 
 * This module provides a single source of truth for all environment variables.
 * It ensures that:
 * 1. All variables are loaded dynamically at runtime
 * 2. Required variables are validated
 * 3. No hardcoded values exist in the codebase
 * 4. Variables can be sourced from Vercel, Supabase, or GitHub Actions
 * 
 * Environment variables are automatically available from:
 * - Vercel: Set in Vercel Dashboard → Settings → Environment Variables
 * - Supabase: Set in Supabase Dashboard → Settings → API
 * - GitHub Actions: Set in Repository → Settings → Secrets and variables → Actions
 * - Local: Set in .env.local (not committed to git)
 */

/**
 * Runtime environment detection
 */
function getRuntimeEnv(): 'vercel' | 'github' | 'local' | 'unknown' {
  if (typeof process !== 'undefined') {
    if (process.env.VERCEL) return 'vercel';
    if (process.env.GITHUB_ACTIONS) return 'github';
    if (process.env.NODE_ENV === 'development') return 'local';
  }
  return 'unknown';
}

/**
 * Get environment variable with validation
 * Works in both Node.js and Edge runtime environments
 */
function getEnvVar(key: string, required: boolean = true, defaultValue?: string): string {
  // Check process.env (Node.js/Next.js)
  let value: string | undefined;
  
  // Edge runtime compatibility: process.env is available but may be limited
  if (typeof process !== 'undefined') {
    try {
      value = process.env[key];
    } catch (e) {
      // Edge runtime may not have full process.env access
    }
  }
  
  // Check import.meta.env (Vite/Edge runtime)
  try {
    if (typeof import !== 'undefined' && import.meta && import.meta.env) {
      value = value || import.meta.env[key] || import.meta.env[`VITE_${key}`];
    }
  } catch (e) {
    // import.meta may not be available in all contexts
  }
  
  // Use default if provided
  if (!value && defaultValue !== undefined) {
    value = defaultValue;
  }
  
  // Validate required variables
  if (required && !value) {
    const runtime = getRuntimeEnv();
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Runtime: ${runtime}\n` +
      `Please set this variable in:\n` +
      `- Vercel: Dashboard → Settings → Environment Variables\n` +
      `- Supabase: Dashboard → Settings → API\n` +
      `- GitHub Actions: Repository → Settings → Secrets\n` +
      `- Local: .env.local file`
    );
  }
  
  return value || '';
}

/**
 * Environment variable configuration
 * All variables are loaded dynamically at runtime
 */
export const env = {
  // Supabase Configuration - Check multiple possible env var names
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', false) || getEnvVar('SUPABASE_URL', true),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', false) || getEnvVar('SUPABASE_ANON_KEY', true),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', true),
    jwtSecret: getEnvVar('SUPABASE_JWT_SECRET', false),
  },
  
  // Database Configuration
  database: {
    url: getEnvVar('DATABASE_URL', true),
    directUrl: getEnvVar('DIRECT_URL', false),
  },
  
  // Application Configuration
  app: {
    env: getEnvVar('NEXT_PUBLIC_APP_ENV', false, 'production'),
    siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL', false) || 
             getEnvVar('NEXT_PUBLIC_APP_URL', false) || 
             getEnvVar('NEXTAUTH_URL', false) || 
             '',
    nextAuthUrl: getEnvVar('NEXTAUTH_URL', false),
    nextAuthSecret: getEnvVar('NEXTAUTH_SECRET', false),
    logLevel: getEnvVar('LOG_LEVEL', false, 'info'),
  },
  
  // OAuth Configuration
  oauth: {
    github: {
      clientId: getEnvVar('GITHUB_CLIENT_ID', false),
      clientSecret: getEnvVar('GITHUB_CLIENT_SECRET', false),
    },
    google: {
      clientId: getEnvVar('GOOGLE_CLIENT_ID', false),
      clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET', false),
    },
  },
  
  // Stripe Configuration
  stripe: {
    secretKey: getEnvVar('STRIPE_SECRET_KEY', false),
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', false),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', false),
  },
  
  // Storage Configuration
  storage: {
    uploadBucket: getEnvVar('NEXT_PUBLIC_UPLOAD_BUCKET', false, 'public'),
    signingSecret: getEnvVar('SIGNING_SECRET', false),
  },
  
  // Vercel Configuration (for CI/CD)
  vercel: {
    token: getEnvVar('VERCEL_TOKEN', false),
  },
  
  // Supabase CLI Configuration (for migrations)
  supabaseCli: {
    accessToken: getEnvVar('SUPABASE_ACCESS_TOKEN', false),
    projectRef: getEnvVar('SUPABASE_PROJECT_REF', false),
  },
  
  // Runtime information
  runtime: {
    env: getRuntimeEnv(),
    isProduction: getEnvVar('NODE_ENV', false, 'development') === 'production',
    isDevelopment: getEnvVar('NODE_ENV', false, 'development') === 'development',
  },
} as const;

/**
 * Validate all required environment variables at startup
 * Call this in your app initialization
 */
export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    // Validate required Supabase vars (check multiple possible names)
    if (!env.supabase.url) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL is required');
    }
    if (!env.supabase.anonKey) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY is required');
    }
    if (!env.supabase.serviceRoleKey) {
      errors.push('SUPABASE_SERVICE_ROLE_KEY is required');
    }
    if (!env.database.url) {
      errors.push('DATABASE_URL is required');
    }
  } catch (error: any) {
    errors.push(error.message);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get environment variable safely (returns undefined if not set)
 * Use this for optional variables
 */
export function getOptionalEnv(key: string): string | undefined {
  try {
    return getEnvVar(key, false);
  } catch {
    return undefined;
  }
}

/**
 * Export individual getters for convenience
 */
export const getSupabaseUrl = () => env.supabase.url;
export const getSupabaseAnonKey = () => env.supabase.anonKey;
export const getSupabaseServiceKey = () => env.supabase.serviceRoleKey;
export const getDatabaseUrl = () => env.database.url;
export const getStripeSecretKey = () => env.stripe.secretKey;
export const getStripeWebhookSecret = () => env.stripe.webhookSecret;
