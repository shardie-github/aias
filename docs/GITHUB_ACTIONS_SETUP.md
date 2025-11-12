# GitHub Actions CI/CD Setup Guide

## How GitHub Actions Works

GitHub Actions **automatically enables** workflows when YAML files are placed in `.github/workflows/`. No manual "enable" button is needed - once files are committed and pushed, GitHub detects and runs them based on their triggers.

## Workflows Created

We've created 5 workflows for the self-healing stack:

1. **`preflight-self-healing.yml`** - Preflight checks on PRs
2. **`data-quality-self-healing.yml`** - Nightly data quality checks
3. **`nightly-etl-self-healing.yml`** - Nightly ETL automation
4. **`supabase-delta-apply-self-healing.yml`** - Delta migration application
5. **`system-health-self-healing.yml`** - Weekly system health audit

## When to Enable (Step-by-Step)

### ✅ Step 1: Before Enabling (Prerequisites)

**Do this FIRST:**

1. **Set up GitHub Secrets** (Required before workflows can run):
   - Go to your GitHub repository
   - Navigate to: **Settings → Secrets and variables → Actions**
   - Click **"New repository secret"**
   - Add these secrets:

   **Required:**
   ```
   Name: SUPABASE_DB_URL
   Value: postgresql://postgres:[password]@[host]:5432/postgres
   ```

   **Optional (but recommended):**
   ```
   SUPABASE_URL=https://[project-ref].supabase.co
   SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   GENERIC_SOURCE_A_TOKEN=[token-if-using-source-a]
   GENERIC_SOURCE_B_TOKEN=[token-if-using-source-b]
   ```

2. **Test workflows locally** (Recommended):
   ```bash
   # Test preflight
   npm run preflight
   
   # Test database verification
   npm run verify:db
   
   # Test ETL dry-run
   npm run etl:events -- --dry-run
   ```

3. **Verify migrations work**:
   ```bash
   # Generate delta migration
   npm run delta:migrate
   
   # Apply migrations (if using Supabase CLI)
   supabase db push
   ```

### ✅ Step 2: Commit and Push Workflows

**The workflows are automatically enabled when you:**

1. **Commit the workflow files:**
   ```bash
   git add .github/workflows/preflight-self-healing.yml
   git add .github/workflows/data-quality-self-healing.yml
   git add .github/workflows/nightly-etl-self-healing.yml
   git add .github/workflows/supabase-delta-apply-self-healing.yml
   git add .github/workflows/system-health-self-healing.yml
   git commit -m "Add self-healing stack CI/CD workflows"
   git push
   ```

2. **GitHub automatically detects them** - No manual enable needed!

### ✅ Step 3: Verify Workflows Are Running

1. **Check GitHub Actions tab:**
   - Go to your repository on GitHub
   - Click the **"Actions"** tab
   - You should see your workflows listed

2. **Test a workflow manually:**
   - Click on a workflow (e.g., "Preflight Checks")
   - Click **"Run workflow"** dropdown
   - Select branch and click **"Run workflow"**

3. **Monitor first runs:**
   - Watch for any failures
   - Check logs if issues occur
   - Fix secrets if authentication fails

## Workflow Triggers & Schedule

### Immediate Triggers (Run on Push/PR)

1. **`preflight-self-healing.yml`**
   - **When:** On every Pull Request to `main`/`master`
   - **Also:** Manual trigger via "Run workflow" button
   - **Action:** Runs preflight checks, validates environment

2. **`supabase-delta-apply-self-healing.yml`**
   - **When:** On push to `main`/`master` if migration files change
   - **Also:** Manual trigger
   - **Action:** Applies delta migrations, verifies database

### Scheduled Triggers (Run Automatically)

3. **`nightly-etl-self-healing.yml`**
   - **When:** Daily at 1 AM UTC (8 PM ET previous day)
   - **Action:** Runs ETL pipeline (events, ads, metrics)

4. **`data-quality-self-healing.yml`**
   - **When:** Daily at 2 AM UTC (9 PM ET previous day)
   - **Action:** Computes metrics, runs data quality checks

