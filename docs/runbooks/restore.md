# Incident Runbook: Database Restore

## Overview
This runbook provides steps for database restoration procedures. **No PII or sensitive data is included**—only procedural steps and metadata checks.

## Pre-Restore Checklist

- [ ] Verify backup availability
- [ ] Confirm restore point (timestamp)
- [ ] Notify stakeholders
- [ ] Document current state
- [ ] Verify `MIGRATION_CANARY` flag status

## Backup Evidence Check

### Metadata Verification
```bash
# Check backup metadata (no PII)
# This should be automated by the agent and reported in SECURITY_COMPLIANCE_REPORT.md

# Example check (Supabase):
# - Supabase Dashboard → Database → Backups
# - Verify backup exists for target timestamp
# - Check backup size and status
```

**Status:** Checked in `SECURITY_COMPLIANCE_REPORT.md` → "Backup Evidence" section

## Restore Scenarios

### Scenario 1: Point-in-Time Recovery (Supabase)

1. **Access Supabase Dashboard**
   - Navigate to: Project → Database → Backups
   - Select target restore point

2. **Create Restore Request**
   - Click "Restore" on target backup
   - Select restore method:
     - **New Project:** Creates new project with restored data
     - **Current Project:** Overwrites current database (⚠️ destructive)

3. **Verify Restore Point**
   - Confirm timestamp matches requirements
   - Verify backup size is reasonable
   - Check backup status (completed)

4. **Execute Restore**
   - Follow Supabase UI prompts
   - Monitor restore progress
   - Verify completion

5. **Post-Restore Verification**
   ```sql
   -- Verify table counts (metadata only)
   SELECT 
     schemaname,
     tablename,
     n_live_tup AS row_count
   FROM pg_stat_user_tables
   ORDER BY tablename;
   
   -- Verify recent data exists
   SELECT COUNT(*) FROM <table_name> 
   WHERE created_at >= '<restore_timestamp>';
   ```

### Scenario 2: Schema-Only Restore

**Use Case:** Restore structure without data (testing, development)

1. **Export Schema**
   ```bash
   # Using Supabase CLI
   supabase db dump --schema-only > schema-backup.sql
   ```

2. **Restore Schema**
   ```bash
   # Apply to target database
   supabase db reset --db-url <target_connection_string>
   psql <target_connection_string> < schema-backup.sql
   ```

### Scenario 3: Table-Level Restore

**Use Case:** Restore specific table from backup

1. **Export Table Data**
   ```bash
   # Using pg_dump
   pg_dump -h <host> -U <user> -d <database> -t <table_name> > table-backup.sql
   ```

2. **Restore Table**
   ```bash
   # Apply to target database
   psql <target_connection_string> < table-backup.sql
   ```

## Post-Restore Steps

### 1. Verification (0-15 min)

- [ ] **Data Integrity**
  - Verify row counts match expectations
  - Check foreign key relationships
  - Verify indexes exist

- [ ] **Application Functionality**
  - Test critical user flows
  - Verify API endpoints respond
  - Check authentication/authorization

- [ ] **Performance**
  - Run query performance checks
  - Verify indexes are used
  - Check connection pool

### 2. Communication (15-30 min)

- [ ] **Notify Stakeholders**
  - Update status page
  - Notify team via Slack/Discord
  - Document restore in incident log

- [ ] **Documentation**
  - Update this runbook with lessons learned
  - Create post-mortem (if production incident)
  - Update backup procedures if needed

### 3. Monitoring (30+ min)

- [ ] **Monitor Application**
  - Watch error rates
  - Monitor query performance
  - Check user reports

- [ ] **Review Logs**
  - Application logs
  - Database logs
  - API logs

## Safety Rails

### Migration Canary Flag
- **Before Restore:** Verify `MIGRATION_CANARY` flag status
- **During Restore:** Ensure no migrations run concurrently
- **After Restore:** Re-enable migrations if needed

### Read-Only Mode
- **Recommendation:** Enable read-only mode during restore
- **Implementation:** Application-level flag or database-level setting
- **Duration:** Until restore verification complete

### Backup Verification
- **Pre-Restore:** Verify backup exists and is valid
- **Post-Restore:** Verify restore completed successfully
- **Documentation:** Update `SECURITY_COMPLIANCE_REPORT.md`

## Prevention

### Regular Backups
- **Automated:** Supabase automatic backups (daily)
- **Manual:** Export critical tables before major changes
- **Verification:** Agent checks backup evidence weekly

### Backup Testing
- **Schedule:** Quarterly restore tests
- **Scope:** Non-production environment
- **Documentation:** Update runbook with findings

### Monitoring
- **Backup Status:** Checked in compliance report
- **Backup Age:** Alert if backup > 7 days old
- **Backup Size:** Monitor for anomalies

## Escalation

**Escalate if:**
- Backup not available
- Restore fails
- Data corruption detected
- Production data at risk

**Escalation Contacts:**
- Database admin (Supabase support)
- On-call engineer
- Infrastructure lead

## Related Resources

- **Supabase Backups:** Dashboard → Database → Backups
- **Backup Evidence:** `SECURITY_COMPLIANCE_REPORT.md`
- **Migration Safety:** `ops.config.json` → migration.canary_flag
- **Database Runbook:** `docs/runbooks/db-hotspot.md`

## Notes

- **No PII:** This runbook contains no personally identifiable information
- **Metadata Only:** Backup checks verify metadata, not actual data
- **Procedural:** Focus on steps and verification, not data content
- **Security:** All restore operations should be logged and audited

---

**Last Updated:** {{ date }}  
**Maintained By:** Hardonia Ops Agent
