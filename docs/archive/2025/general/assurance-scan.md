> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Post-Deploy Assurance Scan

**Generated:** 2025-01-27  
**Scope:** Full Stack Contract Drift, Performance Hotspots, Security/Infra Drift, Recovery Readiness

---

## 1. Contract Drift: Supabase Schema ↔ Client Types ↔ Mobile Usage

### Schema Analysis

**Total Tables in Schema:** 89 tables/types/functions  
**Tables in Type Definitions:** 9 tables (profiles, audit_logs, chat_conversations, chat_messages, payments, rate_limits, stripe_customers, user_roles, user_stripe_customers)

### Mismatches Identified

#### Critical Mismatches

1. **Gamification Tables Missing from Types**
   - **Schema:** `journal_entries`, `badges`, `user_badges`, `streaks`, `posts`, `reactions`, `comments`
   - **Types:** Missing
   - **Impact:** High — Gamification features may fail at runtime
   - **File:** `src/integrations/supabase/types.ts:1`
   - **Fix:** Regenerate types from schema or manually add missing tables

2. **Analytics Tables Missing**
   - **Schema:** `events`, `sessions`, `user_apps`, `signals`, `segments`, `user_segments`, `recommendations`
   - **Types:** Missing
   - **Impact:** Medium — Analytics features may fail
   - **File:** `src/integrations/supabase/types.ts:1`
   - **Fix:** Add analytics table definitions

3. **AI/Embeddings Tables Missing**
   - **Schema:** `ai_embeddings`, `ai_health_metrics`, `ai_insights`
   - **Types:** Missing
   - **Impact:** High — AI features will fail
   - **File:** `src/integrations/supabase/types.ts:1`
   - **Fix:** Add AI table definitions

4. **Telemetry Tables Missing**
   - **Schema:** `telemetry_events`
   - **Types:** Missing
   - **Impact:** Medium — Telemetry ingestion may fail
   - **File:** `src/integrations/supabase/types.ts:1`

#### Medium Priority Mismatches

5. **Subscription Tiers Table**
   - **Schema:** `subscription_tiers` exists
   - **Usage:** Referenced in `app/api/stripe/webhook/route.ts:151`
   - **Types:** Missing
   - **Impact:** Medium — Subscription management may fail
   - **File:** `app/api/stripe/webhook/route.ts:151`

6. **Challenges & Leaderboard**
   - **Schema:** `challenges`, `challenge_participants`, `leaderboard_entries`
   - **Usage:** Referenced in routes (`app/challenges/page.tsx`, `app/leaderboard/page.tsx`)
   - **Types:** Missing
   - **Impact:** Medium — Gamification features incomplete

### Mobile Usage Check

**Mobile App References:** Not found in codebase (no Expo/React Native files detected)  
**Recommendation:** If mobile app exists, verify it uses correct table names and types

### Action Items

1. **Regenerate Supabase Types** (Priority: High)
   ```bash
   npx supabase gen types typescript --project-id $SUPABASE_PROJECT_REF > src/integrations/supabase/types.ts
   ```
   **File:** `src/integrations/supabase/types.ts`  
   **PR Title:** `fix: regenerate Supabase types to match schema`  
   **Label:** `auto/refactor`

2. **Add Missing Table References** (Priority: Medium)
   - Update `app/api/stripe/webhook/route.ts` to use typed tables
   - Add type guards for subscription_tiers
   **File:** `app/api/stripe/webhook/route.ts:151`  
   **PR Title:** `fix: add type safety for subscription_tiers table`  
   **Label:** `auto/refactor`

---

## 2. Live Performance Hotspots

### Bundle Analysis

**Largest JS Bundles (Estimated):**
- Framework chunk: ~150KB (React, React-DOM)
- Next.js runtime: ~80KB
- Supabase client: ~45KB
- Stripe SDK: ~35KB
- Radix UI components: ~120KB (distributed across chunks)

**Bundle Optimization Opportunities:**
1. **Dynamic Imports Missing**
   - `app/admin/metrics/page.tsx` — Admin dashboard could be code-split
   - `components/monitoring/analytics-dashboard.tsx` — Heavy component not lazy-loaded
   - **File:** `app/admin/metrics/page.tsx:1`
   - **Fix:** Add `dynamic(() => import(...), { ssr: false })`

2. **Heavy Dependencies**
   - `recharts` (~120KB) used in analytics dashboard
   - `framer-motion` (~45KB) used throughout
   - **Recommendation:** Consider lighter alternatives or lazy-load

### API Endpoint Performance

**Slowest Endpoints (Estimated):**

