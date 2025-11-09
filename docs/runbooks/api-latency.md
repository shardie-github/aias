# Incident Runbook: API Latency Degradation

## Overview
This runbook guides response to API latency regressions exceeding SLO thresholds.

**SLO Target:** API P95 ≤ 400ms  
**Alert Threshold:** P95 > 500ms for 5+ minutes

## Pre-Incident Checklist

- [ ] Verify `/api/metrics` endpoint is accessible
- [ ] Check `/admin/reliability.json` dashboard
- [ ] Review recent deployments (last 24h)
- [ ] Check Supabase dashboard for DB latency

## Detection

### Symptoms
- `/api/metrics` shows `api_p95_ms > 400ms`
- User reports of slow page loads
- Error rate increases (>1% 5xx)
- Database query times elevated

### What to Capture

1. **Metrics Snapshot**
   ```bash
   curl https://your-domain.com/api/metrics > metrics-snapshot-$(date +%Y%m%d-%H%M%S).json
   ```

2. **Database Metrics**
   - Supabase Dashboard → Database → Query Performance
   - Capture slow queries (>500ms)
   - Check connection pool usage

3. **Recent Changes**
   - Git log: `git log --since="24 hours ago" --oneline`
   - Deployment history (Vercel/Supabase)
   - Recent migrations

4. **System Resources**
   - Vercel Function logs
   - Edge function execution times
   - Database CPU/Memory usage

## Response Steps

### 1. Immediate Actions (0-5 min)

- [ ] **Verify Impact**
  - Check `/api/health` endpoint
  - Review error logs
  - Confirm affected endpoints

- [ ] **Check Database**
  ```sql
  -- Run in Supabase SQL Editor
  SELECT pid, now() - pg_stat_activity.query_start AS duration, query
  FROM pg_stat_activity
  WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds'
  ORDER BY duration DESC;
  ```

- [ ] **Review Recent Deployments**
  - Vercel Dashboard → Deployments
  - Check for failed builds or rollbacks

### 2. Investigation (5-15 min)

- [ ] **Identify Slow Endpoints**
  - Review `/api/metrics` response
  - Check Vercel Analytics → Functions
  - Identify endpoints with P95 > 400ms

- [ ] **Database Analysis**
  - Check for missing indexes
  - Review query plans for slow queries
  - Check for table locks or long-running transactions

- [ ] **External Dependencies**
  - Check third-party API response times
  - Verify webhook delivery times
  - Review Supabase connection pool

### 3. Mitigation (15-30 min)

**If Database-Related:**
- [ ] Add missing indexes (if safe)
- [ ] Kill long-running queries (if safe)
- [ ] Scale database resources (if needed)
- [ ] Enable query result caching

**If Code-Related:**
- [ ] Revert recent deployment (if regression)
- [ ] Enable edge caching for static responses
- [ ] Optimize N+1 queries
- [ ] Add request timeouts

**If Infrastructure-Related:**
- [ ] Scale function concurrency
- [ ] Check Vercel region routing
- [ ] Review CDN cache hit rates

### 4. Post-Incident (30+ min)

- [ ] **Document Root Cause**
  - Update this runbook with findings
  - Create GitHub issue with label `auto/perf`
  - Link to metrics snapshot

- [ ] **Preventive Measures**
  - Add monitoring alerts
  - Update SLO thresholds if needed
  - Schedule performance review

- [ ] **Communication**
  - Update status page (if applicable)
  - Notify team via Slack/Discord
  - Post-mortem scheduled (if severity warrants)

## Escalation

**Escalate if:**
- P95 > 1000ms for 15+ minutes
- Error rate > 5%
- Database unresponsive
- Multiple services affected

**Escalation Contacts:**
- On-call engineer (check PagerDuty/rotation)
- Database admin (Supabase support)
- Infrastructure lead

## Related Resources

- **Dashboard:** `/admin/metrics`
- **Reliability:** `/admin/reliability`
- **Metrics API:** `/api/metrics`
- **Health Check:** `/api/health`
- **SLO Config:** `ops.config.json`

## Prevention

- Regular performance budgets in CI/CD
- Automated regression detection (agent-runner workflow)
- Database query monitoring
- Load testing before major releases

---

**Last Updated:** {{ date }}  
**Maintained By:** Hardonia Ops Agent
