> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Incident Runbook: Build Failure

## Overview
This runbook guides response to CI/CD build failures blocking deployments.

**Target:** Build success rate ≥ 95%  
**Alert Threshold:** 3+ consecutive failures

## Pre-Incident Checklist

- [ ] Verify GitHub Actions status
- [ ] Check recent code changes
- [ ] Review dependency updates
- [ ] Check environment variables

## Detection

### Symptoms
- GitHub Actions workflow failures
- Deployment blocked
- Test suite failures
- Build timeout errors

### What to Capture

1. **Build Logs**
   - GitHub Actions → Failed workflow → View logs
   - Export full log output
   - Capture error stack traces

2. **Recent Changes**
   ```bash
   git log --since="24 hours ago" --oneline
   git diff HEAD~1 HEAD
   ```

3. **Dependency Changes**
   - `package.json` changes
   - `pnpm-lock.yaml` changes
   - Lock file conflicts

4. **Environment Variables**
   - Check GitHub Secrets (names only, never values)
   - Verify required env vars present
   - Check for typos in secret names

## Response Steps

### 1. Immediate Actions (0-5 min)

- [ ] **Identify Failure Type**
  - TypeScript compilation errors
  - Test failures
  - Linting errors
  - Build timeout
  - Dependency resolution failures

- [ ] **Check Workflow Status**
  - GitHub Actions → Workflows
  - Identify failing step
  - Review error message

- [ ] **Verify Branch State**
  ```bash
  git fetch origin
  git status
  git log --oneline -5
  ```

### 2. Investigation (5-15 min)

**TypeScript Errors:**
- [ ] Run locally: `npm run typecheck`
- [ ] Check for type mismatches
- [ ] Review recent type changes

**Test Failures:**
- [ ] Run locally: `npm test`
- [ ] Check for flaky tests
- [ ] Review test environment setup

**Linting Errors:**
- [ ] Run locally: `npm run lint`
- [ ] Auto-fix if safe: `npm run lint:fix`
- [ ] Review ESLint config changes

**Build Timeout:**
- [ ] Check build duration history
- [ ] Review bundle size changes
- [ ] Check for infinite loops in build scripts

**Dependency Issues:**
- [ ] Verify lock file is committed
- [ ] Run: `pnpm install`
- [ ] Check for peer dependency conflicts

### 3. Mitigation (15-30 min)

**Quick Fixes:**
- [ ] Fix TypeScript errors
- [ ] Update failing tests
- [ ] Fix linting issues
- [ ] Add missing dependencies

**If Lock File Issue:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git commit -m "fix: regenerate lock file"
```

**If Environment Variable Missing:**
- [ ] Add secret to GitHub repository
- [ ] Verify secret name matches code
- [ ] Re-run workflow

**If Test Flakiness:**
- [ ] Mark flaky test with `test.skip()` temporarily
- [ ] Create issue to fix properly
- [ ] Re-run workflow

### 4. Post-Incident (30+ min)

- [ ] **Document Root Cause**
  - Update this runbook with findings
  - Create GitHub issue with label `auto/maint`
  - Link to build logs

- [ ] **Preventive Measures**
  - Add pre-commit hooks (if missing)
  - Improve test stability
  - Add build time monitoring

- [ ] **Communication**
  - Update PR with fix explanation
  - Notify team if deployment blocked
  - Schedule retrospective (if severity warrants)

## Common Issues & Solutions

### TypeScript Compilation Errors
```bash
# Run typecheck locally
npm run typecheck

# Common fixes:
# - Fix type annotations
# - Add missing type imports
# - Update @types packages
```

### Test Failures
```bash
# Run tests locally
npm test

# Check for:
# - Environment variable differences
# - Time-dependent tests
# - Race conditions
```

### Dependency Resolution
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check for conflicts
pnpm why <package-name>
```

### Build Timeout
- Check bundle size: `npm run build:analyze`
- Review webpack/vite config
- Check for circular dependencies

## Escalation

**Escalate if:**
- Production deployment blocked > 2 hours
- Multiple workflows failing
- Infrastructure issue suspected
- Security-related build failure

**Escalation Contacts:**
- On-call engineer
- DevOps lead
- Security team (if security-related)

## Related Resources

- **CI/CD Config:** `.github/workflows/`
- **Build Scripts:** `package.json` → scripts
- **TypeScript Config:** `tsconfig.json`
- **Lint Config:** `eslint.config.js`

## Prevention

- Pre-commit hooks (Husky)
- Required status checks on main branch
- Regular dependency updates (weekly maintenance)
- Build performance monitoring

---

**Last Updated:** {{ date }}  
**Maintained By:** Hardonia Ops Agent
