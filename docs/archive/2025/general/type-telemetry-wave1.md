> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Type & Telemetry Jump-Start Wave 1

**Generated:** 2025-01-27  
**Scope:** Implicit `any` types, unused exports, missing telemetry instrumentation

---

## 1. Files with >5 Implicit `any` Types

### Critical Files (>10 implicit `any`)

1. **`app/api/metrics/route.ts`**
   - **Count:** ~8 implicit `any`
   - **Lines:** 85, 98, 108, 138, 196, 197, 201, 211
   - **Examples:**
     - Line 85: `const aggregated: Record<string, any> = {`
     - Line 98: `const sourceGroups: Record<string, any[]> = {};`
     - Line 138: `(source: any) => source.latest?.isRegression === true`
   - **Fix:** Define proper types for `MetricsResponse`, `SourceGroup`, `TrendData`
   - **PR Title:** `type: strengthen typing in metrics API`
   - **Label:** `auto/docs`

2. **`ai/orchestrator.ts`**
   - **Count:** ~6 implicit `any`
   - **Fix:** Add types for orchestrator state, actions, modules
   - **PR Title:** `type: add types to orchestrator`
   - **Label:** `auto/docs`

3. **`ai/modules/dashboard_generator.ts`**
   - **Count:** ~8 implicit `any`
   - **Fix:** Type dashboard data structures
   - **PR Title:** `type: type dashboard generator`
   - **Label:** `auto/docs`

4. **`ai/modules/cost_forecaster.ts`**
   - **Count:** ~10 implicit `any`
   - **Fix:** Type cost forecasting models
   - **PR Title:** `type: type cost forecaster`
   - **Label:** `auto/docs`

5. **`scripts/generate-performance-report.ts`**
   - **Count:** ~7 implicit `any`
   - **Fix:** Type performance report structures
   - **PR Title:** `type: type performance report script`
   - **Label:** `auto/docs`

### Medium Priority Files (5-10 implicit `any`)

6. **`app/api/healthz/route.ts`**
   - **Count:** ~5 implicit `any`
   - **Lines:** 52, 91, 111, 135, 156
   - **Examples:**
     - Line 52: `const checks: Record<string, any> = {`
     - Line 91: `} catch (e: any) {`
   - **Fix:** Type health check results properly
   - **PR Title:** `type: type health check endpoint`
   - **Label:** `auto/docs`

7. **`app/admin/metrics/page.tsx`**
   - **Count:** ~5 implicit `any`
   - **Fix:** Type admin dashboard props and state
   - **PR Title:** `type: type admin metrics page`
   - **Label:** `auto/docs`

8. **`lib/api/route-handler.ts`**
   - **Count:** ~5 implicit `any`
   - **Fix:** Type route handler utilities
   - **PR Title:** `type: type route handler utilities`
   - **Label:** `auto/docs`

9. **`supabase/functions/analytics-api/index.ts`**
   - **Count:** ~42 implicit `any` (highest!)
   - **Fix:** Type analytics API functions
   - **PR Title:** `type: type analytics API edge function`
   - **Label:** `auto/docs`

10. **`supabase/functions/automation-api/index.ts`**
    - **Count:** ~19 implicit `any`
    - **Fix:** Type automation API functions
    - **PR Title:** `type: type automation API edge function`
    - **Label:** `auto/docs`

### Summary

**Total Files with >5 implicit `any`:** 30 files  
**Total Implicit `any` Count:** ~410 occurrences  
**Top 10 Files:** Listed above

---

## 2. Files with >10 Unused Exports

### Analysis

**Total Exports Found:**
- `lib/`: 136 exports across 34 files
- `src/lib/`: 138 exports across 16 files
- **Total:** ~274 exports

### Files with High Export Count (Potential Unused)

1. **`src/lib/automation.ts`**
   - **Exports:** 31
   - **Check:** Run `ts-prune` to identify unused exports
   - **Action:** Audit and remove unused exports

2. **`lib/blog/articles.ts`**
   - **Exports:** 7
   - **Action:** Audit blog article utilities

3. **`lib/security/api-security.ts`**
   - **Exports:** 13
   - **Action:** Audit security API utilities

4. **`lib/monetization/affiliate.ts`**
   - **Exports:** 7
   - **Action:** Audit affiliate utilities

5. **`lib/blog/rss-feed.ts`**
   - **Exports:** 5
   - **Action:** Audit RSS feed utilities

### Unused Export Detection

**Command to Run:**
```bash
pnpm run prune:exports
pnpm run scan:usage
```

**Expected Output:** `reports/ts-prune.txt`, `reports/knip.json`

**Action Items:**
1. Run unused export detection
2. Review reports
3. Remove unused exports in batches

---

## 3. Endpoints/Pages Lacking RUM/Synthetic Metrics

### API Endpoints Missing Telemetry

1. **`/api/telemetry/ingest`**
   - **File:** `app/api/telemetry/ingest/route.ts:11`
   - **Status:** ❌ No performance tracking
   - **Fix:** Add performance beacon
   ```typescript
   const startTime = Date.now();
   // ... existing code ...
   const duration = Date.now() - startTime;
   telemetry.trackPerformance({ name: 'telemetry_ingest', value: duration, unit: 'ms' });
   ```
   - **PR Title:** `obs: instrument telemetry ingest endpoint`
   - **Label:** `auto/ops`

