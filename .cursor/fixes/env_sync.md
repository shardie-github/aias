# Environment Variable Synchronization Guide

This document contains auto-generated fixes for environment variable mismatches and missing variables across the full stack.

## Authoritative Source

**Supabase Dashboard** is the authoritative source for all Supabase-related environment variables.

## Missing Environment Variables

### Critical Variables Missing Across All Sources

1. **DATABASE_URL**
   - **Source:** Construct from Supabase credentials
   - **Format:** `postgresql://postgres:{SUPABASE_SERVICE_ROLE_KEY}@db.{SUPABASE_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require`
   - **Action:** Generate using SUPABASE_SERVICE_ROLE_KEY and SUPABASE_PROJECT_REF

2. **SUPABASE_SERVICE_ROLE_KEY**
   - **Source:** Supabase Dashboard → Settings → API → Service Role Key
   - **Action:** Copy from Supabase Dashboard and set in all environments

3. **SUPABASE_JWT_SECRET**
   - **Source:** Supabase Dashboard → Settings → API → JWT Secret
   - **Action:** Copy from Supabase Dashboard and set in all environments

4. **VERCEL_TOKEN**
   - **Source:** Vercel Dashboard → Settings → Tokens
   - **Action:** Generate new token in Vercel Dashboard

5. **SUPABASE_ACCESS_TOKEN**
   - **Source:** Supabase Dashboard → Account Settings → Access Tokens
   - **Action:** Generate new access token in Supabase Dashboard

## Variables Found in .env Files

The following variables were detected in local .env files:

- `NEXT_PUBLIC_SUPABASE_URL` (from VITE_SUPABASE_URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from VITE_SUPABASE_PUBLISHABLE_KEY)
- `SUPABASE_PROJECT_REF` (from VITE_SUPABASE_PROJECT_ID)

## Sync Commands

### For GitHub Secrets

```bash
# Set Supabase variables
gh secret set SUPABASE_URL --body "$(get-value-from-supabase-dashboard)"
gh secret set SUPABASE_ANON_KEY --body "$(get-value-from-supabase-dashboard)"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "$(get-value-from-supabase-dashboard)"
gh secret set SUPABASE_JWT_SECRET --body "$(get-value-from-supabase-dashboard)"
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "$(get-value-from-supabase-dashboard)"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "$(get-value-from-supabase-dashboard)"
gh secret set SUPABASE_PROJECT_REF --body "$(get-value-from-supabase-dashboard)"
gh secret set SUPABASE_ACCESS_TOKEN --body "$(get-value-from-supabase-dashboard)"

# Set Database URL (constructed)
gh secret set DATABASE_URL --body "postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.${SUPABASE_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require"

# Set Vercel token
gh secret set VERCEL_TOKEN --body "$(get-value-from-vercel-dashboard)"
```

### For Vercel Environment Variables

```bash
# Production
vercel env add SUPABASE_URL production --token $VERCEL_TOKEN
vercel env add SUPABASE_ANON_KEY production --token $VERCEL_TOKEN
vercel env add SUPABASE_SERVICE_ROLE_KEY production --token $VERCEL_TOKEN
vercel env add SUPABASE_JWT_SECRET production --token $VERCEL_TOKEN
vercel env add NEXT_PUBLIC_SUPABASE_URL production --token $VERCEL_TOKEN
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token $VERCEL_TOKEN
vercel env add SUPABASE_PROJECT_REF production --token $VERCEL_TOKEN
vercel env add DATABASE_URL production --token $VERCEL_TOKEN

# Preview
vercel env add SUPABASE_URL preview --token $VERCEL_TOKEN
vercel env add SUPABASE_ANON_KEY preview --token $VERCEL_TOKEN
vercel env add SUPABASE_SERVICE_ROLE_KEY preview --token $VERCEL_TOKEN
vercel env add SUPABASE_JWT_SECRET preview --token $VERCEL_TOKEN
vercel env add NEXT_PUBLIC_SUPABASE_URL preview --token $VERCEL_TOKEN
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview --token $VERCEL_TOKEN
vercel env add SUPABASE_PROJECT_REF preview --token $VERCEL_TOKEN
vercel env add DATABASE_URL preview --token $VERCEL_TOKEN

# Development
vercel env add SUPABASE_URL development --token $VERCEL_TOKEN
vercel env add SUPABASE_ANON_KEY development --token $VERCEL_TOKEN
vercel env add SUPABASE_SERVICE_ROLE_KEY development --token $VERCEL_TOKEN
vercel env add SUPABASE_JWT_SECRET development --token $VERCEL_TOKEN
vercel env add NEXT_PUBLIC_SUPABASE_URL development --token $VERCEL_TOKEN
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development --token $VERCEL_TOKEN
vercel env add SUPABASE_PROJECT_REF development --token $VERCEL_TOKEN
vercel env add DATABASE_URL development --token $VERCEL_TOKEN
```

### For Local .env.local

Create or update `.env.local` with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gzadczzgyghnrshszyft.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard
SUPABASE_URL=https://gzadczzgyghnrshszyft.supabase.co
SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase-dashboard
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-dashboard
SUPABASE_PROJECT_REF=gzadczzgyghnrshszyft
SUPABASE_ACCESS_TOKEN=your-access-token-from-supabase-dashboard

# Database
DATABASE_URL=postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.gzadczzgyghnrshszyft.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.gzadczzgyghnrshszyft.supabase.co:5432/postgres?sslmode=require

# Vercel
VERCEL_TOKEN=your-vercel-token

# NextAuth (if using)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Node Environment
NODE_ENV=development
```

## Verification Steps

After syncing environment variables:

1. Run the full-stack smoke test: `npx tsx scripts/full-stack-smoke-test.ts`
2. Verify all variables are present in the Secret Parity Matrix
3. Test Supabase connectivity
4. Test Vercel deployment
5. Test GitHub Actions CI/CD pipeline

## Notes

- Never commit `.env.local` to git
- Rotate secrets regularly
- Use different values for staging/production
- Store sensitive values in Vercel/GitHub Secrets
- Supabase Dashboard is the authoritative source for Supabase-related variables
