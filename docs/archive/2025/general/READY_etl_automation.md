> Archived on 2025-11-12. Superseded by: (see docs/final index)

# READY: Nightly ETL Automation

**Owner:** Data Engineer  
**KPI:** ETL runs successfully 100% of nights, metrics available by 9am ET  
**Priority:** P1  
**30-Day Signal:** 100% success rate, <5min runtime  
**Effort:** Low (3 days)  
**Impact Score:** 7/10

---

## Problem Statement

Manual data pulling from Meta Ads, TikTok Ads, and Shopify. Missing automated ETL that populates metrics_daily table. Estimated time savings: 10hrs/week.

## Solution

Automate nightly ETL:
1. Pull Meta Ads spend → `spend` table
2. Pull TikTok Ads spend → `spend` table
3. Pull Shopify orders → `orders` table
4. Compute daily metrics → `metrics_daily` table
5. Run via GitHub Actions cron (01:10 ET)

## Implementation Plan

### Phase 1: ETL Scripts (Day 1)
- Create `scripts/etl/pull_ads_meta.ts`
- Create `scripts/etl/pull_ads_tiktok.ts`
- Create `scripts/etl/pull_shopify_orders.ts`
- Create `scripts/etl/compute_metrics.ts`

### Phase 2: GitHub Actions (Day 2)
- Create `infra/gh-actions/nightly-etl.yml`
- Configure cron: `10 1 * * *` (01:10 ET)
- Add error notifications

### Phase 3: Testing & Monitoring (Day 3)
- Test ETL locally
- Deploy to GitHub Actions
- Add monitoring/alerting

## Success Metrics

- **30-Day:** 100% success rate, <5min runtime
- **60-Day:** Metrics available by 8am ET (1hr earlier)
- **90-Day:** Add real-time metrics (not just daily)

## Guardrails

- Retry on failure (3 attempts)
- Alert on failure (Slack/email)
- Idempotent (safe to re-run)

## Dependencies

- Meta Ads API access
- TikTok Ads API access
- Shopify API access
- Supabase database access

## Notes

- Start with daily, add hourly later if needed
- Cache API responses to avoid rate limits
