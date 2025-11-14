# Environment Variables Configuration Guide

This document explains how environment variables and secrets are managed across Supabase, GitHub Actions, Vercel, and local development environments.

## Overview

All environment variables are loaded dynamically at runtime. No hardcoded secrets exist in the codebase. The configuration follows a **source of truth** pattern where Supabase holds the canonical values.

---

## 1. Supabase (Source of Truth)

Supabase Dashboard → Settings → API holds the canonical values for all Supabase-related environment variables.

### Required Variables in Supabase

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | Construct from service role key |
| `SUPABASE_URL` | Your Supabase project URL | Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Anonymous/public key | Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) | Settings → API → service_role key |
| `SUPABASE_JWT_SECRET` | JWT signing secret | Settings → API → JWT Secret |
| `SUPABASE_PROJECT_REF` | Project reference ID | Found in project URL |

### Database URL Format

```
postgresql://postgres:{SUPABASE_SERVICE_ROLE_KEY}@db.{SUPABASE_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require
```

**⚠️ Security Warning:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It bypasses Row Level Security (RLS).

---

## 2. GitHub Actions Secrets

GitHub Actions workflows require server-side secrets to run builds, tests, and deployments.

### Required Secrets

Add these in: **Repository → Settings → Secrets and variables → Actions → New repository secret**

#### Core Supabase Secrets
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Anonymous/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-side only)
- `SUPABASE_JWT_SECRET` - JWT signing secret
- `SUPABASE_PROJECT_REF` - Project reference ID
- `SUPABASE_ACCESS_TOKEN` - For Supabase CLI operations

#### Public Variables (for client-side builds)
- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key

#### CI/CD Secrets
- `VERCEL_TOKEN` - Vercel API token for deployments
- `GITHUB_TOKEN` - GitHub token (usually auto-provided)

#### Optional Secrets
- `OPENAI_API_KEY` - For AI features
- `STRIPE_SECRET_KEY` - For payment processing
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhooks
- `REDIS_URL` - For caching (if used)

### Usage in Workflows

Secrets are accessed via `${{ secrets.SECRET_NAME }}`:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

---

## 3. Vercel Environment Variables

Vercel requires environment variables for all deployment environments (Production, Preview, Development).

### Required Variables

Add these in: **Vercel Dashboard → Your Project → Settings → Environment Variables**

#### Server-Side Variables (All Environments)
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_PROJECT_REF`
- `NEXTAUTH_URL` - Your app URL (e.g., `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

#### Public Variables (All Environments)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` - Your app URL
- `NEXT_PUBLIC_APP_ENV` - `production`, `preview`, or `development`

#### Optional Variables
- `STRIPE_SECRET_KEY` - For payment features
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For payment features
- `OPENAI_API_KEY` - For AI features
- `REDIS_URL` - For caching
- `SENTRY_DSN` - For error tracking
- `RESEND_API_KEY` - For transactional emails

### Environment-Specific Configuration

Vercel supports different values per environment:
- **Production**: Use production Supabase project values
- **Preview**: Can use staging Supabase project or same as production
- **Development**: Use local development values

### Pulling Environment Variables Locally

To sync Vercel environment variables to your local `.env.local`:

```bash
vercel env pull .env.local
```

This requires:
1. Vercel CLI installed: `npm i -g vercel`
2. Logged in: `vercel login`
3. Project linked: `vercel link`

---

## 4. Local Development Pattern

### Setup Steps

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in values from Supabase:**
   - Open Supabase Dashboard → Settings → API
   - Copy values to `.env.local`
   - Construct `DATABASE_URL` using the format above

3. **Or pull from Vercel:**
   ```bash
   vercel env pull .env.local
   ```

4. **Verify `.env.local` is gitignored:**
   ```bash
   git check-ignore .env.local
   # Should output: .env.local
   ```

### File Structure

```
.env.example          # Template (committed to git)
.env.local            # Your local values (gitignored)
.env.production       # Production overrides (gitignored)
.env.development.local # Development overrides (gitignored)
```

### Environment Variable Loading Order

Next.js loads environment variables in this order (later overrides earlier):
1. `.env`
2. `.env.local`
3. `.env.development` / `.env.production` / `.env.test`
4. `.env.development.local` / `.env.production.local` / `.env.test.local`

**Best Practice:** Use `.env.local` for all local development values.

---

## 5. Setup Checklist

Use this checklist to ensure all environments are properly configured:

### Supabase Configuration
- [ ] Create Supabase project (if not exists)
- [ ] Copy `SUPABASE_URL` from Settings → API
- [ ] Copy `SUPABASE_ANON_KEY` from Settings → API
- [ ] Copy `SUPABASE_SERVICE_ROLE_KEY` from Settings → API
- [ ] Copy `SUPABASE_JWT_SECRET` from Settings → API
- [ ] Note `SUPABASE_PROJECT_REF` from project URL
- [ ] Construct `DATABASE_URL` using service role key

