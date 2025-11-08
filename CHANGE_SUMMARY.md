# Backend Configuration - Change Summary

This document summarizes all changes made to configure the backend with Supabase + Prisma, Vercel integration, secrets management, migrations, Edge Functions, Realtime, OAuth, RLS, health checks, and CI/CD.

## Files Created

### Environment & Configuration
- `.env.example` - Complete environment variable template with placeholders for Supabase project ref
- `docs/secrets.md` - Comprehensive guide for setting secrets in Vercel and GitHub Actions

### Database & Migrations
- `supabase/migrations/20250122000000_rls_realtime_storage.sql` - RLS policies, Realtime publication, Storage buckets, and API logs tables

### Edge Functions
- `supabase/functions/app-health/index.ts` - Health check Edge Function
- `supabase/functions/webhook-ingest/index.ts` - Webhook ingestion Edge Function

### API Routes
- `app/api/healthz/route.ts` - Comprehensive health check endpoint

### Scripts
- `scripts/reality-check.ts` - Full backend validation script (replaces `doctor.ts`)
- `scripts/smoke.ts` - Lightweight CI/CD smoke tests

### Documentation
- `docs/dev.md` - Development setup guide (Termux/Android friendly)
- `docs/oauth.md` - OAuth configuration guide (GitHub, Google)
- `docs/health.md` - Health check endpoints documentation
- `docs/deploy.md` - Vercel deployment guide
- `docs/rollback.md` - Database rollback procedures

## Files Modified

### Configuration
- `apps/web/prisma/schema.prisma` - Updated to use `env("PRISMA_CLIENT_ENGINE_TYPE")` for WASM engine
- `package.json` - Updated scripts:
  - `db:migrate`: Changed to `prisma migrate deploy` (production-ready)
  - `db:generate`: Added Prisma client generation script
  - `doctor`: Updated to use `reality-check.ts`
  - `smoke`: Added smoke test script
  - All Prisma commands now use `cd apps/web` prefix

### CI/CD
- `.github/workflows/ci.yml` - Added:
  - Prisma client generation step
  - Database migration step
  - Smoke tests in production deployment
  - Environment variables for all steps

## Key Features Implemented

### 1. Environment Variables
- ✅ Complete `.env.example` with all required Supabase keys
- ✅ Uses placeholders `{project-ref}` for Supabase project reference
- ✅ Database URL format: `postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.{project-ref}.supabase.co:5432/postgres?sslmode=require`
- ✅ Prisma WASM engine: `PRISMA_CLIENT_ENGINE_TYPE=wasm` (Termux/Android compatible)

### 2. Database Schema
- ✅ Prisma schema uses env var for engine type
- ✅ Supabase migrations for RLS, Realtime, Storage
- ✅ API logs and app events tables created
- ✅ Idempotent migrations (safe to run multiple times)

### 3. Row Level Security (RLS)
- ✅ RLS enabled on all app tables
- ✅ Policies for service role bypass
- ✅ User-owned data policies (own read/write)
- ✅ Public read policies where appropriate

### 4. Realtime
- ✅ Publication `supabase_realtime` created
- ✅ Tables added to publication (profiles, posts, journal_entries, app_events)
- ✅ Idempotent configuration

### 5. Storage
- ✅ `public` bucket (public read, authenticated upload)
- ✅ `private` bucket (owner-only access)
- ✅ Storage policies configured
- ✅ File size limits: 50MB
- ✅ MIME type restrictions

### 6. Edge Functions
- ✅ `app-health`: Returns DB/Auth/Realtime status
- ✅ `webhook-ingest`: Generic webhook logging to `api_logs`

### 7. Health Checks
- ✅ `/api/healthz`: Comprehensive health endpoint
- ✅ Tests: Database, Auth, RLS, Storage
- ✅ Returns latency metrics
- ✅ Edge runtime compatible

### 8. OAuth
- ✅ Documentation for GitHub OAuth
- ✅ Documentation for Google OAuth
- ✅ Redirect URI configuration documented
- ✅ Environment variables documented

### 9. CI/CD
- ✅ Prisma client generation in CI
- ✅ Database migrations in CI
- ✅ Smoke tests in production deployment
- ✅ All required secrets documented

