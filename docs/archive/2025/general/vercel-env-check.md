> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Vercel Environment Variables Matrix

**Generated:** $(date)
**Project:** aias-platform
**Default Branch:** main

## Environment Variable Naming Conventions

### Browser-Safe Variables (NEXT_PUBLIC_*)
These variables are exposed to the browser and should never contain secrets.

| Variable Name | Required | Present | Notes |
|--------------|----------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ⚠️ | Check Vercel Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ⚠️ | Check Vercel Dashboard |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ | ⚠️ | Optional, defaults to Vercel URL |
| `NEXT_PUBLIC_APP_ENV` | ⚠️ | ⚠️ | Optional, defaults to 'production' |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ⚠️ | ⚠️ | Required if Stripe enabled |
| `NEXT_PUBLIC_UPLOAD_BUCKET` | ⚠️ | ⚠️ | Optional, defaults to 'public' |

### Server-Only Variables (Never Exposed)
These variables are server-only and never exposed to the browser.

| Variable Name | Required | Present | Notes |
|--------------|----------|---------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ⚠️ | **CRITICAL SECRET** - Never expose |
| `SUPABASE_JWT_SECRET` | ⚠️ | ⚠️ | Optional, for JWT validation |
| `DATABASE_URL` | ✅ | ⚠️ | **CRITICAL SECRET** - Never expose |
| `DIRECT_URL` | ⚠️ | ⚠️ | Optional, for Prisma migrations |
| `NEXTAUTH_SECRET` | ⚠️ | ⚠️ | Required if NextAuth enabled |
| `STRIPE_SECRET_KEY` | ⚠️ | ⚠️ | Required if Stripe enabled |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ | ⚠️ | Required if Stripe webhooks enabled |
| `OPENAI_API_KEY` | ⚠️ | ⚠️ | Required if AI features enabled |
| `ADMIN_BASIC_AUTH` | ⚠️ | ⚠️ | Format: "username:password" (base64 encoded) |
| `GITHUB_CLIENT_SECRET` | ⚠️ | ⚠️ | Required if GitHub OAuth enabled |
| `GOOGLE_CLIENT_SECRET` | ⚠️ | ⚠️ | Required if Google OAuth enabled |
| `SIGNING_SECRET` | ⚠️ | ⚠️ | Optional, for storage signing |

### CI/CD Variables
| Variable Name | Required | Present | Notes |
|--------------|----------|---------|-------|
| `VERCEL_TOKEN` | ⚠️ | ⚠️ | For Vercel CLI in CI |
| `SUPABASE_ACCESS_TOKEN` | ⚠️ | ⚠️ | For Supabase CLI in CI |
| `SUPABASE_PROJECT_REF` | ⚠️ | ⚠️ | For Supabase CLI in CI |

## Verification Steps

### 1. Check Vercel Dashboard
```bash
# Run these commands after authenticating with Vercel CLI:
vercel env ls
vercel env pull .env.vercel.local
```

### 2. Validate Browser-Safe Variables
- ✅ All `NEXT_PUBLIC_*` variables are safe to expose
- ✅ No secrets in `NEXT_PUBLIC_*` variables
- ✅ Check that sensitive values are NOT prefixed with `NEXT_PUBLIC_`

### 3. Validate Server-Only Variables
- ✅ All secrets are server-only (no `NEXT_PUBLIC_` prefix)
- ✅ Database URLs and API keys are never exposed
- ✅ Service role keys are server-only

### 4. Environment Parity
Ensure these environments have matching variables:
- ✅ Production
- ✅ Preview
- ✅ Development (local)

## Security Checklist

- [ ] No secrets in `NEXT_PUBLIC_*` variables
- [ ] All secrets are server-only
- [ ] `ADMIN_BASIC_AUTH` is set (if preview protection enabled)
- [ ] Database URLs are never exposed to browser
- [ ] API keys are properly scoped (anon vs service role)

## Notes

- ⚠️ = Needs manual verification via Vercel Dashboard
- ✅ = Required
- ⚠️ = Optional but recommended

**Action Required:** Run `vercel env ls` to verify actual presence of variables in Vercel Dashboard.
