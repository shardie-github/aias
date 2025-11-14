# Full-Stack Smoke Test Report

**Generated:** 2025-11-14T00:55:51.117Z

## Summary

- **Status:** FAIL
- **Total Tests:** 9
- **Passed:** 4
- **Failed:** 5

## 1. Secret Parity Matrix

| Variable | Cursor | .env.local | GitHub | Vercel Prod | Vercel Preview | Vercel Dev |
|----------|--------|------------|--------|-------------|----------------|------------|
| DATABASE_URL | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| SUPABASE_URL | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| SUPABASE_ANON_KEY | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| SUPABASE_SERVICE_ROLE_KEY | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| SUPABASE_JWT_SECRET | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| NEXT_PUBLIC_SUPABASE_URL | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| SUPABASE_PROJECT_REF | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| SUPABASE_ACCESS_TOKEN | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| VERCEL_TOKEN | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| NEXTAUTH_URL | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| NEXTAUTH_SECRET | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| NODE_ENV | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |

## 2. Connectivity Results

### ❌ Vercel CLI Check

Vercel CLI not installed. Install with: npm i -g vercel

### ❌ Supabase Client Library

@supabase/supabase-js not installed. Install with: npm install @supabase/supabase-js

### ❌ Vercel Endpoints

VERCEL_URL or NEXT_PUBLIC_SITE_URL not set. Cannot test deployed endpoints.

### ✅ GitHub Actions Environment

Not running in GitHub Actions (expected for local test)

### ❌ GitHub Actions Required Secrets

Missing secrets: DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

### ✅ Package Manager Available

pnpm is available

### ✅ Node Version

Node v22.21.1 (required: >=18.x)

### ✅ Prisma Schema

Prisma schema file exists

### ❌ Prisma DATABASE_URL

DATABASE_URL not set


## 4. Auto-fix Steps

Missing DATABASE_URL in: Cursor, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Construct DATABASE_URL using SUPABASE_SERVICE_ROLE_KEY
  → Format: postgresql://postgres:{service-role-key}@db.{project-ref}.supabase.co:5432/postgres?sslmode=require
Missing SUPABASE_URL in: Cursor, .env.local, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Get SUPABASE_URL from Supabase Dashboard → Settings → API
Missing SUPABASE_ANON_KEY in: Cursor, .env.local, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Get SUPABASE_ANON_KEY from Supabase Dashboard → Settings → API
Missing SUPABASE_SERVICE_ROLE_KEY in: Cursor, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Get SUPABASE_SERVICE_ROLE_KEY from Supabase Dashboard → Settings → API
Missing SUPABASE_JWT_SECRET in: Cursor, .env.local, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Get SUPABASE_JWT_SECRET from Supabase Dashboard → Settings → API
Missing NEXT_PUBLIC_SUPABASE_URL in: Cursor, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Get NEXT_PUBLIC_SUPABASE_URL from Supabase Dashboard → Settings → API
Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in: Cursor, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Get NEXT_PUBLIC_SUPABASE_ANON_KEY from Supabase Dashboard → Settings → API
Missing SUPABASE_PROJECT_REF in: Cursor, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Get SUPABASE_PROJECT_REF from Supabase Dashboard → Settings → API
Missing SUPABASE_ACCESS_TOKEN in: Cursor, .env.local, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Get SUPABASE_ACCESS_TOKEN from Supabase Dashboard → Settings → API
Missing VERCEL_TOKEN in: Cursor, .env.local, GitHub, Vercel Production, Vercel Preview, Vercel Development
  → Get VERCEL_TOKEN from Vercel Dashboard → Settings → Tokens
Missing NEXTAUTH_URL in: Cursor, .env.local, GitHub, Vercel Production, Vercel Preview, Vercel Development
Missing NEXTAUTH_SECRET in: Cursor, .env.local, GitHub, Vercel Production, Vercel Preview, Vercel Development
Missing NODE_ENV in: Cursor, GitHub, Vercel Production, Vercel Preview, Vercel Development


## 5. Final Status

**FAIL** - 4/9 tests passed

❌ Some smoke tests failed. Please review the errors and auto-fix steps above.