### 10. Scripts
- ✅ `pnpm run doctor`: Full reality check (validates all components)
- ✅ `pnpm run smoke`: Lightweight CI tests
- ✅ `pnpm run db:migrate`: Production migrations
- ✅ `pnpm run db:generate`: Prisma client generation

## Next Steps

### 1. Set Secrets in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables and set:

```
NEXT_PUBLIC_SUPABASE_URL=https://{project-ref}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase Dashboard>
SUPABASE_URL=https://{project-ref}.supabase.co
SUPABASE_ANON_KEY=<from Supabase Dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase Dashboard>
SUPABASE_JWT_SECRET=<from Supabase Dashboard>
DATABASE_URL=postgresql://postgres:<SERVICE_ROLE_KEY>@db.{project-ref}.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:<SERVICE_ROLE_KEY>@db.{project-ref}.supabase.co:5432/postgres?sslmode=require
PRISMA_CLIENT_ENGINE_TYPE=wasm
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXT_PUBLIC_APP_ENV=production
LOG_LEVEL=info
```

Replace `{project-ref}` with your actual Supabase project reference.

**Get Supabase Secrets**:
1. Go to https://supabase.com/dashboard/project/{your-project-ref}
2. Settings → API → Copy keys
3. Settings → Auth → JWT Settings → Copy JWT Secret

### 2. Set Secrets in GitHub Actions

Go to GitHub Repository → Settings → Secrets and variables → Actions and add the same secrets as above, plus:

```
VERCEL_TOKEN=<if using Vercel CLI in CI>
SUPABASE_ACCESS_TOKEN=<if deploying migrations via CI>
SUPABASE_PROJECT_REF=ghqyxhbyyirveptgwoqm
```

### 3. Run Migrations

**Local**:
```bash
pnpm run db:migrate
```

**Via Supabase Dashboard**:
1. Go to SQL Editor
2. Copy contents of `supabase/migrations/20250122000000_rls_realtime_storage.sql`
3. Run the SQL

**Via Supabase CLI** (if configured):
```bash
supabase link --project-ref {project-ref}
supabase db push
```

Replace `{project-ref}` with your actual Supabase project reference.

### 4. Deploy Edge Functions

```bash
# Login to Supabase
supabase login

# Link project
supabase link --project-ref ghqyxhbyyirveptgwoqm

# Deploy functions
supabase functions deploy app-health
supabase functions deploy webhook-ingest
```

### 5. Verify Setup

**Local**:
```bash
pnpm run doctor
```

**Production**:
```bash
curl https://your-app.vercel.app/api/healthz
```

**Edge Function**:
```bash
curl https://{project-ref}.supabase.co/functions/v1/app-health \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
```

Replace `{project-ref}` with your actual Supabase project reference.

### 6. Configure OAuth (Optional)

See `docs/oauth.md` for:
- GitHub OAuth setup
- Google OAuth setup
- Redirect URI configuration

## Commands Reference

### Development
```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Start dev server
pnpm run dev

# Run reality check
pnpm run doctor

# Run smoke tests
pnpm run smoke
```

### Production
```bash
# Build
pnpm run build

# Deploy to Vercel
vercel --prod

# Run migrations (in CI or manually)
pnpm run db:migrate
```

## Verification Checklist

- [ ] All environment variables set in Vercel
- [ ] All secrets set in GitHub Actions
- [ ] Database migrations applied
- [ ] Edge Functions deployed
- [ ] `/api/healthz` returns `{"ok": true}`
- [ ] `pnpm run doctor` passes locally
- [ ] CI pipeline runs successfully
- [ ] OAuth configured (if using)
- [ ] Storage buckets accessible
- [ ] RLS policies working (anon reads fail where intended)

## Support

- **Secrets**: See `docs/secrets.md`
- **Development**: See `docs/dev.md`
- **Deployment**: See `docs/deploy.md`
- **Health Checks**: See `docs/health.md`
- **OAuth**: See `docs/oauth.md`
- **Rollback**: See `docs/rollback.md`

## Notes

- **Prisma WASM Engine**: Required for Termux/Android compatibility. Always set `PRISMA_CLIENT_ENGINE_TYPE=wasm`.
- **Database URL**: Must include `sslmode=require` for Supabase connections.
- **Migrations**: All migrations are idempotent (safe to run multiple times).
- **RLS**: Service role key bypasses RLS - keep it secure!
- **Health Checks**: Both `/api/healthz` and Edge Function `app-health` are available.
