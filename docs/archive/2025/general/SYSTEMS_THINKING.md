> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Systems Thinking Documentation

## Overview

This document explains the systems thinking artifacts and how to use them for optimization decisions.

## Value Stream Map (VSM)

**Location:** `systems/vsm.md`

The VSM maps the flow from commit to customer impact:
- Lead time: 26h (target: <12h)
- Cycle time: 42min (target: <30min)
- Rework rate: 18% (target: <10%)

### Key Bottlenecks

1. **Review Queue** - 24h lead time (primary bottleneck)
2. **CI Pipeline** - 15min lead time
3. **Error-to-Fix Latency** - Unknown (needs tracking)

## Dependency Graph

**Location:** `systems/dependency-graph.mmd`

Visual representation of system dependencies:
- Frontend components
- Backend services
- AI agents
- Infrastructure
- External services

## Causal Loop Diagrams

**Location:** `systems/flows.mmd`

Shows reinforcing and balancing loops:
- Feature throughput loops
- Error response loops
- Performance monitoring loops
- Tech debt loops

## Metrics Tree

**Location:** `systems/metrics-tree.md`

Hierarchy of objectives → outcomes → proxy metrics:
- System reliability
- Feature delivery velocity
- Code quality
- Developer experience

## Leverage Points

**Location:** `reports/leverage-points.md`

Top 5 optimization opportunities:
1. Review queue optimization (P0)
2. CI pipeline parallelization (P1)
3. Automated error detection (P1)
4. Pre-merge validation (P2)
5. Performance monitoring (P2)

## OKRs

**Location:** `systems/okrs.yaml`

Quarterly objectives aligned with SLOs:
- Reliability & Performance
- Feature Delivery Velocity
- Code Quality & Developer Experience

## Decision Log

**Location:** `systems/decision-log.md`

Architecture Decision Records (ADRs):
- Error taxonomy implementation
- Design token consolidation
- Benchmark harness
- Systems thinking artifacts
- Review queue optimization

## RACI Matrix

**Location:** `systems/raci.md`

Roles and responsibilities for:
- Deployments
- Incidents
- Schema changes
- Security issues
- Performance issues

## Experiments

**Location:** `ops/experiments.csv`

Low-risk experiments with:
- Hypotheses
- Metrics
- Guardrails
- Rollback plans

## Systems Scorecard

**Location:** `systems/scorecard.md`

Weekly metrics snapshot:
- Lead/cycle time
- Failure rates
- Queue lengths
- Rework rate

Updated weekly via `.github/workflows/systems-metrics.yml`.

## Usage

1. **Review VSM** - Identify bottlenecks
2. **Check Leverage Points** - Prioritize optimizations
3. **Track OKRs** - Monitor progress
4. **Review Decisions** - Understand rationale
5. **Run Experiments** - Test improvements

---

For more details, see individual files in `systems/` directory.
