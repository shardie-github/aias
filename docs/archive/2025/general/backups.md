> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Backup Strategy & Recovery Procedures

**Last Updated:** 2025-01-27  
**Scope:** Database backups, restore procedures, disaster recovery

---

## Backup Strategy

### Supabase Automated Backups

**Status:** ✅ Configured (via Supabase Dashboard)

**Configuration:**
- **Frequency:** Daily automated backups
- **Retention:** 7 days (default Supabase plan)
- **Location:** Supabase managed storage
- **Backup Time:** 02:00 UTC (configurable)

**Access:**
1. Go to Supabase Dashboard → Database → Backups
2. View available backups
3. Download or restore from backup

### Manual Backup Creation

**Via Supabase CLI:**
```bash
# Create manual backup
supabase db dump -f backups/manual-$(date +%Y%m%d).sql

# Or use pg_dump directly
pg_dump $DATABASE_URL > backups/manual-$(date +%Y%m%d).sql
```

**Via Supabase Dashboard:**
1. Go to Database → Backups
2. Click "Create Backup"
3. Download backup file

---

## Backup Verification

### Automated Backup Check

**Script:** `scripts/check-backup-evidence.ts` (exists)

**Run:**
```bash
pnpm run dr:check
```

**Checks:**
- Last backup timestamp
- Backup file integrity
- Restore capability

### Manual Verification

```bash
# Check backup file exists and is valid
ls -lh backups/
pg_restore --list backups/latest.sql | head -20
```

---

## Restore Procedures

### Full Database Restore

**Method 1: Via Supabase Dashboard**
1. Go to Supabase Dashboard → Database → Backups
2. Select backup to restore
3. Click "Restore"
4. Confirm restore operation

**Method 2: Via SQL**
```sql
-- Connect to Supabase SQL Editor
-- Run restore commands from backup file
\i backups/backup-20250127.sql
```

**Method 3: Via CLI**
```bash
# Restore from backup file
psql $DATABASE_URL < backups/backup-20250127.sql

# Or using Supabase CLI
supabase db reset --db-url $DATABASE_URL
psql $DATABASE_URL < backups/backup-20250127.sql
```

### Partial Restore (Table-Level)

```sql
-- Restore specific table
\copy table_name FROM 'backups/table_name.csv' CSV HEADER;

-- Or restore from SQL dump
psql $DATABASE_URL -c "\i backups/table_name.sql"
```

### Point-in-Time Recovery

**Supabase PITR:**
- Available on Pro plan and above
- Restore to any point in time within retention period
- Access via Supabase Dashboard → Database → Point-in-Time Recovery

---

## Restore Drill Procedures

### Quarterly Restore Drill

**Purpose:** Verify backup integrity and restore capability

**Procedure:**
1. **Pre-Drill Checklist**
   - [ ] Notify team of drill
   - [ ] Schedule during low-traffic period
   - [ ] Prepare test environment
   - [ ] Document current state

2. **Drill Execution**
   ```bash
   # 1. Create test database
   createdb restore_drill_test
   
   # 2. Restore latest backup
   psql restore_drill_test < backups/latest.sql
   
   # 3. Verify data integrity
   psql restore_drill_test -c "SELECT COUNT(*) FROM profiles;"
   psql restore_drill_test -c "SELECT COUNT(*) FROM events;"
   
   # 4. Test application connectivity
   DATABASE_URL=postgresql://localhost/restore_drill_test pnpm run test
   
   # 5. Cleanup
   dropdb restore_drill_test
   ```

3. **Post-Drill**
   - [ ] Document results
   - [ ] Identify issues
   - [ ] Update procedures if needed
   - [ ] Share findings with team

**Script:** `scripts/restore-drill.ts` (create)

---

## Backup Retention Policy

### Automated Backups
- **Daily:** Retained for 7 days
- **Weekly:** Retained for 4 weeks (if configured)
- **Monthly:** Retained for 12 months (if configured)

### Manual Backups
- **Before major migrations:** Retained until migration verified
- **Before deployments:** Retained for 30 days
- **Quarterly snapshots:** Retained for 1 year

---

## Disaster Recovery Plan

### RTO (Recovery Time Objective)
**Target:** < 4 hours

### RPO (Recovery Point Objective)
**Target:** < 24 hours (daily backups)

### Recovery Procedures

**Scenario 1: Complete Database Loss**
1. Identify last known good backup
2. Restore from backup via Supabase Dashboard
3. Verify data integrity
4. Update application if schema changed
5. Monitor for issues

**Scenario 2: Partial Data Loss**
1. Identify affected tables
2. Restore specific tables from backup
3. Replay transactions from audit logs (if available)
4. Verify data consistency

**Scenario 3: Corruption**
1. Stop application writes
2. Restore from last known good backup
3. Verify integrity
4. Resume operations

---

## Backup Monitoring

### Automated Checks

**Daily Backup Verification:**
- Check backup completion status
- Verify backup file size
- Test restore capability (sample)

**Weekly Backup Review:**
- Review backup retention
- Verify backup accessibility
- Check restore drill results

### Alerts

**Configure Alerts For:**
- Backup failures
- Backup size anomalies
- Restore failures
- Backup retention expiration

---

## Backup Best Practices

1. **Test Restores Regularly**
   - Quarterly restore drills
   - Verify backup integrity
   - Document restore times

2. **Multiple Backup Locations**
   - Supabase managed backups (primary)
   - Manual backups to S3/GCS (secondary)
   - Local backups for development

3. **Encryption**
   - All backups encrypted at rest
   - Encrypt manual backups before storage
   - Secure backup access credentials

4. **Documentation**
   - Document all backup procedures
   - Keep restore procedures updated
   - Document known issues

5. **Automation**
   - Automate backup creation
   - Automate backup verification
   - Automate restore drills

---

## Related Documentation

- [Rollback Procedures](./rollback.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Supabase Documentation](https://supabase.com/docs/guides/platform/backups)

---

**Last Reviewed:** 2025-01-27  
**Next Review:** Quarterly or after major incident
