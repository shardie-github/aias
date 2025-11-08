# Quick Start - Backend Configuration

## 🚀 One-Time Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

**Required values** (get from https://supabase.com/dashboard/project/{your-project-ref}):
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

**Important**: Replace `${SUPABASE_SERVICE_ROLE_KEY}` in `DATABASE_URL` with the actual key.

### 3. Generate Prisma Client
```bash
pnpm run db:generate
```

### 4. Run Migrations
```bash
pnpm run db:migrate
```

### 5. Verify Setup
```bash
pnpm run doctor
```

## ✅ Daily Development

```bash
pnpm run dev
```

## 🔧 Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm run db:generate` | Generate Prisma client (WASM) |
| `pnpm run db:migrate` | Run database migrations |
| `pnpm run doctor` | Full backend validation |
| `pnpm run smoke` | Lightweight CI tests |
| `pnpm run build` | Build for production |

## 📋 Secrets Checklist

### Vercel (Production)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_JWT_SECRET`
- [ ] `DATABASE_URL`
- [ ] `DIRECT_URL`
- [ ] `PRISMA_CLIENT_ENGINE_TYPE=wasm`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`

### GitHub Actions (CI)
- [ ] All Vercel secrets above
- [ ] `VERCEL_TOKEN` (optional)
- [ ] `SUPABASE_ACCESS_TOKEN` (optional)
- [ ] `SUPABASE_PROJECT_REF` (your Supabase project reference)

## 🧪 Testing

### Local Health Check
```bash
curl http://localhost:3000/api/healthz
```

### Production Health Check
```bash
curl https://your-app.vercel.app/api/healthz
```

### Edge Function Health Check
```bash
curl https://{project-ref}.supabase.co/functions/v1/app-health \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"
```

Replace `{project-ref}` with your actual Supabase project reference.

## 📚 Documentation

- **Secrets**: `docs/secrets.md`
- **Development**: `docs/dev.md`
- **Deployment**: `docs/deploy.md`
- **Health Checks**: `docs/health.md`
- **OAuth**: `docs/oauth.md`
- **Rollback**: `docs/rollback.md`

## 🆘 Troubleshooting

### "Missing environment variables"
→ Check `.env.local` exists and has all required vars

### "Prisma Client not generated"
→ Run `pnpm run db:generate`

### "Database connection failed"
→ Verify `DATABASE_URL` includes `sslmode=require`
→ Check Supabase project is active

### "RLS not working"
→ Run migrations: `pnpm run db:migrate`
→ Check policies in Supabase Dashboard

## 🎯 Next Steps

1. Set secrets in Vercel (see `docs/secrets.md`)
2. Set secrets in GitHub Actions
3. Run migrations: `pnpm run db:migrate`
4. Deploy Edge Functions (see `docs/deploy.md`)
5. Verify health endpoint works
6. Configure OAuth (optional, see `docs/oauth.md`)
