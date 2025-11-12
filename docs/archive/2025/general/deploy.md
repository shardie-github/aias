> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Deployment Guide

This guide covers deploying the AIAS Platform backend to Vercel with Supabase and Prisma.

## Prerequisites

- Vercel account
- Supabase project
- GitHub repository connected to Vercel

## One-Time Setup

### 1. Link Vercel Project

```bash
vercel link
```

Follow the prompts to link your local project to a Vercel project.

### 2. Pull Environment Variables

```bash
vercel env pull .env.local
```

This downloads environment variables from Vercel (if already set).

### 3. Set Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

**Required Variables** (see [docs/secrets.md](./secrets.md) for full list):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `DATABASE_URL`
- `DIRECT_URL`
- `PRISMA_CLIENT_ENGINE_TYPE` (set to `wasm`)
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

**OAuth Variables** (if using OAuth):

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Set each variable for:
- **Production**: Production deployments
- **Preview**: Preview deployments (PRs)
- **Development**: Local development (optional)

### 4. Configure Build Settings

Vercel should auto-detect Next.js. Verify in **Settings → General**:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm run build` (or `npm run build`)
- **Output Directory**: `.next`
- **Install Command**: `pnpm install` (or `npm install`)

### 5. Add Build Step for Prisma

In **Settings → Build & Development Settings**, add a build command:

```bash
pnpm run db:generate && pnpm run build
```

Or update `package.json` scripts to include Prisma generation in build:

```json
{
  "scripts": {
    "build": "pnpm run db:generate && next build"
  }
}
```

## Deployment Process

### Automatic Deployment (Recommended)

1. Push to `main` branch → Auto-deploys to Production
2. Open a PR → Auto-deploys to Preview
3. Merge PR → Auto-deploys to Production

### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Post-Deployment Steps

### 1. Run Database Migrations

Migrations run automatically in CI (see `.github/workflows/ci.yml`). To run manually:

```bash
# Via Supabase CLI (if configured)
supabase db push

# Or via Prisma (if using Prisma migrations)
pnpm run db:migrate
```

### 2. Verify Health Endpoint

```bash
curl https://your-app.vercel.app/api/healthz
```

Should return `{"ok": true, ...}`.

### 3. Run Smoke Tests

```bash
pnpm run smoke
```

Or set `HEALTH_URL` and run:

```bash
HEALTH_URL=https://your-app.vercel.app/api/healthz pnpm run smoke
```

## CI/CD Integration

### GitHub Actions

The repository includes `.github/workflows/ci.yml` which:

1. Runs quality gates (lint, typecheck)
2. Generates Prisma client
3. Runs database migrations
4. Builds the application
5. Runs smoke tests

**Required GitHub Secrets**:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `PRISMA_CLIENT_ENGINE_TYPE` (set to `wasm`)

See [docs/secrets.md](./secrets.md) for full list.

## Environment-Specific Configuration

### Production

- Set `NEXT_PUBLIC_APP_ENV=production`
- Use production Supabase project
- Set production OAuth redirect URIs
- Enable error tracking (Sentry, etc.)

### Preview (PR Deployments)

- Set `NEXT_PUBLIC_APP_ENV=preview`
- Can use same Supabase project (with RLS)
- Use preview OAuth apps (optional)
- Enable preview error tracking

### Development

- Set `NEXT_PUBLIC_APP_ENV=development`
- Use development Supabase project (optional)
- Local OAuth redirects to `localhost:3000`

## Troubleshooting

### Build Fails: "Prisma Client not generated"

**Solution**: Add Prisma generation to build command:

```bash
pnpm run db:generate && pnpm run build
```

Or update `package.json`:

```json
{
  "scripts": {
    "build": "pnpm run db:generate && next build"
  }
}
```

### Build Fails: "Missing DATABASE_URL"

**Solution**: Ensure `DATABASE_URL` is set in Vercel environment variables for the correct environment (Production/Preview).

### Deployment Succeeds but App Errors

1. Check Vercel function logs: **Deployments → [Deployment] → Functions**
2. Verify environment variables are set correctly
3. Run health check: `curl https://your-app.vercel.app/api/healthz`
4. Check Supabase logs: Dashboard → Logs

### Database Migrations Not Applied

**Solution**: Migrations run in CI. To apply manually:

```bash
# Via Supabase CLI
supabase db push

# Or via Prisma
DATABASE_URL=$DATABASE_URL pnpm run db:migrate
```

### Health Check Fails After Deployment

1. Verify all environment variables are set
2. Check Supabase project is active
3. Review health endpoint logs in Vercel
4. Run `pnpm run doctor` locally with production env vars

## Rollback

If a deployment fails:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

Or via CLI:

```bash
vercel rollback [deployment-url]
```

For database rollbacks, see [docs/rollback.md](./rollback.md).

## Monitoring

### Vercel Analytics

- Go to **Analytics** tab in Vercel dashboard
- Monitor function execution times
- Review error rates

### Supabase Dashboard

- Monitor database performance
- Review auth logs
- Check storage usage

### Health Checks

Set up external monitoring to ping `/api/healthz`:

- UptimeRobot
- Pingdom
- Custom cron job

## Next Steps

- See [docs/secrets.md](./secrets.md) for secret management
- See [docs/health.md](./health.md) for health check details
- See [docs/rollback.md](./rollback.md) for rollback procedures
