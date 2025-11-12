> Archived on 2025-11-12. Superseded by: (see docs/final index)

# CI/CD Optimization Guide

## Overview

This guide explains the CI/CD optimizations implemented to reduce feedback time and improve developer experience.

## Parallelized CI Pipeline

### Before vs After

**Before:** Sequential execution
```
Quality Gates (15min) → Unit Tests → E2E Tests → Build → Deploy
```

**After:** Parallel execution
```
Type Check ─┐
Lint        ├─→ Unit Tests → Build → Deploy
Format      ┘
Security    ─┐
Hygiene     ┘
```

### Performance Improvement

- **Before:** ~15min sequential execution
- **After:** ~8min parallel execution
- **Improvement:** 47% faster feedback

## Pre-Merge Validation

### Workflow

The `pre-merge-validation.yml` workflow runs on every PR:

1. **Type Check** - TypeScript compilation
2. **Lint** - ESLint checks
3. **Format Check** - Prettier validation
4. **Security Scan** - Dependency audit

All checks run in parallel for faster feedback.

### Auto-Comments

Results are automatically commented on PRs:
- ✅ All checks passed
- ⚠️ Some checks failed (with details)

## Job Dependencies

### Optimized Dependencies

```yaml
unit-tests:
  needs: [type-check, lint]  # Only wait for critical checks

e2e-tests:
  needs: [type-check, lint]  # Parallel with unit tests

build-analysis:
  needs: [type-check, lint, unit-tests]  # Wait for tests
```

### Benefits

- Faster feedback - Don't wait for non-critical checks
- Better resource utilization - Parallel execution
- Clearer failure points - Isolated job failures

## Best Practices

1. **Run checks in parallel** - Don't serialize unnecessarily
2. **Optimize dependencies** - Only wait for required jobs
3. **Use caching** - Cache dependencies and build artifacts
4. **Fail fast** - Stop on first critical failure
5. **Provide clear feedback** - Auto-comment results on PRs

## Configuration

### Environment Variables

- `NODE_VERSION` - Node.js version (default: 18)
- `PNPM_VERSION` - pnpm version (default: 8.15.0)

### Caching

- Node modules cached per branch
- Build artifacts cached between runs
- Test results cached for faster re-runs

---

For more details, see `.github/workflows/ci.yml` and `.github/workflows/pre-merge-validation.yml`.