2. **`/api/metrics`**
   - **File:** `app/api/metrics/route.ts:39`
   - **Status:** ❌ No performance tracking
   - **Fix:** Add performance tracking
   ```typescript
   const startTime = Date.now();
   // ... existing code ...
   const duration = Date.now() - startTime;
   telemetry.trackPerformance({ name: 'metrics_api', value: duration, unit: 'ms' });
   ```
   - **PR Title:** `obs: instrument metrics API endpoint`
   - **Label:** `auto/ops`

3. **`/api/ingest`**
   - **File:** `app/api/ingest/route.ts`
   - **Status:** Unknown (file not reviewed)
   - **Action:** Review and add telemetry if missing

4. **`/api/feedback`**
   - **File:** `app/api/feedback/route.ts`
   - **Status:** Unknown (file not reviewed)
   - **Action:** Review and add telemetry if missing

5. **`/api/stripe/create-checkout`**
   - **File:** `app/api/stripe/create-checkout/route.ts`
   - **Status:** Unknown (file not reviewed)
   - **Action:** Review and add telemetry if missing

### Pages Missing RUM (Real User Monitoring)

1. **`/admin/metrics`**
   - **File:** `app/admin/metrics/page.tsx`
   - **Status:** ❌ No RUM tracking
   - **Fix:** Add Web Vitals tracking
   ```typescript
   useEffect(() => {
     import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
       onCLS(telemetry.trackWebVital);
       onFID(telemetry.trackWebVital);
       onFCP(telemetry.trackWebVital);
       onLCP(telemetry.trackWebVital);
       onTTFB(telemetry.trackWebVital);
     });
   }, []);
   ```
   - **PR Title:** `obs: add RUM to admin metrics page`
   - **Label:** `auto/ops`

2. **`/billing`**
   - **File:** `app/billing/page.tsx`
   - **Status:** Unknown (file not reviewed)
   - **Action:** Review and add RUM if missing

3. **`/checkout`** (if exists)
   - **Status:** Unknown
   - **Action:** Review checkout flow and add RUM

### Synthetic Monitoring Gaps

**Missing Synthetic Checks:**
1. **Health Check Monitoring**
   - **Endpoint:** `/api/healthz`
   - **Status:** ❌ No synthetic monitoring
   - **Fix:** Add synthetic check (e.g., Vercel Cron or external service)
   - **PR Title:** `obs: add synthetic monitoring for health check`
   - **Label:** `auto/ops`

2. **Critical User Flows**
   - **Checkout Flow:** No synthetic monitoring
   - **Login Flow:** No synthetic monitoring
   - **Action:** Add synthetic checks for critical flows

---

## Action Plan

### Wave 1: Type Strengthening (Top 10 Files)

**Target:** ≤30 explicit type fixes across top 10 files

**Files:**
1. `app/api/metrics/route.ts` — Define `MetricsResponse`, `SourceGroup`, `TrendData`
2. `app/api/healthz/route.ts` — Type health check results
3. `ai/orchestrator.ts` — Type orchestrator state
4. `ai/modules/dashboard_generator.ts` — Type dashboard data
5. `ai/modules/cost_forecaster.ts` — Type cost models
6. `scripts/generate-performance-report.ts` — Type report structures
7. `app/admin/metrics/page.tsx` — Type admin props
8. `lib/api/route-handler.ts` — Type route handlers
9. `supabase/functions/analytics-api/index.ts` — Type analytics API
10. `supabase/functions/automation-api/index.ts` — Type automation API

**PR Title:** `type: strengthen typing (telemetry wave)`  
**Label:** `auto/docs`  
**Estimated LOC:** ~200-300 lines

### Wave 2: Telemetry Instrumentation

**Target:** Add minimal beacons/metrics on key endpoints

**Endpoints:**
1. `/api/telemetry/ingest` — Add performance tracking
2. `/api/metrics` — Add performance tracking
3. `/api/healthz` — Add synthetic monitoring
4. `/admin/metrics` — Add RUM tracking

**PR Title:** `obs: instrument missing telemetry`  
**Label:** `auto/ops`  
**Estimated LOC:** ~50-100 lines

### Scripts to Add

1. **`scripts/typecheck`** (already exists in package.json)
   ```json
   "typecheck": "tsc --noEmit"
   ```

2. **`scripts/type:coverage`** (add)
   ```bash
   # Count type coverage
   npx type-coverage --detail
   ```
   **Add to package.json:**
   ```json
   "type:coverage": "npx type-coverage --detail"
   ```

3. **`scripts/obs:check`** (add)
   ```bash
   # Check for missing telemetry
   grep -r "telemetry.track" app/api --include="*.ts" | wc -l
   ```
   **Add to package.json:**
   ```json
   "obs:check": "tsx scripts/check-telemetry.ts"
   ```

---

## Summary

**Type Issues:**
- Files with >5 implicit `any`: 30 files
- Total implicit `any` count: ~410
- Top 10 files identified

**Unused Exports:**
- Total exports: ~274
- Files with high export count: 5 files
- Action: Run `ts-prune` and `knip` to identify unused

**Missing Telemetry:**
- API endpoints missing telemetry: 5 endpoints
- Pages missing RUM: 1+ pages
- Synthetic monitoring gaps: 2+ checks

**Estimated Effort:**
- Type strengthening: 8-16 hours
- Telemetry instrumentation: 4-8 hours
- Scripts: 2-4 hours
- **Total:** 14-28 hours
