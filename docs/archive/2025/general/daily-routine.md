> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Daily Routine - 15-Minute Startup Checklist

**Purpose:** Quick daily operations check-in to ensure all automated systems are running smoothly.

## Morning Routine (15 minutes)

### 1. System Health Check (5 min)
- [ ] Check GitHub Actions status: https://github.com/YOUR_ORG/YOUR_REPO/actions
- [ ] Review Supabase dashboard for errors/warnings
- [ ] Check Vercel deployment status
- [ ] Review automated reports in `/ops/dashboards/reports/` (if generated)

### 2. Analytics Overview (5 min)
- [ ] Check marketing dashboard for new leads
- [ ] Review finance dashboard for yesterday's revenue (CAD)
- [ ] Scan KPI tracker for anomalies
- [ ] Check automated email/slack notifications for critical alerts

### 3. Quick Actions (5 min)
- [ ] Address any urgent support tickets (if any)
- [ ] Review automated social posts scheduled for today
- [ ] Check for pending grant/investor application deadlines
- [ ] Note any manual interventions needed from automation logs

## What Runs Automatically

### Daily (Automated)
- ✅ Analytics scripts run → commit reports to `/ops/dashboards/reports/`
- ✅ Supabase billing snapshot → updates finance dashboard
- ✅ Form submissions → Notion CRM + Gmail follow-up
- ✅ Stripe sales → Supabase → Google Sheet → Slack DM
- ✅ Social posts → auto-logged to marketing dashboard
- ✅ Database backups → Supabase scheduled backups

### Weekly (Automated)
- ✅ Supabase migration + backup weekly (Sunday 2 AM EST)
- ✅ Weekly analytics summary report generation
- ✅ Automated investor CRM updates (if configured)
- ✅ Community engagement posts (if scheduled)

### Monthly (Automated)
- ✅ Finance dashboard export for tax prep (CAD)
- ✅ Grant application deadline reminders
- ✅ Vendor contract renewal reminders

## Manual Fallback Procedures

If automation fails:

1. **Analytics Reports Not Generated**
   ```bash
   npm run ops snapshot
   # Manually run analytics scripts if needed
   ```

2. **Supabase Backup Failed**
   ```bash
   supabase db dump -f backup-$(date +%Y%m%d).sql
   ```

3. **Marketing Automation Down**
   - Check Zapier/Make dashboard
   - Manually export leads from form submissions
   - Update CRM manually if needed

4. **Finance Dashboard Not Updated**
   - Export Stripe data manually
   - Update `/ops/dashboards/finance-dashboard-template.xlsx`
   - Recalculate GST/HST manually if needed

## Offline Mode

If internet connection is unavailable:
- Reports export to `/ops/logs/offline-YYYYMMDD.csv`
- Sync to Supabase when connection restored
- Audit logs maintained locally in `/ops/logs/`

## Quick Commands Reference

```bash
# Check system status
npm run ops doctor

# Generate manual reports
npm run ops snapshot

# View recent logs
tail -f /ops/logs/audit.log

# Manual finance export
node scripts/export-finance.js

# Manual marketing sync
node scripts/sync-marketing.js
```

## Success Metrics

Daily targets:
- ✅ 0 critical errors in logs
- ✅ All automated workflows showing "success" status
- ✅ < 5 minutes manual intervention needed
- ✅ Support tickets < 24hr response time

---

**Last Updated:** 2025-01-XX  
**Next Review:** Quarterly
