> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Self-Healing Data & Systems Stack

**Status:** ✅ Complete  
**Last Updated:** 2025-01-29

## Overview

This stack provides a comprehensive self-healing infrastructure for data pipelines, system health monitoring, and automated remediation. All components are idempotent, non-destructive, and safe to re-run.

## Quick Start

1. **Set up environment variables:**
   ```bash
   cp infra/env/.env.example .env
   # Edit .env with your Supabase credentials
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # Note: If pg is missing, install separately: npm install pg --save-dev --legacy-peer-deps
   ```

3. **Run preflight checks:**
   ```bash
   npm run preflight
   ```

4. **Apply migrations:**
   ```bash
   supabase db push
   # Or generate delta migration:
   npm run delta:migrate
   ```

5. **Verify database:**
   ```bash
   npm run verify:db
   ```

6. **Run master orchestration:**
   ```bash
   npm run orchestrate
   ```

## Architecture

### Phase A: Business Intelligence Audit
- **Location:** `reports/exec/unaligned_audit.md`
- **Purpose:** Diagnose alignment gaps and value leakage
- **Output:** Alignment temperature, momentum index, top misfits

### Phase B: Finance → Automation → Growth
- **Location:** `reports/exec/finance_automation_growth_memo.md`
- **Components:**
  - Finance model: `models/finance_model.csv`, `models/assumptions.json`
  - Automation: `infra/gh-actions/nightly-etl.yml`, `infra/cron/etl.cron`
  - Growth: `growth/portfolio.md`, `growth/experiments/`

### Phase C: Six-Part System Health Audit
- **Location:** `reports/system/`, `solutions/system/`
- **Modules:**
  1. Feedback Loops
  2. Second-Order Effects
  3. Socio-Technical Alignment
  4. Constraint Propagation
  5. Entropy/Robustness
  6. Multi-Agent Coherence

### Phase D: Supabase Delta Migrations
- **Location:** `supabase/migrations/000000000800_upsert_functions.sql`
- **Scripts:**
  - `scripts/agents/generate_delta_migration.ts` - Introspects DB, writes only missing objects
  - `scripts/agents/verify_db.ts` - Verifies tables, columns, indexes, RLS, policies

### Phase E: Guardrails Pack
- **Preflight:** `scripts/agents/preflight.ts`
- **ETL Scripts:** `scripts/etl/*.ts` (all support `--dry-run`)
- **Data Quality:** `tests/data_quality.sql`, `scripts/agents/run_data_quality.ts`
- **System Doctor:** `scripts/agents/system_doctor.ts` (self-heals + opens tickets)
- **Notifications:** `scripts/agents/notify.ts` (Slack integration)

### Phase F: Master Orchestration
- **Script:** `scripts/orchestrate_master.ts`
- **Order:** Preflight → Guardrails → System Health → Migrations → ETL → DQ → Doctor → Summary

## Key Features

### Idempotent Operations
- All migrations use `IF NOT EXISTS`
- All scripts safe to re-run
- No destructive DDL

### Self-Healing
- System doctor attempts automatic fixes
- Opens backlog tickets on failure
- Retries with exponential backoff

### Data Quality Gates
- NOT NULL checks
- Freshness validation
- Duplicate detection
- Future date prevention

### CI/CD Integration
- Preflight checks on PR
- Nightly ETL automation
- Weekly system health audit
- Delta migration application

## Scripts Reference

```bash
# Preflight & Verification
npm run preflight          # Run preflight checks
npm run verify:db          # Verify database schema

# Migrations
npm run delta:migrate      # Generate delta migration

# ETL
npm run etl:events         # Pull events (supports --dry-run)
npm run etl:source-a       # Pull Source A ads (supports --dry-run)
npm run etl:source-b       # Pull Source B ads (supports --dry-run)
npm run etl:metrics        # Compute metrics
npm run etl:all            # Run all ETL scripts

# Data Quality
npm run dq:check           # Run data quality checks

# System Health
npm run system:doctor      # Run system doctor
npm run system:health      # Run system health audit

# Master Orchestration
npm run orchestrate        # Run all phases in order
```

## Environment Variables

**Required:**
- `SUPABASE_DB_URL` - PostgreSQL connection string

**Optional:**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `TZ` - Timezone (default: America/Toronto)
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications
- `GENERIC_SOURCE_A_TOKEN` - Source A API token
- `GENERIC_SOURCE_B_TOKEN` - Source B API token

**ETL Configuration:**
- `RUN_BACKFILL=true|false` - Enable backfill mode
- `BACKFILL_SOURCES=source_a,source_b,events` - Sources to backfill
- `BACKFILL_START=YYYY-MM-DD` - Backfill start date
- `BACKFILL_END=YYYY-MM-DD` - Backfill end date

## CI/CD Workflows

All workflows are in `infra/gh-actions/`:

1. **preflight.yml** - Runs on PR, validates environment
2. **data_quality.yml** - Nightly at 2 AM UTC, runs DQ checks
3. **nightly-etl.yml** - Nightly at 1 AM UTC, runs ETL pipeline
4. **supabase_delta_apply.yml** - On migration push, applies delta migrations
5. **system_health.yml** - Weekly on Sunday, runs system health audit

## Reports

- **Preflight:** `reports/exec/preflight_report.md`
- **System Health:** `reports/system_health_YYYY-MM-DD.md`
- **Run Summary:** `reports/exec/run_summary_YYYY-MM-DD.md`
- **Finance Memo:** `reports/exec/finance_automation_growth_memo.md`

## Backlog Tickets

System doctor creates tickets in `backlog/READY_system_fix_*.md` when failures are detected.

## Guardrails

✅ No destructive DDL  
✅ All migrations idempotent  
✅ RLS enabled on all tables  
✅ ≥1 SELECT policy per table  
✅ Retries with exponential backoff  
✅ Dry-run support for ETL  
✅ Timezone: America/Toronto  
✅ Logging produces Markdown reports  

## Next Steps

1. Set up GitHub Secrets (see `infra/env/.env.example`)
2. Enable CI/CD workflows
3. Run `npm run orchestrate` to verify setup
4. Monitor `reports/exec/` for execution summaries
5. Review `backlog/READY_*` for system fixes

## Support

- **Documentation:** See individual script files for detailed usage
- **Issues:** System doctor creates backlog tickets automatically
- **Logs:** Check `reports/exec/run_logs_*.md` for execution logs
