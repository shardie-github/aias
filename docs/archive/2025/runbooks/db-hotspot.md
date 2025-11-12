> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Incident Runbook: Database Hotspot / Performance Degradation

## Overview
This runbook guides response to database performance issues, hotspots, and query degradation.

**SLO Target:** Database query P95 ≤ 200ms  
**Alert Threshold:** P95 > 500ms for 5+ minutes

## Pre-Incident Checklist

- [ ] Verify Supabase dashboard access
- [ ] Check database connection pool
- [ ] Review recent migrations
- [ ] Check for long-running queries

## Detection

### Symptoms
- Slow API responses (database-bound)
- High database CPU usage (>80%)
- Connection pool exhaustion
- Query timeouts
- Lock contention

### What to Capture

1. **Database Metrics**
   - Supabase Dashboard → Database → Performance
   - Capture slow query log
   - Check connection pool metrics

2. **Active Queries**
   ```sql
   -- Run in Supabase SQL Editor
   SELECT 
     pid,
     now() - pg_stat_activity.query_start AS duration,
     state,
     wait_event_type,
     wait_event,
     query
   FROM pg_stat_activity
   WHERE state != 'idle'
   ORDER BY duration DESC
   LIMIT 20;
   ```

3. **Table Statistics**
   ```sql
   SELECT 
     schemaname,
     tablename,
     n_tup_ins AS inserts,
     n_tup_upd AS updates,
     n_tup_del AS deletes,
     n_live_tup AS live_rows,
     n_dead_tup AS dead_rows
   FROM pg_stat_user_tables
   ORDER BY n_dead_tup DESC;
   ```

4. **Index Usage**
   ```sql
   SELECT 
     schemaname,
     tablename,
     indexname,
     idx_scan,
     idx_tup_read,
     idx_tup_fetch
   FROM pg_stat_user_indexes
   WHERE idx_scan = 0
   ORDER BY pg_relation_size(indexrelid) DESC;
   ```

## Response Steps

### 1. Immediate Actions (0-5 min)

- [ ] **Identify Hot Queries**
  - Run active queries SQL (above)
  - Identify queries running > 5 seconds
  - Check for blocking queries

- [ ] **Check Connection Pool**
  - Supabase Dashboard → Database → Connection Pooling
  - Verify pool not exhausted
  - Check connection wait times

- [ ] **Review Recent Migrations**
  - Check migration history (last 24h)
  - Verify migration canary flag: `MIGRATION_CANARY=true`
  - Review for missing indexes

### 2. Investigation (5-15 min)

**If Long-Running Queries:**
- [ ] Identify query type (SELECT, UPDATE, DELETE)
- [ ] Check for missing indexes
- [ ] Review query plan: `EXPLAIN ANALYZE <query>`
- [ ] Check for table scans

**If Lock Contention:**
- [ ] Identify locked tables
- [ ] Check for deadlocks
- [ ] Review transaction isolation levels

**If Connection Pool Exhausted:**
- [ ] Check for connection leaks
- [ ] Review connection pool size
- [ ] Verify connection cleanup in code

**If High CPU:**
- [ ] Identify CPU-intensive queries
- [ ] Check for full table scans
- [ ] Review index usage statistics

### 3. Mitigation (15-30 min)

**Kill Long-Running Queries (if safe):**
```sql
-- Identify blocking query
SELECT pid, query, now() - query_start AS duration
FROM pg_stat_activity
WHERE state = 'active' 
  AND now() - query_start > interval '30 seconds';

-- Kill query (replace <pid> with actual PID)
SELECT pg_terminate_backend(<pid>);
```

**Add Missing Indexes:**
```sql
-- Example: Add index for common query pattern
CREATE INDEX CONCURRENTLY idx_table_column 
ON table_name(column_name);

-- Verify index usage
EXPLAIN ANALYZE SELECT * FROM table_name WHERE column_name = 'value';
```

**Optimize Queries:**
- [ ] Add WHERE clause filters
- [ ] Use LIMIT for large result sets
- [ ] Enable query result caching
- [ ] Review N+1 query patterns

**Scale Resources (if needed):**
- [ ] Supabase Dashboard → Database → Scale
- [ ] Increase compute resources temporarily
- [ ] Monitor impact

### 4. Post-Incident (30+ min)

- [ ] **Document Root Cause**
  - Update this runbook with findings
  - Create GitHub issue with label `auto/perf`
  - Link to query analysis

- [ ] **Preventive Measures**
  - Add query performance monitoring
  - Schedule index optimization
  - Review migration canary process
  - Add connection pool monitoring

- [ ] **Communication**
  - Update status page (if applicable)
  - Notify team via Slack/Discord
  - Schedule database review meeting

## Database Safety Rails

### Migration Canary
- **Flag:** `MIGRATION_CANARY` environment variable
- **Requirement:** Must be `true` for destructive SQL
- **Destructive Operations:**
  - `DROP TABLE`
  - `DROP COLUMN`
  - `TRUNCATE`
  - `ALTER TABLE` with data loss

### Backup Evidence
- **Check:** Backup metadata present in compliance report
- **Location:** `SECURITY_COMPLIANCE_REPORT.md`
- **Restore Procedure:** See `docs/runbooks/restore.md`

### Read-Only Analytics Role
- **Recommendation:** Use read-only role for analytics queries
- **Connection String:** Separate from application connection
- **Permissions:** SELECT only, no write access

## Escalation

**Escalate if:**
- Database unresponsive
- Data corruption suspected
- Multiple tables affected
- Production data at risk

**Escalation Contacts:**
- Database admin (Supabase support)
- On-call engineer
- Infrastructure lead

## Related Resources

- **Supabase Dashboard:** Database → Performance
- **Migration Scripts:** `supabase/migrations/`
- **Backup Restore:** `docs/runbooks/restore.md`
- **SLO Config:** `ops.config.json`

## Prevention

- Regular index optimization
- Query performance monitoring
- Migration canary flag enforcement
- Connection pool monitoring
- Regular VACUUM and ANALYZE

---

**Last Updated:** {{ date }}  
**Maintained By:** Hardonia Ops Agent
