> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Decision Log — Architecture Decision Records (ADR-lite)

**Format:** Lightweight ADR entries for major changes

---

## ADR-001: Error Taxonomy Implementation

**Date:** 2025-01-27  
**Status:** Proposed  
**Context:** Need for consistent error handling across the codebase

**Decision:** Implement structured error taxonomy with error classes in `src/lib/errors.ts`

**Rationale:**
- Consistent error handling improves debugging
- Error taxonomy enables better error tracking
- Structured errors improve API responses

**Alternatives Considered:**
- Continue with ad-hoc error handling (rejected - inconsistent)
- Use external error library (rejected - unnecessary dependency)

**Consequences:**
- Positive: Consistent error handling, better debugging
- Negative: Migration effort for existing code
- Risk: Low - additive change, backward compatible

**Implementation:**
- Create `src/lib/errors.ts` with error classes
- Migrate API routes to use error classes
- Add error taxonomy documentation

---

## ADR-002: Design Token Consolidation

**Date:** 2025-01-27  
**Status:** Proposed  
**Context:** Need for canonical design token system

**Decision:** Create `design/tokens.json` as source of truth for design tokens

**Rationale:**
- Centralized token system improves consistency
- Token documentation helps developers
- Enables future design system expansion

**Alternatives Considered:**
- Keep tokens in Tailwind config only (rejected - less discoverable)
- Use external design token tool (rejected - unnecessary complexity)

**Consequences:**
- Positive: Better token discoverability, documentation
- Negative: Additional file to maintain
- Risk: Low - documentation only, no code changes

**Implementation:**
- Create `design/tokens.json`
- Document token usage
- Reference in README

---

## ADR-003: Benchmark Harness Implementation

**Date:** 2025-01-27  
**Status:** Proposed  
**Context:** Need for performance regression detection

**Decision:** Implement microbenchmark harness in `bench/runner.ts` with weekly CI runs

**Rationale:**
- Early detection of performance regressions
- Data-driven performance optimization
- Historical performance trends

**Alternatives Considered:**
- Use external benchmarking tool (rejected - unnecessary dependency)
- Manual performance testing (rejected - not scalable)

**Consequences:**
- Positive: Performance regression detection, data-driven optimization
- Negative: Additional CI time, maintenance overhead
- Risk: Low - additive change, optional usage

**Implementation:**
- Create `bench/runner.ts`
- Add example benchmarks
- Add weekly CI workflow

---

## ADR-004: Systems Thinking Artifacts

**Date:** 2025-01-27  
**Status:** Proposed  
**Context:** Need for systems-level understanding and optimization

**Decision:** Create systems thinking artifacts (VSM, dependency graph, flows, metrics tree)

**Rationale:**
- Systems thinking improves optimization decisions
- Value stream mapping identifies bottlenecks
- Causal loop diagrams reveal feedback loops

**Alternatives Considered:**
- Continue without systems thinking (rejected - suboptimal decisions)
- Use external tools (rejected - unnecessary complexity)

**Consequences:**
- Positive: Better optimization decisions, systems understanding
- Negative: Initial creation effort, maintenance overhead
- Risk: Low - documentation only

**Implementation:**
- Create `systems/vsm.md`
- Create `systems/dependency-graph.mmd`
- Create `systems/flows.mmd`
- Create `systems/metrics-tree.md`

---

## ADR-005: Review Queue Optimization

**Date:** 2025-01-27  
**Status:** Proposed  
**Context:** Review queue is the primary bottleneck (24h lead time)

**Decision:** Optimize review queue through parallelization, assignments, and SLAs

**Rationale:**
- Review queue is the constraint
- Reducing review time increases feature throughput
- Parallelization and assignments distribute load

**Alternatives Considered:**
- Add more reviewers only (rejected - doesn't address process)
- Reduce review scope only (rejected - may reduce quality)

**Consequences:**
- Positive: Faster feature delivery, better developer experience
- Negative: Requires process changes, team coordination
- Risk: Medium - process change, monitor quality

**Implementation:**
- Add review assignments
- Set review SLAs (4h response time)
- Encourage smaller PRs
- Monitor review quality

---

---

## ADR-006: Route Handler Utility Adoption

**Date:** 2025-01-27  
**Status:** Implemented  
**Context:** Need for consistent error handling, security, caching across API routes

**Decision:** Migrate all API routes to use `createRouteHandler` utility from `lib/api/route-handler.ts`

**Rationale:**
- Consistent error handling improves debugging
- Built-in security (auth, tenant isolation, rate limiting)
- Automatic caching reduces load
- Input validation with Zod schemas
- Performance tracking built-in

**Alternatives Considered:**
- Continue with ad-hoc route handlers (rejected - inconsistent)
- Use external framework (rejected - unnecessary dependency)
- Create wrapper per route (rejected - duplication)

**Consequences:**
- Positive: Consistent error handling, better security, improved performance
- Negative: Migration effort for existing routes
- Risk: Low - backward compatible, gradual migration

**Implementation:**
- Created route handler utility
- Migrated telemetry/ingest, metrics, ingest endpoints
- Created migration guide
- Added tests

---

## ADR-007: Caching Strategy for Expensive Operations

**Date:** 2025-01-27  
**Status:** Implemented  
**Context:** Trends calculation and metrics aggregation are expensive

**Decision:** Use multi-layer caching (Redis + memory) with 60s TTL for expensive calculations

**Rationale:**
- Trends calculation queries 7 days of data
- Metrics aggregation processes large datasets
- Caching reduces database load
- 60s TTL balances freshness and performance

**Alternatives Considered:**
- No caching (rejected - too slow)
- Longer TTL (rejected - stale data)
- Background jobs (considered - future enhancement)

**Consequences:**
- Positive: Faster response times, reduced DB load
- Negative: Slight data staleness (60s)
- Risk: Low - acceptable staleness for metrics

**Implementation:**
- Added caching to trends calculation
- Added caching to metrics endpoint
- Used cacheService from lib/performance/cache

---

## ADR-008: Error Taxonomy Implementation

**Date:** 2025-01-27  
**Status:** Implemented  
**Context:** Need for structured error handling

**Decision:** Use error classes from `src/lib/errors.ts` (ValidationError, SystemError, etc.)

**Rationale:**
- Consistent error responses
- Better error tracking
- Improved debugging
- Type-safe error handling

**Alternatives Considered:**
- Ad-hoc error handling (rejected - inconsistent)
- External error library (rejected - unnecessary)

**Consequences:**
- Positive: Consistent errors, better debugging
- Negative: Migration effort
- Risk: Low - additive change

**Implementation:**
- Error classes already exist
- Migrated endpoints to use error classes
- Added error tracking

---

**Next Entry:** Add new ADRs as major decisions are made
