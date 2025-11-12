> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Migration Safety Rails

## Overview

Database migrations are protected by safety rails to prevent accidental data loss or destructive operations in production.

## Migration Canary Flag

### Configuration

The migration canary flag is controlled by the `MIGRATION_CANARY` environment variable:

- **Location:** `ops.config.json` → `migration.canary_flag`
- **Environment Variable:** `MIGRATION_CANARY`
- **Default:** Not set (destructive operations blocked)

### Usage

**For Safe Migrations (CREATE, ALTER ADD, etc.):**
```bash
# No flag needed - safe operations allowed
supabase db push
```

**For Destructive Migrations (DROP, TRUNCATE, ALTER DROP, etc.):**
```bash
# Must set canary flag to true
MIGRATION_CANARY=true supabase db push
```

### Destructive Operations

The following operations require `MIGRATION_CANARY=true`:

- `DROP TABLE`
- `DROP COLUMN`
- `TRUNCATE TABLE`
- `ALTER TABLE ... DROP COLUMN`
- `ALTER TABLE ... DROP CONSTRAINT`
- `DELETE FROM ...` (large deletes)

### Guard Implementation

Migration scripts should check the canary flag:

```sql
-- Example migration guard
DO $$
BEGIN
  IF current_setting('app.migration_canary', true) != 'true' THEN
    RAISE EXCEPTION 'Destructive migration requires MIGRATION_CANARY=true';
  END IF;
END $$;

-- Destructive operation
DROP TABLE IF EXISTS old_table;
```

### Supabase SQL Guard

For Supabase SQL scripts, add a guard note at the top:

```sql
-- ⚠️ DESTRUCTIVE OPERATION
-- This migration requires MIGRATION_CANARY=true
-- Block destructive SQL when MIGRATION_CANARY != true

DO $$
BEGIN
  IF current_setting('app.migration_canary', true) != 'true' THEN
    RAISE EXCEPTION 'Destructive migration blocked. Set MIGRATION_CANARY=true to proceed.';
  END IF;
END $$;

-- Your destructive SQL here
DROP TABLE IF EXISTS deprecated_table;
```

## Best Practices

### 1. Always Test Migrations

- Test in development/staging first
- Verify rollback procedure
- Check for data dependencies

### 2. Use Safe Migration Patterns

**Instead of DROP:**
```sql
-- Add new column
ALTER TABLE users ADD COLUMN new_email TEXT;

-- Migrate data
UPDATE users SET new_email = old_email WHERE old_email IS NOT NULL;

-- Drop old column (requires canary)
MIGRATION_CANARY=true ...
ALTER TABLE users DROP COLUMN old_email;
```

**Instead of TRUNCATE:**
```sql
-- Archive data first
CREATE TABLE users_archive AS SELECT * FROM users WHERE created_at < '2024-01-01';

-- Then truncate (requires canary)
MIGRATION_CANARY=true ...
TRUNCATE TABLE users;
```

### 3. Document Migration Purpose

```sql
-- Migration: Remove deprecated feature
-- Date: 2024-01-15
-- Reason: Feature deprecated, data migrated to new table
-- Requires: MIGRATION_CANARY=true
```

## Compliance

Migration safety is checked in `SECURITY_COMPLIANCE_REPORT.md`:

- **Migration Canary Flag:** Status checked
- **Destructive SQL Blocked:** Verification
- **Last Migration:** Date tracked

## Related Resources

- **Migration Scripts:** `supabase/migrations/`
- **Backup Restore:** `docs/runbooks/restore.md`
- **DB Hotspot Runbook:** `docs/runbooks/db-hotspot.md`
- **Config:** `ops.config.json`

---

**Last Updated:** {{ date }}  
**Maintained By:** Hardonia Ops Agent