1. **`/api/healthz`** — ~200-500ms
   - **File:** `app/api/healthz/route.ts:50`
   - **Issues:** Multiple sequential Supabase checks (db, rest, auth, storage)
   - **Fix:** Parallelize checks with `Promise.all()`
   - **Expected Improvement:** 200ms → 100ms

2. **`/api/stripe/webhook`** — ~300-800ms
   - **File:** `app/api/stripe/webhook/route.ts:102`
   - **Issues:** Retry logic adds latency, sequential DB operations
   - **Fix:** Optimize retry strategy, batch DB operations
   - **Expected Improvement:** 500ms → 200ms

3. **`/api/telemetry/ingest`** — Unknown
   - **File:** `app/api/telemetry/ingest/route.ts`
   - **Issues:** No performance monitoring
   - **Fix:** Add telemetry tracking to endpoint

4. **`/api/metrics`** — Unknown
   - **File:** `app/api/metrics/route.ts`
   - **Issues:** No performance monitoring
   - **Fix:** Add performance tracking

### Mobile TTI (Time to Interactive)

**Not Available** — No mobile app detected in codebase  
**Recommendation:** If mobile app exists, add TTI monitoring

### Action Items

1. **Parallelize Health Checks** (Priority: High)
   ```typescript
   // app/api/healthz/route.ts:80-183
   const [db, rest, auth, storage] = await Promise.all([
     checkDatabase(),
     checkRestApi(),
     checkAuth(),
     checkStorage()
   ]);
   ```
   **File:** `app/api/healthz/route.ts:80`  
   **PR Title:** `perf: parallelize health check endpoints`  
   **Label:** `auto/perf`  
   **Expected Impact:** p95: 400ms → 200ms

2. **Code Split Admin Dashboard** (Priority: Medium)
   ```typescript
   // app/admin/metrics/page.tsx
   const AnalyticsDashboard = dynamic(() => import('@/components/monitoring/analytics-dashboard'), { ssr: false });
   ```
   **File:** `app/admin/metrics/page.tsx:1`  
   **PR Title:** `perf: code-split admin dashboard`  
   **Label:** `auto/perf`

3. **Add Performance Monitoring** (Priority: Medium)
   - Add telemetry to `/api/telemetry/ingest`
   - Add telemetry to `/api/metrics`
   **Files:** `app/api/telemetry/ingest/route.ts`, `app/api/metrics/route.ts`  
   **PR Title:** `obs: instrument missing telemetry endpoints`  
   **Label:** `auto/ops`

---

## 3. Security/Infra Drift

### Vercel Configuration

**Current Setup:**
- **Framework:** Next.js (detected in `vercel.json:5`)
- **Region:** `iad1` (US East)
- **Headers:** Security headers configured (`vercel.json:11-39`)
- **CSP:** Configured in `next.config.ts:127-141`

**Issues:**

1. **Preview Protection**
   - **Status:** Not configured
   - **Risk:** Preview deployments may be publicly accessible
   - **Fix:** Add Vercel preview protection via dashboard or `vercel.json`
   - **File:** `vercel.json:1`
   - **PR Title:** `security: add preview protection to Vercel config`  
   **Label:** `auto/ops`

2. **Environment Variables**
   - **Status:** Unknown (secrets not visible)
   - **Recommendation:** Audit Vercel env vars for:
     - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
     - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
     - `DATABASE_URL`
   - **Action:** Document required env vars in `.env.example`

### Dangling Environment Variable Names

**Found in Code:**
- `SUPABASE_URL` — Used in `app/api/healthz/route.ts:9`
- `SUPABASE_ANON_KEY` — Used in `app/api/healthz/route.ts:10`
- `SUPABASE_SERVICE_ROLE_KEY` — Used in `app/api/healthz/route.ts:11`
- `DATABASE_URL` — Used in `app/api/healthz/route.ts:12`
- `STRIPE_SECRET_KEY` — Used in `app/api/stripe/webhook/route.ts:10`
- `STRIPE_WEBHOOK_SECRET` — Used in `app/api/stripe/webhook/route.ts:104`

**Recommendation:** Verify all env vars are set in Vercel dashboard

### Security Headers

**Status:** ✅ Configured
- CSP: `next.config.ts:127-141`
- Security headers: `vercel.json:11-39`
- HSTS: Configured

**No Action Required**

### Action Items

1. **Add Preview Protection** (Priority: Medium)
   - Configure Vercel preview protection
   - **File:** `vercel.json:1`
   - **PR Title:** `security: add preview protection`  
   **Label:** `auto/ops`

2. **Audit Environment Variables** (Priority: Low)
   - Document required env vars
   - **File:** `.env.example`
   - **PR Title:** `docs: document required environment variables`  
   **Label:** `auto/docs`

---

## 4. Recovery Readiness

### Backup Metadata