### GitHub Actions Secrets
- [ ] Add `DATABASE_URL` secret
- [ ] Add `SUPABASE_URL` secret
- [ ] Add `SUPABASE_ANON_KEY` secret
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` secret
- [ ] Add `SUPABASE_JWT_SECRET` secret
- [ ] Add `SUPABASE_PROJECT_REF` secret
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` secret
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` secret
- [ ] Add `VERCEL_TOKEN` secret (if using Vercel deployments)
- [ ] Run Env Smoke Test CI workflow to verify

### Vercel Environment Variables
- [ ] Add all server-side variables to Production environment
- [ ] Add all server-side variables to Preview environment
- [ ] Add all server-side variables to Development environment
- [ ] Add all `NEXT_PUBLIC_*` variables to all environments
- [ ] Set `NEXTAUTH_URL` to production URL for Production
- [ ] Set `NEXTAUTH_URL` to preview URL for Preview
- [ ] Generate and set `NEXTAUTH_SECRET` for all environments
- [ ] Deploy and verify `/api/health` endpoint returns `ok: true`

### Local Development
- [ ] Create `.env.local` from `.env.example`
- [ ] Fill in all Supabase values
- [ ] Set `NODE_ENV=development`
- [ ] Set `NEXT_PUBLIC_APP_ENV=development`
- [ ] Verify `.env.local` is gitignored
- [ ] Run `npm run dev` and verify app starts
- [ ] Test `/api/health` endpoint locally

### Verification
- [ ] Run Env Smoke Test CI workflow
- [ ] Deploy to Vercel Preview
- [ ] Call `/api/health` on Preview deployment
- [ ] Verify all required env vars are present
- [ ] Check logs for any missing variable warnings

---

## 6. Environment Variable Reference

### Required Server-Side Variables

| Variable | Required For | Description |
|----------|--------------|-------------|
| `DATABASE_URL` | Database connections | PostgreSQL connection string |
| `SUPABASE_URL` | Supabase API | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase API | Anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase | Service role key (bypasses RLS) |
| `SUPABASE_JWT_SECRET` | JWT validation | JWT signing secret |
| `SUPABASE_PROJECT_REF` | Supabase CLI | Project reference ID |

### Required Public Variables

| Variable | Required For | Description |
|----------|--------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side Supabase | Public Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side Supabase | Public anonymous key |

### Optional Variables

See `.env.example` for a complete list of optional variables including:
- Stripe configuration
- OAuth providers
- Monitoring services
- Email configuration
- AI/ML services
- Feature flags

---

## 7. Troubleshooting

### Missing Environment Variable Error

If you see: `Missing required environment variable: VARIABLE_NAME`

1. **Check the source:**
   - Local: Verify `.env.local` exists and contains the variable
   - Vercel: Check Settings → Environment Variables
   - GitHub Actions: Check Repository → Settings → Secrets

2. **Verify naming:**
   - Server-side: No `NEXT_PUBLIC_` prefix
   - Client-side: Must have `NEXT_PUBLIC_` prefix

3. **Check environment:**
   - Production vs Preview vs Development may have different values
   - Ensure variable is set for the correct environment

### Health Check Failing

If `/api/health` returns `ok: false`:

1. Check the `missing` array in the response
2. Add missing variables to the appropriate environment
3. Redeploy (Vercel) or restart (local)
4. Verify again

### Build Failing in CI

If GitHub Actions build fails:

1. Check workflow logs for missing secret errors
2. Verify all required secrets are added in GitHub Settings
3. Ensure secret names match exactly (case-sensitive)
4. Run the Env Smoke Test workflow to validate

---

## 8. Security Best Practices

1. **Never commit secrets:**
   - `.env.local` is gitignored
   - Never commit `.env` files with real values
   - Use `.env.example` as template only

2. **Rotate secrets regularly:**
   - Rotate Supabase keys quarterly
   - Rotate `NEXTAUTH_SECRET` if compromised
   - Use different values for staging/production

3. **Use least privilege:**
   - Use `SUPABASE_ANON_KEY` for client-side
   - Use `SUPABASE_SERVICE_ROLE_KEY` only server-side
   - Never expose service role key to client

4. **Monitor for leaks:**
   - Use GitHub secret scanning
   - Monitor Vercel logs for exposed secrets
   - Review code before committing

---

## 9. Additional Resources

- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

## 10. Support

If you encounter issues:

1. Check this documentation
2. Verify all checklist items are complete
3. Review error messages and logs
4. Check Supabase/Vercel/GitHub documentation
5. Contact the platform team for assistance

---

**Last Updated:** Generated automatically during environment audit
**Maintained By:** Platform Team
