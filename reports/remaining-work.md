# Remaining Work & Recommendations

**Generated:** 2025-01-27  
**Status:** Critical fixes complete, additional improvements identified

---

## ✅ Completed (This Session)

### Critical Fixes
- ✅ Telemetry endpoint error handling
- ✅ Route handler request body caching
- ✅ Middleware setInterval fix
- ✅ Health checks parallelization
- ✅ Type safety improvements (~30 fixes)
- ✅ Telemetry instrumentation (2 endpoints)
- ✅ Input validation (Stripe webhook)
- ✅ Performance optimizations (N+1 reduction, caching)
- ✅ Dead code removal (unused webhook handler)

### Documentation
- ✅ Rollback procedures (`ops/rollback.md`)
- ✅ Route handler migration guide (`docs/migration-guide-route-handler.md`)
- ✅ Implementation summary
- ✅ All assurance reports

---

## 🔄 High Priority Remaining Work

### 1. Regenerate Supabase Types (Critical)

**Issue:** Schema has 89 tables, types only define 9 tables  
**Impact:** Runtime errors in gamification, AI, analytics features  
**File:** `src/integrations/supabase/types.ts`

**Action:**
```bash
# Regenerate types from live schema
npx supabase gen types typescript --project-id $SUPABASE_PROJECT_REF > src/integrations/supabase/types.ts
```

**PR Title:** `fix: regenerate Supabase types to match schema`  
**Label:** `auto/refactor`  
**Priority:** 🔴 Critical

---

### 2. Migrate API Routes to Route Handler Utility

**Issue:** Routes don't use centralized route handler  
**Impact:** Inconsistent error handling, security, caching  
**Files:**
- `app/api/stripe/create-checkout/route.ts` (needs migration to App Router)
- `app/api/stripe/webhook/route.ts` (can use route handler)
- `app/api/telemetry/ingest/route.ts` (can use route handler)
- `app/api/metrics/route.ts` (can use route handler)

**Action:** Follow migration guide in `docs/migration-guide-route-handler.md`

**PR Title:** `refactor: migrate API routes to route handler utility`  
**Label:** `auto/refactor`  
**Priority:** 🟡 High

---

### 3. Add Input Validation to Remaining Endpoints

**Issue:** Some endpoints lack Zod validation  
**Files:**
- `app/api/stripe/create-checkout/route.ts` (needs Zod schema)
- `app/api/feedback/route.ts` (needs validation)
- `app/api/ingest/route.ts` (needs validation)

**Action:** Add Zod schemas for all POST/PUT endpoints

**PR Title:** `security: add input validation to remaining endpoints`  
**Label:** `auto/refactor`  
**Priority:** 🟡 High

---

### 4. Optimize SQL Queries

**Issue:** Metrics aggregation could use SQL DISTINCT ON  
**File:** `app/api/metrics/route.ts`

**Action:** Create Supabase RPC function for efficient aggregation:
```sql
CREATE OR REPLACE FUNCTION get_latest_metrics_per_source()
RETURNS TABLE(source TEXT, metric JSONB, ts TIMESTAMPTZ) AS $$
  SELECT DISTINCT ON (source) source, metric, ts
  FROM metrics_log
  ORDER BY source, ts DESC
  LIMIT 100;
$$ LANGUAGE sql;
```

**PR Title:** `perf: optimize metrics query with SQL aggregation`  
**Label:** `auto/perf`  
**Priority:** 🟡 Medium

---

### 5. Remove Unused Exports

**Issue:** ~274 exports, some may be unused  
**Action:** Run unused export detection

```bash
# Run detection
pnpm run prune:exports
pnpm run scan:usage

# Review reports
cat reports/ts-prune.txt
cat reports/knip.json

# Remove unused exports in batches
```

**PR Title:** `refactor: remove unused exports`  
**Label:** `auto/refactor`  
**Priority:** 🟢 Low

---

## 🧪 Testing & Quality

### 6. Add Tests for Critical Fixes

**Missing Tests:**
- Telemetry endpoint error handling
- Route handler request body caching
- Health check parallelization
- Input validation

**Action:** Create test files:
- `tests/api/telemetry-ingest.test.ts`
- `tests/lib/route-handler.test.ts`
- `tests/api/healthz.test.ts`

**PR Title:** `test: add tests for critical fixes`  
**Label:** `auto/docs`  
**Priority:** 🟡 Medium

---

### 7. Implement Quality Gates

**Issue:** Quality gates workflow exists but checks are stubbed  
**File:** `.github/workflows/quality-gates.yml`

**Action:** Implement actual checks:
- Bundle size comparison with baseline
- Type coverage calculation
- Test execution and reporting