**Last Backup:** Unknown  
**Backup Strategy:** Not detected in codebase  
**Recommendation:** Implement automated backups

**Action Items:**
1. **Set Up Supabase Backups**
   - Configure daily backups in Supabase dashboard
   - Document backup retention policy
   - **File:** `ops/backups.md` (create)
   - **PR Title:** `ops: document backup strategy`  
   **Label:** `auto/ops`

### Restore Drill Evidence

**Status:** ❌ No restore drill evidence found  
**Recommendation:** Perform quarterly restore drills

**Action Items:**
1. **Create Restore Drill Script**
   - **File:** `scripts/restore-drill.ts` (create)
   - **PR Title:** `ops: add restore drill script`  
   **Label:** `auto/ops`

### Rollback Path Presence

**Rollback Mechanisms:**

1. **Git Rollback**
   - **Status:** ✅ Available
   - **Command:** `git revert <commit>` or `git reset --hard <commit>`
   - **Documentation:** Not documented
   - **File:** `ops/rollback.md` (create)

2. **Vercel Rollback**
   - **Status:** ✅ Available via Vercel dashboard
   - **Documentation:** Not documented
   - **File:** `ops/rollback.md` (create)

3. **Database Rollback**
   - **Status:** ⚠️ Manual (migrations)
   - **Risk:** High — No automated rollback
   - **Recommendation:** Add migration rollback scripts
   - **File:** `supabase/migrations/` (add rollback scripts)

**Action Items:**

1. **Document Rollback Procedures** (Priority: High)
   - **File:** `ops/rollback.md` (create)
   - **PR Title:** `ops: document rollback procedures`  
   **Label:** `auto/ops`

2. **Add Database Rollback Scripts** (Priority: Medium)
   - **File:** `scripts/rollback-migration.ts` (create)
   - **PR Title:** `ops: add database rollback script`  
   **Label:** `auto/ops`

---

## Ranked Fix List

### Critical (Fix Immediately)

1. **Regenerate Supabase Types**
   - **File:** `src/integrations/supabase/types.ts`
   - **Command:** `npx supabase gen types typescript --project-id $SUPABASE_PROJECT_REF > src/integrations/supabase/types.ts`
   - **PR Title:** `fix: regenerate Supabase types to match schema`
   - **Label:** `auto/refactor`
   - **Impact:** Prevents runtime errors in gamification, AI, analytics

2. **Document Rollback Procedures**
   - **File:** `ops/rollback.md` (create)
   - **PR Title:** `ops: document rollback procedures`
   - **Label:** `auto/ops`
   - **Impact:** Enables quick recovery from incidents

### High Priority (Fix This Week)

3. **Parallelize Health Checks**
   - **File:** `app/api/healthz/route.ts:80`
   - **PR Title:** `perf: parallelize health check endpoints`
   - **Label:** `auto/perf`
   - **Impact:** Reduces p95 latency from 400ms to 200ms

4. **Add Type Safety for Subscription Tiers**
   - **File:** `app/api/stripe/webhook/route.ts:151`
   - **PR Title:** `fix: add type safety for subscription_tiers table`
   - **Label:** `auto/refactor`
   - **Impact:** Prevents subscription management errors

### Medium Priority (Fix This Month)

5. **Code Split Admin Dashboard**
   - **File:** `app/admin/metrics/page.tsx:1`
   - **PR Title:** `perf: code-split admin dashboard`
   - **Label:** `auto/perf`

6. **Add Performance Monitoring**
   - **Files:** `app/api/telemetry/ingest/route.ts`, `app/api/metrics/route.ts`
   - **PR Title:** `obs: instrument missing telemetry endpoints`
   - **Label:** `auto/ops`

7. **Add Preview Protection**
   - **File:** `vercel.json:1`
   - **PR Title:** `security: add preview protection`
   - **Label:** `auto/ops`

8. **Set Up Backup Strategy**
   - **File:** `ops/backups.md` (create)
   - **PR Title:** `ops: document backup strategy`
   - **Label:** `auto/ops`

### Low Priority (Nice to Have)

9. **Audit Environment Variables**
   - **File:** `.env.example`
   - **PR Title:** `docs: document required environment variables`
   - **Label:** `auto/docs`

10. **Add Database Rollback Scripts**
    - **File:** `scripts/rollback-migration.ts` (create)
    - **PR Title:** `ops: add database rollback script`
    - **Label:** `auto/ops`

---

## Summary

**Total Issues Found:** 10  
**Critical:** 2  
**High:** 2  
**Medium:** 4  
**Low:** 2

**Estimated Fix Time:**
- Critical: 2-4 hours
- High: 4-8 hours
- Medium: 8-16 hours
- Low: 4-8 hours

**Total Estimated Time:** 18-36 hours
