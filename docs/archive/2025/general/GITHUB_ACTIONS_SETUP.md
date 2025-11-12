> Archived on 2025-11-12. Superseded by: (see docs/final index)

# GitHub Actions Setup Guide

**Purpose:** Step-by-step guide to configure GitHub Actions workflows with required secrets and settings.

## Required Secrets

Your GitHub Actions workflows require the following secrets to be configured in your repository settings.

### How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

### Secrets List

#### Vercel Deployment (`auto-deploy-vercel.yml`)

**VERCEL_TOKEN**
- **Description:** Vercel API token for deployments
- **How to get:** 
  1. Go to https://vercel.com/account/tokens
  2. Click **Create Token**
  3. Name it "GitHub Actions"
  4. Copy the token
- **Example:** `vercel_xxxxxxxxxxxxxxxxxxxxx`

**VERCEL_ORG_ID**
- **Description:** Your Vercel organization ID
- **How to get:**
  1. Go to https://vercel.com/account
  2. Organization ID is in URL or settings
  3. Or use: `vercel whoami` command
- **Example:** `team_xxxxxxxxxxxxxxxxxxxxx`

**VERCEL_PROJECT_ID**
- **Description:** Your Vercel project ID
- **How to get:**
  1. Go to your Vercel project settings
  2. Project ID is in the URL or settings page
- **Example:** `prj_xxxxxxxxxxxxxxxxxxxxx`

**VERCEL_PRODUCTION_URL** (Optional)
- **Description:** Production URL for E2E tests
- **Example:** `https://yourdomain.com`

#### Supabase (`supabase-weekly-maintenance.yml`)

**SUPABASE_ACCESS_TOKEN**
- **Description:** Supabase access token for CLI
- **How to get:**
  1. Go to https://supabase.com/dashboard/account/tokens
  2. Click **Generate new token**
  3. Copy the token
- **Example:** `sbp_xxxxxxxxxxxxxxxxxxxxx`

**SUPABASE_PROJECT_REF**
- **Description:** Your Supabase project reference ID
- **How to get:**
  1. Go to your Supabase project settings
  2. Project reference is in the URL (e.g., `https://supabase.com/dashboard/project/xxxxxxxxxxxxx`)
  3. Or check project settings → General
- **Example:** `xxxxxxxxxxxxxxxxxxxxx`

#### Analytics (`daily-analytics.yml`)

**SUPABASE_URL**
- **Description:** Supabase project URL
- **How to get:** Supabase project settings → API
- **Example:** `https://xxxxxxxxxxxxx.supabase.co`

**SUPABASE_KEY** or **SUPABASE_SERVICE_ROLE_KEY**
- **Description:** Supabase service role key (for server-side access)
- **How to get:** Supabase project settings → API → Service Role Key
- **Warning:** Keep this secret! Never expose in client-side code
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**STRIPE_SECRET_KEY** (Optional, for finance analytics)
- **Description:** Stripe secret key for transaction data
- **How to get:** Stripe Dashboard → Developers → API keys
- **Example:** `sk_live_xxxxxxxxxxxxxxxxxxxxx` or `sk_test_xxxxxxxxxxxxxxxxxxxxx`

**GITHUB_TOKEN** (Automatically provided)
- **Description:** GitHub token for committing reports
- **Note:** Already provided by GitHub Actions, no setup needed

#### Notifications (Optional)

**SLACK_WEBHOOK_URL** (Optional)
- **Description:** Slack webhook URL for notifications
- **How to get:**
  1. Go to https://api.slack.com/apps
  2. Create new app or use existing
  3. Add "Incoming Webhooks" feature
  4. Create webhook → copy URL
- **Example:** `https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/xxxxxxxxxxxxxxxxxxxxx`

## Workflow Setup Steps

### 1. Enable Workflows

The workflows are already in `.github/workflows/`. They will run automatically when:

- **auto-deploy-vercel.yml**: Runs on push to `main` branch
- **daily-analytics.yml**: Runs daily at 9 AM EST (14:00 UTC)
- **supabase-weekly-maintenance.yml**: Runs weekly on Sunday at 2 AM EST (7:00 UTC)

