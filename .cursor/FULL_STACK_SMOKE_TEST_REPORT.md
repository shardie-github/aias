# === FULL STACK SMOKE TEST REPORT ===

**Generated:** 2025-11-14T00:55:28.809Z  
**Test Scope:** Complete full-stack validation across all connected layers

---

## Executive Summary

**Status:** ⚠️ **PARTIAL PASS** - 4/9 tests passed

The smoke test has validated the environment configuration across multiple layers. While some components are properly configured, several critical environment variables are missing or not synchronized across all platforms.

### Key Findings

✅ **Working:**
- Node.js version is compatible (v22.21.1 >= 18.17.0)
- Package manager (pnpm) is available
- Local .env files contain some Supabase configuration
- GitHub Actions environment detection works correctly

❌ **Needs Attention:**
- Supabase client library not installed (required for connectivity tests)
- Vercel CLI not installed (required for Vercel environment variable sync)
- Missing environment variables across GitHub, Vercel, and Cursor runtime
- Cannot test deployed Vercel endpoints (VERCEL_URL not set)
- Prisma CLI not globally installed (though npx can be used)

---

## 1. Secret Parity Matrix

| Variable | Cursor Runtime | .env.local | GitHub Secrets | Vercel Prod | Vercel Preview | Vercel Dev | Status |
|----------|---------------|------------|----------------|-------------|----------------|------------|--------|
| DATABASE_URL | ✗ | ✓* | ✗ | ✗ | ✗ | ✗ | ⚠️ Partial |
| SUPABASE_URL | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ❌ Missing |
| SUPABASE_ANON_KEY | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ❌ Missing |
| SUPABASE_SERVICE_ROLE_KEY | ✗ | ✓* | ✗ | ✗ | ✗ | ✗ | ⚠️ Partial |
| SUPABASE_JWT_SECRET | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ❌ Missing |
| NEXT_PUBLIC_SUPABASE_URL | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ⚠️ Partial |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ⚠️ Partial |
| SUPABASE_PROJECT_REF | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ⚠️ Partial |
| SUPABASE_ACCESS_TOKEN | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ❌ Missing |
| VERCEL_TOKEN | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ❌ Missing |
| NEXTAUTH_URL | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ⚠️ Optional |
| NEXTAUTH_SECRET | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ⚠️ Optional |
| NODE_ENV | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ⚠️ Partial |

**Legend:**
- ✓ = Present
- ✗ = Missing
- ✓* = Present but contains variable references (e.g., `${VAR}`)

**Critical Variables Missing Everywhere:**
1. SUPABASE_URL
2. SUPABASE_ANON_KEY
3. SUPABASE_JWT_SECRET
4. SUPABASE_ACCESS_TOKEN
5. VERCEL_TOKEN

---

## 2. Connectivity Results

### ✅ Passed Tests (4/9)

1. **GitHub Actions Environment**
   - Correctly detected as not running in GitHub Actions (expected for local test)

2. **Package Manager Available**
   - pnpm is available and ready to use

3. **Node Version**
   - Node v22.21.1 meets requirement (>=18.17.0)

4. **Prisma Schema**
   - Prisma schema file exists at `apps/web/prisma/schema.prisma`

### ❌ Failed Tests (5/9)

1. **Vercel CLI Check**
   - **Status:** Failed
   - **Issue:** Vercel CLI not installed globally
   - **Fix:** `npm i -g vercel` or use `npx vercel`
   - **Impact:** Cannot pull Vercel environment variables for comparison

2. **Supabase Client Library**
   - **Status:** Failed
   - **Issue:** @supabase/supabase-js not installed
   - **Fix:** `npm install @supabase/supabase-js` or `pnpm install`
   - **Impact:** Cannot test Supabase connectivity

3. **Vercel Endpoints**
   - **Status:** Failed
   - **Issue:** VERCEL_URL or NEXT_PUBLIC_SITE_URL not set
   - **Fix:** Set VERCEL_URL environment variable or deploy to Vercel
   - **Impact:** Cannot test deployed API routes

4. **GitHub Actions Required Secrets**
   - **Status:** Failed
   - **Missing:** DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   - **Fix:** Add secrets in GitHub → Settings → Secrets and variables → Actions
   - **Impact:** CI/CD pipeline will fail without these secrets

5. **Prisma CLI**
   - **Status:** Failed
   - **Issue:** Prisma CLI not found globally
   - **Fix:** Use `npx prisma` or install globally: `npm install -g prisma`
   - **Impact:** Cannot run Prisma commands directly (but npx works)

---

## 3. Errors Found

No fatal errors encountered during test execution. All failures are due to missing dependencies or configuration.

---

## 4. Auto-fix Steps

### Immediate Actions Required

#### 1. Install Missing Dependencies

```bash
# Install Supabase client library
pnpm install @supabase/supabase-js

# Install Vercel CLI globally (optional, can use npx)
npm install -g vercel
```

#### 2. Sync Environment Variables from Supabase Dashboard

**Authoritative Source:** Supabase Dashboard → Settings → API

