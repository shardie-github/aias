> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Trust Fabric Overview

## What is Guardian?

Guardian is a self-governing privacy system that continuously monitors your app's behavior, explains it to you in plain language, and builds trust through transparency and accountability.

## Core Principles

- **Offline-Capable**: All monitoring happens locally on your device
- **Open-Sourced**: Fully transparent and auditable
- **Explainable**: Every decision is explainable to users
- **User-Owned**: Your data, your control

## How It Works

### 1. Event Monitoring

Guardian hooks into all app telemetry events via middleware:

- API calls (internal and external)
- Content processing
- Telemetry events
- Navigation events
- Error tracking

### 2. Risk Assessment

Each event is assessed for risk:

- **Low**: Routine operations, no sensitive data
- **Medium**: Some sensitive data, but necessary for functionality
- **High**: Sensitive data access, requires scrutiny
- **Critical**: Unauthorized or suspicious access

### 3. Response Actions

Based on risk level, Guardian can:

- **Allow**: Safe operation, proceed normally
- **Mask**: Hide sensitive portions before processing
- **Redact**: Remove PII before transmission
- **Block**: Prevent unauthorized access
- **Alert**: Notify user of high-risk activity

### 4. Trust Ledger

All events are recorded in an immutable, hash-chained ledger:

- Append-only (cannot be modified)
- Cryptographic verification
- User-only access (RLS enforced)
- Daily hash roots stored securely

### 5. Adaptive Learning

Guardian learns your preferences:

- Privacy mode toggle frequency
- Which signals you disable
- Your risk tolerance
- Context-aware rules

## Privacy Insurance Features

### Private Mode Pulse

One-click toggle to freeze telemetry instantly. Perfect for sensitive moments.

### Sensitive Context Detection

Automatically detects when camera or microphone is active and mutes monitoring accordingly.

### MFA Bubble

Elevated sessions expire sooner when Guardian detects increased risk.

### Emergency Data Lockdown

1-click killswitch that:
- Wipes local telemetry cache
- Pauses background sync
- Enables maximum privacy mode

## User Dashboard

Access your Trust Dashboard at `/dashboard/trust` to see:

- Total events this week
- Risk distribution
- Data classes accessed
- Violations prevented
- Guardian confidence score
- Recent events timeline
- Explainable insights

## Trust Fabric Model

Your personal privacy preferences are stored in a Trust Fabric model that:

- Learns from your behavior
- Adapts to your comfort zones
- Can be exported/imported for portability
- Provides recommendations

## Integration Points

Guardian integrates with:

- **MFA Module**: Elevated session management
- **Privacy Preferences**: Consent flows
- **Data Retention**: Automatic cleanup
- **Observability**: Metrics and monitoring

## API Reference

See `docs/privacy-api-reference.md` for detailed API documentation.

## How Guardian Learns

See `docs/how-guardian-learns.md` for details on the adaptive learning system.

## Compliance

Guardian helps ensure:

- GDPR compliance
- CCPA compliance
- HIPAA compliance (healthcare data)
- SOC 2 Type II alignment

## Verification

Verify ledger integrity:

```bash
npm run ops guardian:verify
```

Run full audit:

```bash
npm run ops guardian:audit
```

Generate report:

```bash
npm run ops guardian:report --weekly
```

## Export/Import

Export your Trust Fabric model:

```bash
npm run ops guardian:export-fabric --output ./my-trust-model.json
```

Import Trust Fabric model:

```bash
npm run ops guardian:import-fabric --file ./my-trust-model.json
```

## Status

Check Guardian status:

```bash
npm run ops guardian:status
```

## Architecture

```
guardian/
├── core.ts              # Core Guardian service
├── middleware.ts        # Event interception hooks
├── inspector.ts         # Log analysis agent
├── recommendations.ts   # Trust Fabric AI
├── explainer.ts        # Guardian GPT
├── policies/
│   └── default.yaml    # Policy configuration
├── logs/
│   ├── trust_ledger.jsonl
│   └── events_*.jsonl
└── reports/
    └── trust_report_*.json
```

## Security

- All ledger entries are cryptographically hashed
- Hash chains verify integrity
- RLS policies ensure user-only access
- Admin can only see aggregated statistics
- No system-level access to user telemetry

## Support

For questions or issues, see:
- `docs/privacy-api-reference.md`
- `docs/how-guardian-learns.md`
- `AI_COMPLIANCE.md`
