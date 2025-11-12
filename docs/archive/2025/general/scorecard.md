> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Systems Scorecard

**Last Updated:** 2025-01-27

## Key Metrics

| Metric | Current | Target | Status | Trend |
|--------|---------|--------|--------|-------|
| Lead Time | 26h | <12h | 🔴 | → |
| Cycle Time | 42min | <30min | 🟡 | → |
| CI Failure Rate | 5% | <2% | 🔴 | → |
| Deploy Failure Rate | 1% | <1% | 🟢 | → |
| Review Queue | 8 PRs | <4 PRs | 🔴 | → |
| Rework Rate | 18% | <10% | 🔴 | → |

## Status Legend
- 🟢 Green: Meeting target
- 🟡 Amber: Close to target
- 🔴 Red: Not meeting target

## Trends
- → Stable
- ↑ Improving
- ↓ Declining

## Next Actions
1. Optimize review queue (P0)
2. Reduce CI failure rate (P1)
3. Reduce rework rate (P2)

## Detailed Metrics

### Lead Time
- **Current:** 26h (commit to production)
- **Target:** <12h
- **Breakdown:**
  - CI Pipeline: 15min
  - Review: 24h (bottleneck)
  - Build: 10min
  - Deploy: 35min

### Cycle Time
- **Current:** 42min (active work time)
- **Target:** <30min
- **Breakdown:**
  - CI Pipeline: 12min
  - Review: 2h (active review time)
  - Build: 8min
  - Deploy: 18min

### Failure Rates
- **CI:** 5% (target: <2%)
- **Build:** 2% (target: <1%)
- **Deploy:** 1% (target: <1%)

### Queue Lengths
- **Review:** 8 PRs (target: <4 PRs)
- **CI:** 3 PRs (target: <2 PRs)
- **Build:** 0 (target: 0)
- **Deploy:** 0 (target: 0)

### Rework Rate
- **Current:** 18%
- **Target:** <10%
- **Breakdown:**
  - CI Failures: 5%
  - Review Feedback: 10%
  - Build Failures: 2%
  - Deploy Failures: 1%

---

**Next Update:** Weekly (Monday 04:40 UTC)
