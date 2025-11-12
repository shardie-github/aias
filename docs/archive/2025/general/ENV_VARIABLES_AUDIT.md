> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Environment Variables Audit Summary

## Overview
This document summarizes the audit and fixes applied to ensure all environment variables and secrets are loaded dynamically from GitHub repo secrets, Supabase env, Vercel env, or project `.env` files at runtime.

## Changes Made

### 1. SEO Configuration (`src/lib/seo.ts`)
- **Fixed**: Hardcoded URLs replaced with dynamic environment variable loading
- **Changes**:
  - Added `getBaseUrl()` function that checks multiple env var sources:
    - `NEXT_PUBLIC_SITE_URL`
    - `NEXT_PUBLIC_APP_URL`
    - `NEXTAUTH_URL`
    - Falls back to default only if none are set
  - All canonical URLs, OG images, and structured data URLs now use `BASE_URL` constant
  - `SEOService` constructor now accepts optional baseUrl parameter

### 2. Partnerships Module (`src/lib/partnerships.ts`)
- **Fixed**: Hardcoded base URL in `createReferralLink()` function
- **Changes**:
  - Now checks multiple environment variable sources dynamically
  - Supports both Node.js (`process.env`) and Vite (`import.meta.env`) patterns

### 3. Email Templates (`lib/gamification/email.ts`)
- **Fixed**: Hardcoded app URLs in email templates
- **Changes**:
  - All email links now check multiple env var sources:
    - `NEXT_PUBLIC_SITE_URL`
    - `NEXT_PUBLIC_APP_URL`
    - `NEXTAUTH_URL`
  - Falls back to `http://localhost:3000` only for local development

### 4. Queues Module (`packages/lib/queues.ts`)
- **Fixed**: Hardcoded Supabase storage URL
- **Changes**:
  - `uploadPdf()` now extracts Supabase project ref from `SUPABASE_URL` env var
  - Dynamically constructs storage URL from environment variables
  - Validates that `SUPABASE_URL` is set before attempting upload

### 5. Config Package (`packages/config/index.ts`)
- **Fixed**: Strict validation that failed on missing optional variables
- **Changes**:
  - Made most environment variables optional (except critical ones)
  - Added helper functions `getAppUrl()` and `getSupabaseUrl()` that check multiple env var sources
  - Uses `safeParse()` to handle missing optional vars gracefully
  - Provides clear error messages when required vars are missing

### 6. Notification Center (`src/components/platform/NotificationCenter.tsx`)
- **Fixed**: Hardcoded WebSocket URL
- **Changes**:
  - WebSocket URL now checks:
    - `NEXT_PUBLIC_WS_URL`
    - `REACT_APP_WS_URL`
    - Falls back to constructing URL from `window.location` if available
    - Only uses `ws://localhost:8080` as final fallback

### 7. Supabase Functions
- **Fixed**: Added validation for missing environment variables
- **Changes**:
  - `booking-api/index.ts`: Added validation for `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
  - `lead-gen-api/index.ts`: Added validation for `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
  - All Supabase functions already use `Deno.env.get()` correctly (no changes needed)

## Environment Variable Sources

The codebase now supports loading environment variables from multiple sources in this order:

1. **Vercel**: Set in Vercel Dashboard → Settings → Environment Variables
2. **Supabase**: Set in Supabase Dashboard → Settings → API
3. **GitHub Actions**: Set in Repository → Settings → Secrets and variables → Actions
4. **Local**: Set in `.env.local` file (not committed to git)

## Key Environment Variables

### Required (Core)
- `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

### Optional (Application)
- `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_APP_URL` or `NEXTAUTH_URL` (for app URLs)
- `NEXT_PUBLIC_WS_URL` or `REACT_APP_WS_URL` (for WebSocket connections)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (if using Stripe)
- `OPENAI_API_KEY` (if using OpenAI)
- `RESEND_API_KEY` (if using Resend for emails)

## Verification

All hardcoded values have been replaced with dynamic environment variable loading. The codebase:
- ✅ No hardcoded API keys or secrets
- ✅ No hardcoded URLs (except fallbacks for local development)
- ✅ All Supabase configurations use env vars
- ✅ All Stripe configurations use env vars
- ✅ All email templates use env vars for URLs
- ✅ All SEO configurations use env vars for URLs
- ✅ All WebSocket connections use env vars
- ✅ Proper error messages when required vars are missing

## Testing Recommendations

1. **Local Development**: Ensure `.env.local` has all required variables
2. **Vercel**: Verify all environment variables are set in Vercel dashboard
3. **Supabase**: Verify Supabase functions have access to required env vars
4. **GitHub Actions**: Verify secrets are set in repository settings

## Notes

- The codebase uses a fallback pattern: check multiple possible env var names, then fall back to defaults only for local development
- Production deployments should never rely on fallback values
- All environment variable access is validated at runtime with clear error messages