5. **`system-health-self-healing.yml`**
   - **When:** Weekly on Sunday at midnight UTC
   - **Action:** Runs comprehensive system health audit

## Enabling/Disabling Workflows

### To Enable (Default - Already Enabled)
Workflows are **enabled by default** when files exist in `.github/workflows/`. No action needed.

### To Disable Temporarily
1. Go to **Settings → Actions → General**
2. Under **"Workflow permissions"**, you can disable workflows
3. Or rename workflow files (add `.disabled` extension)

### To Disable Permanently
Delete the workflow file:
```bash
rm .github/workflows/preflight-self-healing.yml
git commit -m "Remove preflight workflow"
git push
```

## Troubleshooting

### Workflow Not Running?

1. **Check file location:**
   - Must be in `.github/workflows/` directory
   - File must have `.yml` or `.yaml` extension

2. **Check syntax:**
   ```bash
   # Validate YAML syntax
   yamllint .github/workflows/*.yml
   ```

3. **Check GitHub Actions is enabled:**
   - Go to **Settings → Actions → General**
   - Ensure "Allow all actions and reusable workflows" is selected

4. **Check secrets:**
   - Verify secrets are set correctly
   - Check workflow logs for "secret not found" errors

### Workflow Failing?

1. **Check logs:**
   - Click on failed workflow run
   - Expand failed step
   - Look for error messages

2. **Common issues:**
   - Missing secrets → Add them in Settings → Secrets
   - Database connection failed → Check `SUPABASE_DB_URL`
   - Permission denied → Check service role key
   - Script not found → Verify file paths in workflow

3. **Test locally first:**
   ```bash
   # Run the same commands locally
   npm run preflight
   npm run verify:db
   ```

## Recommended Enablement Timeline

### 🟢 Phase 1: Immediate (Day 1)
- ✅ Set up GitHub Secrets
- ✅ Test workflows locally
- ✅ Commit and push workflow files
- ✅ Enable: `preflight-self-healing.yml` (runs on PR)

### 🟡 Phase 2: After Testing (Day 2-3)
- ✅ Monitor preflight workflow for 24 hours
- ✅ Fix any issues
- ✅ Enable: `supabase-delta-apply-self-healing.yml` (runs on migration push)

### 🟢 Phase 3: Production Ready (Day 4-7)
- ✅ Verify ETL scripts work locally
- ✅ Test data quality checks
- ✅ Enable: `nightly-etl-self-healing.yml` (scheduled)
- ✅ Enable: `data-quality-self-healing.yml` (scheduled)

### 🔵 Phase 4: Monitoring (Week 2)
- ✅ Monitor nightly jobs for 7 days
- ✅ Review system health reports
- ✅ Enable: `system-health-self-healing.yml` (weekly)

## Quick Start Checklist

- [ ] Set up GitHub Secrets (`SUPABASE_DB_URL` required)
- [ ] Test workflows locally (`npm run preflight`, `npm run verify:db`)
- [ ] Commit workflow files to `.github/workflows/`
- [ ] Push to GitHub
- [ ] Verify workflows appear in Actions tab
- [ ] Test manual workflow run
- [ ] Monitor first scheduled runs
- [ ] Set up Slack notifications (optional)

## Workflow Status Dashboard

After enabling, you can monitor workflows at:
- **GitHub Actions Tab:** `https://github.com/[org]/[repo]/actions`
- **Workflow Runs:** Click on individual workflows to see history
- **Artifacts:** Preflight reports and system health reports are uploaded as artifacts

## Next Steps

1. **Set up secrets** (if not done)
2. **Commit and push workflows** (they auto-enable)
3. **Monitor first runs** in GitHub Actions tab
4. **Review reports** in workflow artifacts
5. **Set up alerts** (Slack webhook for failures)

---

**Note:** GitHub Actions workflows are **free for public repositories** and include **2,000 minutes/month free** for private repositories. Scheduled workflows count toward usage.
