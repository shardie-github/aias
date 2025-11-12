> Archived on 2025-11-12. Superseded by: (see docs/final index)

# RACI Matrix — Roles & Responsibilities

**Generated:** 2025-01-27  
**Methodology:** Lightweight RACI (Responsible, Accountable, Consulted, Informed)

## Definitions

- **R (Responsible):** Does the work
- **A (Accountable):** Owns the outcome (one per activity)
- **C (Consulted):** Provides input
- **I (Informed):** Kept in the loop

## Deployments

| Activity | Developer | Tech Lead | DevOps | QA | Product |
|----------|-----------|-----------|--------|-----|---------|
| Code Changes | R | C | I | I | I |
| PR Creation | R | C | I | I | I |
| Code Review | C | R/A | I | C | I |
| Merge Approval | C | R/A | I | C | I |
| Staging Deploy | I | C | R/A | R | I |
| Production Deploy | I | A | R | C | I |
| Rollback | I | A | R | C | I |

**Notes:**
- Tech Lead accountable for code quality
- DevOps responsible for infrastructure
- QA responsible for testing

## Incidents

| Activity | On-Call | Tech Lead | DevOps | Product | Support |
|----------|---------|-----------|--------|---------|---------|
| Incident Detection | R | I | I | I | R |
| Incident Triage | R | C | C | I | C |
| Incident Resolution | R | C | R | I | I |
| Post-Mortem | R | A | C | C | I |
| Follow-Up Actions | C | A | R | I | I |

**Notes:**
- On-Call Engineer responsible for initial response
- Tech Lead accountable for post-mortem
- DevOps responsible for infrastructure fixes

## Schema Changes

| Activity | Developer | Tech Lead | DBA | DevOps | Product |
|----------|-----------|-----------|-----|--------|---------|
| Schema Design | R | A | C | I | C |
| Migration Script | R | C | A | I | I |
| Migration Review | C | A | R | C | I |
| Migration Execution | I | A | R | C | I |
| Rollback Plan | C | A | R | C | I |

**Notes:**
- DBA accountable for database integrity
- Tech Lead accountable for overall design
- DevOps responsible for execution

## Security Issues

| Activity | Developer | Security | Tech Lead | DevOps | Product |
|----------|-----------|----------|-----------|--------|---------|
| Vulnerability Detection | I | R | I | I | I |
| Risk Assessment | C | R/A | C | C | I |
| Fix Implementation | R | C | A | I | I |
| Security Review | C | R/A | C | I | I |
| Deployment | I | A | C | R | I |

**Notes:**
- Security team accountable for risk assessment
- Developer responsible for fixes
- Tech Lead accountable for code quality

## Performance Issues

| Activity | Developer | Performance | Tech Lead | DevOps | Product |
|----------|-----------|-------------|-----------|--------|---------|
| Performance Monitoring | I | R | I | I | I |
| Issue Identification | I | R/A | C | C | I |
| Optimization | R | C | A | I | I |
| Performance Testing | C | R/A | C | I | I |
| Deployment | I | A | C | R | I |

**Notes:**
- Performance team accountable for monitoring
- Developer responsible for optimization
- Tech Lead accountable for code quality

## Feature Development

| Activity | Developer | Tech Lead | Product | QA | Design |
|----------|-----------|-----------|---------|-----|---------|
| Requirements | I | C | R/A | C | C |
| Design | C | A | C | I | R |
| Implementation | R | A | C | I | I |
| Testing | C | C | I | R/A | I |
| Deployment | R | A | I | C | I |

**Notes:**
- Product accountable for requirements
- Tech Lead accountable for technical design
- QA accountable for testing

## Roles (Inferred from CODEOWNERS/PR History)

**Note:** Roles inferred from codebase structure. Mark "TBD" if unknown.

| Role | Current Assignee | Status |
|------|------------------|--------|
| Tech Lead | TBD | TBD |
| DevOps | TBD | TBD |
| Security | TBD | TBD |
| Performance | TBD | TBD |
| QA | TBD | TBD |
| Product | TBD | TBD |

**Action Required:** Update with actual team members

---

**Next Review:** Quarterly or when team structure changes
