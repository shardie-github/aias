> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Rollback Procedures

**Last Updated:** 2025-01-27  
**Scope:** Production rollback procedures for deployments, database migrations, and feature flags

---

## Quick Reference

### One-Command Rollbacks

```bash
# Rollback last commit
git revert HEAD

# Rollback last N commits
git revert HEAD~N..HEAD

# Rollback specific file
git checkout HEAD~1 -- <file-path>

# Rollback Vercel deployment (via CLI)
vercel rollback

# Rollback Vercel deployment (via Dashboard)
# Go to: Project → Deployments → Select deployment → Rollback
```

---

## Deployment Rollbacks

### Vercel Rollback

**Method 1: Via Dashboard**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the deployment to rollback to
3. Click "..." menu → "Promote to Production"
4. Confirm rollback

**Method 2: Via CLI**
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>

# Rollback to previous production deployment
vercel rollback --prod
```

**Method 3: Via Git**
```bash
# Revert the commit that caused issues
git revert <commit-hash>
git push origin main

# Vercel will automatically redeploy
```

### Docker Rollback

```bash
# Stop current container
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and restart
docker-compose build
docker-compose up -d
```

---

## Database Rollback

### Supabase Migration Rollback

**⚠️ Warning:** Database rollbacks can cause data loss. Always backup first.

**Method 1: Revert Migration**
```bash
# List migrations
supabase migration list

# Create a new migration that reverses the changes
supabase migration new rollback_<migration_name>

# Edit the new migration file to reverse changes
# Example: DROP TABLE IF EXISTS table_name;

# Apply rollback migration
supabase db push
```

**Method 2: Manual SQL Rollback**
```sql
-- Connect to Supabase SQL Editor
-- Run reverse SQL commands manually

-- Example: Rollback table creation
DROP TABLE IF EXISTS table_name CASCADE;

-- Example: Rollback column addition
ALTER TABLE table_name DROP COLUMN IF EXISTS column_name;

-- Example: Rollback constraint addition
ALTER TABLE table_name DROP CONSTRAINT IF EXISTS constraint_name;
```

**Method 3: Restore from Backup**
```bash
# Restore from Supabase backup (if available)
# Go to: Supabase Dashboard → Database → Backups
# Select backup → Restore
```

---

## Feature Flag Rollback

### Canary Deployment Rollback

```bash
# Disable canary flag
vercel env rm CANARY_CHECKOUT_ENABLED production
vercel env rm CANARY_CHECKOUT_PERCENTAGE production

# Or set percentage to 0
vercel env add CANARY_CHECKOUT_PERCENTAGE production
# Value: 0
```

### Feature Flag Rollback (if using feature flag service)

```typescript
// Via API or dashboard
// Set flag to false or 0%
await updateFlag('canary_checkout', { enabled: false, percentage: 0 });
```

---

## Code Rollback

### Git Rollback

**Safe Rollback (Creates Revert Commit)**
```bash
# Revert specific commit
git revert <commit-hash>

# Revert range of commits
git revert HEAD~3..HEAD

# Push revert commit
git push origin main
```

**Destructive Rollback (Rewrites History)**
```bash
# ⚠️ Only use on feature branches, never on main
git reset --hard <commit-hash>
git push --force origin <branch-name>
```

### File-Level Rollback

```bash
# Restore specific file from previous commit
git checkout <commit-hash> -- <file-path>

# Restore multiple files
git checkout <commit-hash> -- <file1> <file2> <file3>

# Commit the rollback
git add <file-path>
git commit -m "rollback: restore <file> from <commit-hash>"
git push origin main
```

---

## Environment Variable Rollback

### Vercel Environment Variables

```bash
# List current env vars
vercel env ls

# Remove problematic env var
vercel env rm <VAR_NAME> production

# Restore previous value
vercel env add <VAR_NAME> production
# Enter previous value when prompted
```

### Local Environment Variables

```bash
# Restore from backup
cp .env.backup .env

# Or manually edit .env file
# Remove or update problematic variables
```

---

## Rollback Decision Tree

```
Is the issue in production?
├─ Yes → Is data at risk?
│   ├─ Yes → Database rollback + Code rollback
│   └─ No → Code rollback only
│
└─ No → Is it a preview deployment?
    ├─ Yes → Let it expire or delete deployment
    └─ No → Code rollback
```

---

## Rollback Checklist

### Pre-Rollback
- [ ] Identify the problematic commit/deployment
- [ ] Verify rollback target is stable
- [ ] Notify team of rollback plan
- [ ] Backup current state (if needed)
- [ ] Document the issue

### During Rollback
- [ ] Execute rollback command
- [ ] Verify rollback succeeded
- [ ] Check application health
- [ ] Monitor error rates
- [ ] Verify critical features work

### Post-Rollback
- [ ] Confirm issue is resolved
- [ ] Document rollback in incident log
- [ ] Create follow-up ticket for fix
- [ ] Update team on status
- [ ] Schedule post-mortem (if needed)

---

## Emergency Rollback Contacts

**On-Call Engineer:** Check PagerDuty/Slack  
**Tech Lead:** [TBD]  
**DevOps:** [TBD]

---

## Rollback Examples

### Example 1: Rollback Recent API Change

```bash
# Identify problematic commit
git log --oneline -10

# Revert the commit
git revert abc1234

# Push revert
git push origin main

# Verify deployment
curl https://api.example.com/healthz
```

### Example 2: Rollback Database Migration

```bash
# Create rollback migration
supabase migration new rollback_add_user_preferences

# Edit migration file
# DROP TABLE IF EXISTS user_preferences CASCADE;

# Apply rollback
supabase db push

# Verify rollback
supabase db diff
```

### Example 3: Rollback Feature Flag

```bash
# Disable feature flag
vercel env rm ENABLE_NEW_CHECKOUT production

# Or set to false
vercel env add ENABLE_NEW_CHECKOUT production
# Value: false

# Verify flag is disabled
curl https://api.example.com/api/flags
```

---

## Prevention

### Best Practices to Avoid Rollbacks

1. **Small, Incremental Changes**
   - Keep PRs small (<300 LOC)
   - One feature per PR
   - Easier to rollback if needed

2. **Feature Flags**
   - Use feature flags for risky changes
   - Enable for small percentage first
   - Gradual rollout

3. **Canary Deployments**
   - Deploy to small subset first
   - Monitor metrics
   - Rollback if thresholds exceeded

4. **Database Migrations**
   - Always make migrations reversible
   - Test migrations on staging first
   - Keep backups before migrations

5. **Testing**
   - Comprehensive test coverage
   - E2E tests for critical paths
   - Performance tests

---

## Related Documentation

- [Canary Deployment Guide](./canary-harness.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Incident Response](../ops/incident/quiet-mode.ts)

---

**Last Reviewed:** 2025-01-27  
**Next Review:** Quarterly or after major incident