**PR Title:** `ci: implement quality gates checks`  
**Label:** `auto/ops`  
**Priority:** 🟡 Medium

---

## 📊 Performance Improvements

### 8. Code Split Heavy Components

**Issue:** Recharts (~120KB) loaded on every admin page load  
**Files:** Components using Recharts

**Action:** Lazy-load chart components:
```typescript
const Chart = dynamic(() => import('@/components/charts/chart'), { ssr: false });
```

**PR Title:** `perf: code split heavy chart components`  
**Label:** `auto/perf`  
**Priority:** 🟢 Low

---

### 9. Add Memoization to Hot Components

**Issue:** Some components recalculate on every render  
**Files:** Admin dashboard components

**Action:** Add `useMemo` and `useCallback` where appropriate

**PR Title:** `perf: add memoization to hot components`  
**Label:** `auto/perf`  
**Priority:** 🟢 Low

---

## 🔒 Security Improvements

### 10. Add Preview Protection

**Issue:** Preview deployments may be publicly accessible  
**File:** `vercel.json`

**Action:** Configure Vercel preview protection:
1. Go to Vercel Dashboard → Project Settings → Deployment Protection
2. Enable "Preview Deployment Protection"
3. Require password or team member access

**PR Title:** `security: add preview protection`  
**Label:** `auto/ops`  
**Priority:** 🟡 Medium

---

### 11. Audit Environment Variables

**Issue:** Need to document and verify all required env vars  
**File:** `.env.example`

**Action:** 
1. Audit all env vars used in codebase
2. Document in `.env.example`
3. Verify all are set in Vercel

**PR Title:** `docs: document required environment variables`  
**Label:** `auto/docs`  
**Priority:** 🟢 Low

---

## 🏗️ Infrastructure

### 12. Set Up Backup Strategy

**Issue:** No documented backup strategy  
**File:** `ops/backups.md` (create)

**Action:**
1. Configure Supabase daily backups
2. Document backup retention policy
3. Create restore drill script

**PR Title:** `ops: document backup strategy`  
**Label:** `auto/ops`  
**Priority:** 🟡 Medium

---

### 13. Implement Canary Harness

**Issue:** Framework exists but not implemented  
**Files:** `ops/canary-harness.md`, `.github/workflows/canary-deploy.yml`

**Action:**
1. Implement feature flag system
2. Add canary monitoring to checkout endpoint
3. Set up stop-loss thresholds
4. Create monitoring dashboard

**PR Title:** `ops: implement canary harness for checkout`  
**Label:** `auto/systems`  
**Priority:** 🟢 Low (framework ready)

---

## 📝 Documentation

### 14. Expand UX Tone Audit

**Issue:** Only 3 files audited, ~25 files remain  
**Action:** Review remaining user-facing files

**PR Title:** `ux: tone harmonisation (wave 2)`  
**Label:** `auto/docs`  
**Priority:** 🟢 Low

---

### 15. Create ADR for Major Decisions

**Issue:** Some decisions not documented  
**File:** `systems/decision-log.md`

**Action:** Add ADRs for:
- Route handler utility adoption
- Caching strategy
- Error taxonomy

**PR Title:** `docs: add ADRs for recent decisions`  
**Label:** `auto/docs`  
**Priority:** 🟢 Low

---

## 🎯 Recommended Priority Order

### Week 1 (Critical)
1. Regenerate Supabase types
2. Add input validation to remaining endpoints
3. Migrate one route as example (telemetry/ingest)

### Week 2 (High Priority)
4. Migrate remaining API routes
5. Add tests for critical fixes
6. Implement quality gates checks

### Week 3 (Medium Priority)
7. Optimize SQL queries
8. Add preview protection
9. Document backup strategy

### Week 4+ (Low Priority)
10. Remove unused exports
11. Code split heavy components
12. Implement canary harness
13. Expand UX tone audit

---

## 📈 Success Metrics

**Target Metrics:**
- Type coverage: ≥95% (currently ~90% estimated)
- Bundle size delta: ≤0 KB
- Health check p95: <200ms (currently ~100ms ✅)
- Telemetry coverage: 100% of critical endpoints (currently 2/5)
- Test coverage: ≥80% (baseline needed)

---

## 🔄 Continuous Improvement

### Weekly
- Review quality gates results
- Check for new type issues
- Monitor performance metrics

### Monthly
- Run unused export detection
- Review and update documentation
- Audit security configurations

### Quarterly
- Comprehensive code review
- Performance optimization sprint
- Architecture review

---

**Last Updated:** 2025-01-27  
**Next Review:** After Week 1 priorities complete
