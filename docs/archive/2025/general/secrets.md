> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Secrets Management

This document explains where to set secrets for the AIAS Platform backend.

## Vercel Project Environment Variables

Set these in your Vercel project dashboard under **Settings → Environment Variables**:

### Core Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL (https://{project-ref}.supabase.co)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_URL` - Supabase URL (same as above)
- `SUPABASE_ANON_KEY` - Supabase anonymous key (server-side)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (keep secret!)
- `SUPABASE_JWT_SECRET` - Supabase JWT secret

### Database
- `DATABASE_URL` - Full PostgreSQL connection string with service role key
- `DIRECT_URL` - Direct PostgreSQL connection (same as DATABASE_URL for Supabase)

### Prisma
- `PRISMA_CLIENT_ENGINE_TYPE` - Set to `wasm` (required for Termux/Android compatibility)

### App Configuration
- `NEXTAUTH_URL` - Your app URL (e.g., https://your-app.vercel.app)
- `NEXTAUTH_SECRET` - NextAuth secret (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_ENV` - Environment (`production`, `development`, `preview`)
- `LOG_LEVEL` - Logging level (`info`, `debug`, `warn`, `error`)

### OAuth Providers (if enabled)
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Storage (if used)
- `NEXT_PUBLIC_UPLOAD_BUCKET` - Storage bucket name (default: `public`)
- `SIGNING_SECRET` - Storage signing secret (if using signed URLs)

## GitHub Actions Secrets

Set these in your GitHub repository under **Settings → Secrets and variables → Actions**:

### All Vercel Secrets (for CI)
Copy all the Vercel environment variables listed above to GitHub Actions secrets with the same names.

### CI-Specific Secrets
- `VERCEL_TOKEN` - Vercel API token (if using Vercel CLI in CI)
- `SUPABASE_ACCESS_TOKEN` - Supabase access token (if deploying migrations via CI)
- `SUPABASE_PROJECT_REF` - Supabase project reference (`ghqyxhbyyirveptgwoqm`)

## How to Set Secrets

### Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable with the appropriate environment (Production, Preview, Development)
4. Click **Save**

### GitHub Actions
1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Add each secret with the exact name listed above
5. Click **Add secret**

## Security Notes

- **Never commit secrets** to the repository
- Use different values for each environment (dev/staging/prod)
- Rotate secrets regularly (especially service role keys)
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS - keep it extremely secure
- Use Vercel's environment variable scoping (Production vs Preview vs Development)

## Getting Supabase Secrets

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/{your-project-ref}
2. Navigate to **Settings → API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
4. Navigate to **Settings → Auth → JWT Settings**
5. Copy **JWT Secret** → `SUPABASE_JWT_SECRET`

**Note**: Replace `{your-project-ref}` with your actual Supabase project reference.

## Verifying Secrets

After setting secrets, run:
```bash
pnpm run doctor
```

This will validate that all required secrets are present and accessible.
