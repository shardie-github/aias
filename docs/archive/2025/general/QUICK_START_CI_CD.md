> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Quick Start: Enable CI/CD Workflows

## TL;DR - 3 Steps

1. **Set up secrets** (5 minutes)
2. **Commit workflows** (they auto-enable)
3. **Monitor in Actions tab**

---

## Step 1: Set Up GitHub Secrets ⚙️

**Go to:** `https://github.com/[your-org]/[your-repo]/settings/secrets/actions`

**Click:** "New repository secret"

**Add these (minimum required):**
```
SUPABASE_DB_URL = postgresql://postgres:[password]@[host]:5432/postgres
```

**Optional but recommended:**
```
SUPABASE_URL = https://[project-ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key]
SLACK_WEBHOOK_URL = https://hooks.slack.com/services/YOUR/WEBHOOK
```

---

## Step 2: Commit Workflows ✅

Workflows are **already in** `.github/workflows/`:
- ✅ `preflight-self-healing.yml`
- ✅ `data-quality-self-healing.yml`
- ✅ `nightly-etl-self-healing.yml`
- ✅ `supabase-delta-apply-self-healing.yml`
- ✅ `system-health-self-healing.yml`

**Just commit and push:**
```bash
git add .github/workflows/*-self-healing.yml
git commit -m "Enable self-healing CI/CD workflows"
git push
```

**That's it!** GitHub automatically enables them. No manual "enable" button needed.

---

## Step 3: Verify They're Running 👀

1. Go to: `https://github.com/[your-org]/[your-repo]/actions`
2. You should see workflows listed
3. Click "Run workflow" to test manually

---

## When Do They Run?

| Workflow | Trigger | Schedule |
|----------|---------|----------|
| **Preflight** | On PR | Immediate |
| **Delta Migration** | On migration push | Immediate |
| **Nightly ETL** | Cron | Daily 1 AM UTC |
| **Data Quality** | Cron | Daily 2 AM UTC |
| **System Health** | Cron | Weekly Sunday |

---

## Troubleshooting

**Workflow not showing?**
- Check `.github/workflows/` directory exists
- Verify files have `.yml` extension
- Check GitHub Actions is enabled: Settings → Actions → General

**Workflow failing?**
- Check secrets are set correctly
- Review workflow logs for errors
- Test locally: `npm run preflight`

---

**Full guide:** See `docs/GITHUB_ACTIONS_SETUP.md` for detailed instructions.
