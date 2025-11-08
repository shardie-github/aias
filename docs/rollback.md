# Database Rollback Guide

This guide explains how to rollback database migrations and restore from backups.

## When to Rollback

- Migration introduces breaking changes
- Data corruption detected
- Performance degradation after migration
- Failed migration leaves database in inconsistent state

## Prerequisites

- Supabase project access
- Database backup (recommended before migrations)
- `psql` or Supabase CLI access

## Creating Backups

### Before Migrations

**Via Supabase Dashboard**:

1. Go to **Database → Backups**
2. Click "Create Backup"
3. Note the backup timestamp

**Via CLI** (pg_dump):

```bash
pg_dump "postgresql://postgres:${SUPABASE_SERVICE_ROLE_KEY}@db.{project-ref}.supabase.co:5432/postgres?sslmode=require" \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

Replace `{project-ref}` with your actual Supabase project reference.

**Automated Backup Script**:

```bash
#!/bin/bash
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"
```

## Rollback Methods

### Method 1: Restore from Backup

**Via Supabase Dashboard**:

1. Go to **Database → Backups**
2. Select the backup to restore
3. Click "Restore"
4. Confirm restoration

**Via CLI**:

```bash
psql "$DATABASE_URL" < backup_20250122_120000.sql
```

### Method 2: Reverse Migration

If you have a reverse migration script:

```bash
# Apply reverse migration
psql "$DATABASE_URL" < supabase/migrations/rollback_20250122.sql
```

**Creating Reverse Migrations**:

Always create reverse migrations for destructive changes:

```sql
-- Migration: 20250122_add_column.sql
ALTER TABLE users ADD COLUMN new_field TEXT;

-- Rollback: rollback_20250122.sql
ALTER TABLE users DROP COLUMN IF EXISTS new_field;
```

### Method 3: Manual SQL Rollback

For simple changes, execute reverse SQL:

```sql
-- Example: Remove a column
ALTER TABLE users DROP COLUMN IF EXISTS new_field;

-- Example: Drop a table
DROP TABLE IF EXISTS temp_table;

-- Example: Remove RLS policy
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

## Rollback Checklist

### Before Rollback

- [ ] Identify the problematic migration
- [ ] Create a backup of current state
- [ ] Document the issue
- [ ] Notify team members
- [ ] Plan rollback steps

### During Rollback

- [ ] Stop application deployments
- [ ] Restore from backup OR apply reverse migration
- [ ] Verify database schema
- [ ] Run health checks
- [ ] Test critical functionality

### After Rollback

- [ ] Verify application works correctly
- [ ] Monitor error logs
- [ ] Document rollback steps taken
- [ ] Create fix for original issue
- [ ] Test fix in development
- [ ] Plan re-deployment

## Specific Rollback Scenarios

### Rollback RLS Migration

If RLS policies cause issues:

```sql
-- Disable RLS temporarily
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Or drop specific policy
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### Rollback Table Creation

```sql
-- Drop table and dependencies
DROP TABLE IF EXISTS table_name CASCADE;
```

### Rollback Column Addition

```sql
-- Remove column
ALTER TABLE table_name DROP COLUMN IF EXISTS column_name;
```

### Rollback Index Creation

```sql
-- Drop index
DROP INDEX IF EXISTS index_name;
```

## Verifying Rollback

### 1. Check Schema

```sql
-- List tables
\dt

-- Describe table
\d table_name

-- List policies
SELECT * FROM pg_policies WHERE tablename = 'table_name';
```

### 2. Run Health Checks

```bash
# Local
pnpm run doctor

# Production
curl https://your-app.vercel.app/api/healthz
```

### 3. Test Application

- Login/logout
- Create/read/update/delete operations
- Verify RLS policies work correctly

## Preventing Rollbacks

### Best Practices

1. **Test Migrations Locally First**
   ```bash
   # Test against local Supabase
   supabase start
   supabase db reset
   ```

2. **Use Transactional Migrations**
   ```sql
   BEGIN;
   -- Migration SQL
   COMMIT;
   ```

3. **Create Idempotent Migrations**
   ```sql
   -- Use IF NOT EXISTS / IF EXISTS
   CREATE TABLE IF NOT EXISTS ...
   DROP TABLE IF EXISTS ...
   ```

4. **Backup Before Major Changes**
   ```bash
   # Automated backup before migration
   ./scripts/backup.sh
   ```

5. **Use Two-Step Migrations for Destructive Changes**
   - Step 1: Add new column/table
   - Step 2: Migrate data
   - Step 3: Remove old column/table

## Emergency Contacts

- **Supabase Support**: [support@supabase.com](mailto:support@supabase.com)
- **Database Admin**: [Your contact]
- **On-Call Engineer**: [Your contact]

## Recovery Time Objectives (RTO)

- **Critical**: < 15 minutes
- **High**: < 1 hour
- **Medium**: < 4 hours
- **Low**: < 24 hours

## Recovery Point Objectives (RPO)

- **Backup Frequency**: Daily (automated)
- **Backup Retention**: 30 days
- **Point-in-Time Recovery**: Available via Supabase

## Additional Resources

- [Supabase Backup Documentation](https://supabase.com/docs/guides/platform/backups)
- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
- [Prisma Migration Rollback](https://www.prisma.io/docs/concepts/components/prisma-migrate#rollback)
