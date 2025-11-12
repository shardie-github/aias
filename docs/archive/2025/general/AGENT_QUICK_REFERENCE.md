> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Unified Hardonia Agent - Quick Reference

## 🚀 Quick Commands

```bash
# Run unified agent
npm run agent:unified

# Run orchestrator (used by unified agent)
npm run orchestrator

# Check reliability dashboard
curl http://localhost:3000/api/admin/reliability

# Check compliance status
curl http://localhost:3000/api/admin/compliance

# View metrics
curl http://localhost:3000/api/metrics
```

## 📁 Artifact Locations

- **Reliability**: `/app/admin/reliability.json` + `.md`
- **Compliance**: `/app/admin/compliance.json`
- **SBOM**: `/security/sbom.json`
- **Intent Log**: `/docs/intent-log.md`
- **Roadmap**: `/roadmap/current-sprint.md`
- **Auto-Improvement**: `/auto/next-steps.md`

## 🔧 Configuration

- **Master Config**: `.cursor/config/master-agent.json`
- **Agent Config**: `ai/agent_config.json`
- **Orchestrator**: `ai/orchestrator.ts`

## 📊 Dashboards

- **Reliability**: `/admin/reliability`
- **Compliance**: `/admin/compliance`
- **Metrics**: `/admin/metrics`

## 🔄 Workflow

1. Agent runs (scheduled or manual)
2. Orchestrator checks reliability, cost, security
3. Artifacts generated in `/app/admin/`, `/security/`, `/docs/`, `/roadmap/`, `/auto/`
4. GitHub Actions commits artifacts (if changes)
5. Dashboards read from artifacts

## 🎯 Agent Modes

- **Full**: Complete cycle (reliability, cost, security, docs, roadmap)
- **Quick**: Reliability check only

## 🔒 Safety Features

- Never exposes secrets
- Skips major upgrades
- Prefers PR over direct push
- Retains last 3 audit snapshots

## 📝 Logs

- **Intent Log**: `/docs/intent-log.md`
- **GitHub Actions**: `.github/workflows/unified-agent.yml`
- **Orchestrator Reports**: Supabase `orchestrator_reports` table