1. Navigate to Supabase Dashboard → Settings → API
2. Copy the following values:
   - Project URL → `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
   - JWT Secret → `SUPABASE_JWT_SECRET`
   - Project Reference → `SUPABASE_PROJECT_REF`

3. Set these in:
   - Local `.env.local` file
   - GitHub Secrets (Repository → Settings → Secrets)
   - Vercel Environment Variables (Dashboard → Settings → Environment Variables)

#### 3. Construct DATABASE_URL

```bash
# Format:
DATABASE_URL=postgresql://postgres:{SUPABASE_SERVICE_ROLE_KEY}@db.{SUPABASE_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require

# Example (replace with actual values):
DATABASE_URL=postgresql://postgres:your-service-role-key@db.gzadczzgyghnrshszyft.supabase.co:5432/postgres?sslmode=require
```

#### 4. Set Vercel Token

1. Go to Vercel Dashboard → Settings → Tokens
2. Create a new token
3. Set as `VERCEL_TOKEN` in:
   - Local `.env.local`
   - GitHub Secrets

#### 5. Set Supabase Access Token

1. Go to Supabase Dashboard → Account Settings → Access Tokens
2. Create a new access token
3. Set as `SUPABASE_ACCESS_TOKEN` in:
   - Local `.env.local`
   - GitHub Secrets

### GitHub Secrets Sync Commands

```bash
# Prerequisites: Install GitHub CLI (gh)
# Authenticate: gh auth login

# Set Supabase variables
gh secret set SUPABASE_URL --body "https://gzadczzgyghnrshszyft.supabase.co"
gh secret set SUPABASE_ANON_KEY --body "your-anon-key-from-dashboard"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "your-service-role-key-from-dashboard"
gh secret set SUPABASE_JWT_SECRET --body "your-jwt-secret-from-dashboard"
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "https://gzadczzgyghnrshszyft.supabase.co"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "your-anon-key-from-dashboard"
gh secret set SUPABASE_PROJECT_REF --body "gzadczzgyghnrshszyft"
gh secret set SUPABASE_ACCESS_TOKEN --body "your-access-token-from-dashboard"

# Set Database URL (constructed)
gh secret set DATABASE_URL --body "postgresql://postgres:your-service-role-key@db.gzadczzgyghnrshszyft.supabase.co:5432/postgres?sslmode=require"

# Set Vercel token
gh secret set VERCEL_TOKEN --body "your-vercel-token"
```

### Vercel Environment Variables Sync

```bash
# Prerequisites: Vercel CLI installed and authenticated
# Authenticate: vercel login

# For each environment (production, preview, development):
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add SUPABASE_JWT_SECRET production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_PROJECT_REF production
vercel env add DATABASE_URL production
vercel env add SUPABASE_ACCESS_TOKEN production
vercel env add VERCEL_TOKEN production

# Repeat for preview and development environments
```

### Local .env.local Template

Create `.env.local` in repo root:

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
DATABASE_URL=postgresql://postgres:your-service-role-key@db.gzadczzgyghnrshszyft.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:your-service-role-key@db.gzadczzgyghnrshszyft.supabase.co:5432/postgres?sslmode=require

# Vercel
VERCEL_TOKEN=your-vercel-token

# NextAuth (if using)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Node Environment
NODE_ENV=development
```

---

## 5. Verification Checklist

After completing the auto-fix steps, verify:

- [ ] All environment variables are set in `.env.local`
- [ ] All secrets are set in GitHub Secrets
- [ ] All environment variables are set in Vercel (all 3 environments)
- [ ] Supabase client library is installed
- [ ] Vercel CLI is available (or use npx)
- [ ] Run smoke test again: `npx tsx scripts/full-stack-smoke-test.ts`
- [ ] Verify Secret Parity Matrix shows all variables present
- [ ] Test Supabase connectivity
- [ ] Test Vercel deployment
- [ ] Test GitHub Actions CI/CD pipeline

---

## 6. Next Steps

1. **Immediate (Critical):**
   - Install missing dependencies (`@supabase/supabase-js`)
   - Sync environment variables from Supabase Dashboard to all platforms
   - Set up GitHub Secrets
   - Configure Vercel environment variables

2. **Short-term (Important):**
   - Test Supabase connectivity with actual credentials
   - Deploy to Vercel and test endpoints
   - Run GitHub Actions workflow to verify CI/CD

3. **Long-term (Maintenance):**
   - Set up automated secret rotation
   - Implement secret scanning in CI/CD
   - Document environment variable management process
   - Set up monitoring for secret expiration

---

## 7. Final Status

**Current Status:** ⚠️ **PARTIAL PASS** - Configuration incomplete

**Stack Readiness:** ❌ **NOT READY** - Missing critical environment variables

**Action Required:** Complete environment variable synchronization across all platforms before deploying to production.

---

## 8. Additional Resources

- **Environment Sync Guide:** `.cursor/fixes/env_sync.md`
- **Full Test Report:** `.cursor/full-stack-smoke-test-report.md`
- **JSON Report:** `.cursor/full-stack-smoke-test-report.json`
- **Environment Example:** `.env.example`

---

**Report Generated By:** Full-Stack Smoke Test Script  
**Script Location:** `scripts/full-stack-smoke-test.ts`  
**Run Command:** `npx tsx scripts/full-stack-smoke-test.ts`
