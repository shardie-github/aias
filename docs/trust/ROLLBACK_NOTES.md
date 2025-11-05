# Trust Layer Rollback Notes

**Date:** 2025-01-XX  
**Feature:** Trust & Transparency Layer (ORG3XTRATE-STAKE+TRUST)

## Rollback Procedure

If issues arise with the trust layer implementation, follow these steps:

### 1. Disable Feature Flags (Immediate)

Set all flags to `false` in `config/flags.trust.json`:

```json
{
  "privacy_center": false,
  "status_page": false,
  "audit_log": false,
  "admin_controls": false,
  "export_portability": false,
  "help_center": false,
  "a11y_checks": false,
  "slo_sla_docs": false,
  "incident_comms": false,
  "api_portal": false,
  "rate_limit_disclosure": false,
  "data_retention_disclosure": false
}
```

This will hide all trust-related UI pages while keeping the infrastructure intact.

### 2. Revert Database Migration (If Necessary)

**WARNING:** Only revert if the audit_log table is causing issues. This will delete all audit log data.

```sql
-- Revert migration 2025-11-05_trust_audit.sql
DROP POLICY IF EXISTS "audit_owner" ON public.audit_log;
ALTER TABLE public.audit_log DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS public.audit_log CASCADE;
```

**Alternative (Safer):** Keep the table but disable RLS:
```sql
ALTER TABLE public.audit_log DISABLE ROW LEVEL SECURITY;
```

### 3. Remove CI Check (If Blocking)

Remove the Trust Smoke check from `.github/workflows/deploy-main.yml`:

```yaml
# Remove this block:
# [STAKE+TRUST:BEGIN:checks]
# - name: Trust Smoke
#   ...
# [STAKE+TRUST:END:checks]
```

### 4. Revert Layout Changes (If Needed)

Remove i18n changes from `app/layout.tsx`:

```tsx
// Remove:
// [STAKE+TRUST:BEGIN:i18n_layout]
// ...
// [STAKE+TRUST:END:i18n_layout]

// Revert to:
<html lang="en" suppressHydrationWarning>
```

### 5. Revert Footer Changes (If Needed)

Remove trust links from `components/layout/footer.tsx`:

```tsx
// Remove:
// [STAKE+TRUST:BEGIN:trust_links]
// ...
// [STAKE+TRUST:END:trust_links]
```

## What Gets Removed

### Files to Delete (if complete rollback)

- `app/trust/page.tsx`
- `app/privacy/page.tsx`
- `app/status/page.tsx`
- `app/help/page.tsx`
- `app/account/audit-log/page.tsx`
- `app/api/audit/me/route.ts`
- `app/api/feedback/route.ts`
- `config/flags.trust.json`
- `supabase/migrations/2025-11-05_trust_audit.sql` (if not yet applied)
- `docs/trust/*` (all trust documentation)

### Files to Keep (Safe)

- All documentation files are informational and don't affect runtime
- Migration file can remain if migration was successful

## Partial Rollback Options

### Keep Documentation, Remove UI

- Delete all `app/trust/*`, `app/privacy/*`, etc. pages
- Keep `docs/trust/*` documentation
- Keep `config/flags.trust.json` but set all flags to `false`

### Keep Infrastructure, Remove UI

- Keep database migration and API endpoints
- Remove UI pages
- Set feature flags to `false`

### Keep Audit Log, Remove Other Features

- Keep `audit_log` table and `/api/audit/me` endpoint
- Remove other trust pages
- Set relevant flags to `false`

## Rollback Decision Tree

```
Issue Type?
├─ UI/UX Issues
│  └─ Disable flags → Pages hidden, infrastructure intact
│
├─ API Performance Issues
│  ├─ Audit API → Set audit_log flag to false
│  └─ Feedback API → Remove endpoint or disable
│
├─ Database Issues
│  └─ Revert migration (see step 2)
│
├─ CI/CD Blocking
│  └─ Remove Trust Smoke check (see step 3)
│
└─ Layout/Footer Issues
   └─ Revert patches (see steps 4-5)
```

## Verification After Rollback

1. ✅ All trust pages return 404 or are hidden
2. ✅ No errors in browser console
3. ✅ CI/CD pipeline passes
4. ✅ Database queries still work (if migration kept)
5. ✅ No broken links in footer

## Re-enabling After Fix

1. Fix the identified issue
2. Re-enable feature flags one by one
3. Test each feature independently
4. Monitor for issues

## Support

If rollback procedures don't resolve issues:
- Check application logs
- Review database migration status
- Verify environment variables
- Contact: devops@example.com

## Notes

- All changes use markers `[STAKE+TRUST:BEGIN:...]` / `[STAKE+TRUST:END:...]` for easy identification
- No existing files were overwritten (only patched)
- All features are behind flags and default to OFF
- Documentation is non-destructive (read-only)
