> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Ops Schedule

## Daily

```bash
npm run ops doctor
npm run ops check
```

Check reports in `/ops/reports/` and fix any issues.

## Weekly

```bash
npm run ops release
npm run ops docs
npm run ops benchmark
npm run ops rotate-secrets -- --force
```

## Monthly

```bash
npm run ops snapshot
npm run ops restore -- --dry-run  # DR rehearsal
npm audit update
npm run ops sb-guard -- --report
```

## Quarterly

- Full security audit
- Performance review
- Cost optimization review