### 2. Test Workflows

**Test Auto-Deploy:**
```bash
# Push to main branch
git push origin main
# Check Actions tab in GitHub for workflow run
```

**Test Daily Analytics (Manual):**
```bash
# Go to Actions tab → daily-analytics → Run workflow
# Or trigger via GitHub API
```

**Test Supabase Maintenance (Manual):**
```bash
# Go to Actions tab → supabase-weekly-maintenance → Run workflow
```

### 3. Verify Secrets

**Check if secrets are set:**
```bash
# In GitHub repository settings → Secrets and variables → Actions
# All required secrets should be listed
```

**Test secret access (in workflow):**
```yaml
# Add this step temporarily to test
- name: Test secrets
  run: |
    echo "Testing secrets..."
    # Secrets are available as environment variables
    # Never echo them directly in logs!
```

## Workflow Customization

### Change Schedule Times

**Daily Analytics** (`daily-analytics.yml`):
```yaml
schedule:
  - cron: '0 14 * * *'  # 9 AM EST = 14:00 UTC
  # Change to your preferred time (UTC)
```

**Supabase Maintenance** (`supabase-weekly-maintenance.yml`):
```yaml
schedule:
  - cron: '0 7 * * 0'  # Sunday 2 AM EST = 7:00 UTC
  # Change to your preferred time (UTC)
```

### Disable Workflows Temporarily

**Option 1:** Comment out trigger in workflow file
```yaml
# on:
#   schedule:
#     - cron: '0 14 * * *'
```

**Option 2:** Disable in GitHub Settings
- Go to Actions → Workflows → [Workflow Name] → Disable workflow

## Troubleshooting

### Workflow Fails: "Secret not found"

**Solution:**
1. Check repository settings → Secrets
2. Verify secret name matches exactly (case-sensitive)
3. Ensure you're checking the correct repository
4. Check if secret is set at organization level (if using org)

### Workflow Fails: "Vercel authentication error"

**Solution:**
1. Verify `VERCEL_TOKEN` is correct
2. Check token hasn't expired
3. Ensure token has correct permissions
4. Try regenerating token in Vercel dashboard

### Workflow Fails: "Supabase project not found"

**Solution:**
1. Verify `SUPABASE_PROJECT_REF` is correct
2. Check `SUPABASE_ACCESS_TOKEN` is valid
3. Ensure token has access to the project
4. Try linking project manually: `supabase link --project-ref YOUR_REF`

### Reports Not Committing

**Solution:**
1. Check `GITHUB_TOKEN` permissions (should be automatic)
2. Verify workflow has write permissions
3. Check repository settings → Actions → Workflow permissions
4. Ensure "Read and write permissions" is enabled

### Analytics Scripts Not Running

**Solution:**
1. Check if scripts exist: `scripts/analytics-*.js`
2. Verify Node.js version (should be 18+)
3. Check script permissions: `chmod +x scripts/analytics-*.js`
4. Test scripts manually: `node scripts/analytics-marketing.js`

## Security Best Practices

1. **Never commit secrets** - Always use GitHub Secrets
2. **Rotate tokens regularly** - Update secrets every 90 days
3. **Use least privilege** - Give tokens minimum required permissions
4. **Review workflow logs** - Check for exposed secrets
5. **Limit secret access** - Use environment-specific secrets when possible

## Monitoring

**Check Workflow Status:**
- GitHub Actions tab → See recent runs
- Set up email notifications for failures
- Use Slack webhook for real-time alerts

**Review Generated Reports:**
- Check `ops/dashboards/reports/` directory
- Reports committed daily/weekly
- Download artifacts from Actions runs

## Next Steps

After configuring secrets:

1. ✅ Test workflows manually
2. ✅ Verify reports are generated
3. ✅ Check deployment automation
4. ✅ Set up notifications (Slack)
5. ✅ Monitor first few runs

---

**Last Updated:** 2025-01-XX  
**Need Help?** Check workflow logs in GitHub Actions tab
