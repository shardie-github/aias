# Development Setup Guide

This guide helps you set up the AIAS Platform backend for local development, including Termux/Android compatibility.

## Prerequisites

- Node.js >= 18.17.0
- pnpm >= 8.0.0
- Supabase project access

## One-Time Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd <repository-name>
pnpm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```bash
# Get these from: https://supabase.com/dashboard/project/{your-project-ref}/settings/api
# Replace {project-ref} with your actual Supabase project reference
NEXT_PUBLIC_SUPABASE_URL=https://{project-ref}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=https://{project-ref}.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Database URL (uses service role key)
# Replace {project-ref} with your actual Supabase project reference
DATABASE_URL=postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.{project-ref}.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.{project-ref}.supabase.co:5432/postgres?sslmode=require

# Prisma (REQUIRED for Termux/Android)
PRISMA_CLIENT_ENGINE_TYPE=wasm

# App config
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_APP_ENV=development
LOG_LEVEL=info
```

**Important**: Replace `${SUPABASE_SERVICE_ROLE_KEY}` in `DATABASE_URL` with the actual key value (not the variable).

### 3. Generate Prisma Client

```bash
pnpm run db:generate
```

This generates the Prisma client with WASM engine (required for Termux/Android compatibility).

### 4. Run Database Migrations

```bash
pnpm run db:migrate
```

This applies all Supabase migrations to your database.

### 5. Verify Setup

Run the reality check script:

```bash
pnpm run doctor
```

This validates:
- Environment variables are set
- Supabase REST API is accessible
- Database connection works
- Auth service role access
- Realtime publication
- Storage buckets
- RLS policies

## Daily Development

### Start Development Server

```bash
pnpm run dev
```

The app will be available at `http://localhost:3000`.

### Run Type Checking

```bash
pnpm run typecheck
```

### Run Linting

```bash
pnpm run lint
```

### Run Tests

```bash
pnpm run test
```

## Termux/Android Specific Notes

### Why WASM Engine?

The Prisma WASM engine (`PRISMA_CLIENT_ENGINE_TYPE=wasm`) is required for Termux/Android because:
- Native Prisma binaries don't work on Android
- WASM runs in Node.js without native dependencies
- Provides full Prisma functionality without platform-specific builds

### Setting PRISMA_CLIENT_ENGINE_TYPE

**Always** set this in your `.env.local`:

```bash
PRISMA_CLIENT_ENGINE_TYPE=wasm
```

This ensures Prisma generates the WASM client, which works on all platforms including Termux.

### Verifying WASM Engine

After running `pnpm run db:generate`, check that Prisma generated WASM files:

```bash
ls -la apps/web/node_modules/.prisma/client/libquery_engine-*.wasm
```

You should see WASM engine files, not native binaries.

## Troubleshooting

### "Missing environment variables" error

- Ensure `.env.local` exists and contains all required variables
- Check that `DATABASE_URL` uses the actual service role key (not `${SUPABASE_SERVICE_ROLE_KEY}`)

### "Prisma Client not generated" error

- Run `pnpm run db:generate`
- Verify `PRISMA_CLIENT_ENGINE_TYPE=wasm` is set in `.env.local`

### Database connection errors

- Verify `DATABASE_URL` is correct and includes `sslmode=require`
- Check that your Supabase project is active
- Ensure your IP is allowed in Supabase dashboard (Settings → Database → Connection Pooling)

### Migration errors

- Check that all previous migrations have been applied
- Review migration files in `supabase/migrations/`
- Run `pnpm run db:migrate` to apply pending migrations

## Next Steps

- See [docs/secrets.md](./secrets.md) for production secret management
- See [docs/deploy.md](./deploy.md) for deployment instructions
- See [docs/health.md](./health.md) for health check endpoints
