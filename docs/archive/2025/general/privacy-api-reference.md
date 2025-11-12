> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Privacy API Reference

## Guardian Service

### Core Service

```typescript
import { guardianService } from '@/guardian/core';

// Record an event
const event = guardianService.recordEvent(
  'telemetry',
  'app',
  'telemetry',
  'Page view tracked',
  { path: '/dashboard' }
);

// Enable private mode
guardianService.enablePrivateMode();

// Disable private mode
guardianService.disablePrivateMode();

// Check private mode status
const isPrivate = guardianService.isPrivateMode();

// Emergency lockdown
await guardianService.emergencyLockdown();

// Get ledger events
const events = guardianService.getLedgerEvents(100);

// Verify ledger integrity
const { valid, errors } = guardianService.verifyLedgerIntegrity();
```

### Middleware Integration

```typescript
import { initializeGuardianMiddleware } from '@/guardian/middleware';

// Initialize middleware (auto-initializes in browser)
initializeGuardianMiddleware();

// Intercept API calls manually
import { interceptAPICall } from '@/guardian/middleware';

const event = interceptAPICall(
  'https://api.example.com/data',
  'POST',
  requestBody,
  headers
);

// Intercept content processing
import { interceptContentProcessing } from '@/guardian/middleware';

const event = interceptContentProcessing(
  content,
  'AI analysis'
);
```

### Inspector Agent

```typescript
import { guardianInspector } from '@/guardian/inspector';

// Analyze logs
const report = await guardianInspector.analyzeLogs();

// Generate weekly report
const markdown = await guardianInspector.generateWeeklyReport();

// Run hourly analysis
await guardianInspector.runHourlyAnalysis();
```

### Trust Fabric AI

```typescript
import { trustFabricAI } from '@/guardian/recommendations';

// Learn from event
trustFabricAI.learnFromEvent(event, 'allowed');

// Generate recommendations
const recommendations = trustFabricAI.generateRecommendations();

// Adjust risk weights
const weights = trustFabricAI.adjustRiskWeights();

// Get comfort zone
const comfort = trustFabricAI.getComfortZone();

// Export model
const model = trustFabricAI.exportModel();

// Import model
trustFabricAI.importModel(model);
```

### Guardian GPT Explainer

```typescript
import { guardianGPT } from '@/guardian/explainer';

// Explain data access
const explanation = await guardianGPT.explainDataAccess(report);

// Explain rules
const rules = await guardianGPT.explainRules(event);

// Explain disable monitoring
const disable = await guardianGPT.explainDisableMonitoring();

// Explain event
const eventExplanation = await guardianGPT.explainEvent(event);

// Answer general question
const answer = await guardianGPT.answerQuestion(
  'What data was used?',
  { events: [event], report }
);
```

## React Components

### Trust Dashboard

```tsx
import TrustDashboard from '@/pages/TrustDashboard';

<Route path="/dashboard/trust" element={<TrustDashboard />} />
```

## Policy Configuration

### YAML Policy Format

```yaml
name: default
version: 1.0.0

allowed_scopes:
  - user
  - app
  - api

data_classes:
  - telemetry
  - location
  - audio
  - biometrics
  - content
  - credentials
  - other

risk_weights:
  impact:
    low: 0.2
    medium: 0.5
    high: 0.8
    critical: 1.0
  
  likelihood:
    direct: 1.0
    inferred: 0.6
    aggregated: 0.3

response_actions:
  low:
    - allow
  
  medium:
    - allow
    - mask
  
  high:
    - mask
    - redact
    - alert
  
  critical:
    - block
    - alert

thresholds:
  low: 0.3
  medium: 0.5
  high: 0.7
  critical: 0.9
```

## Types

### GuardianEvent

```typescript
interface GuardianEvent {
  event_id: string;
  timestamp: string;
  type: string;
  scope: DataScope;
  data_class: DataClass;
  description: string;
  risk_score: number;
  risk_level: RiskLevel;
  action_taken: ResponseAction;
  user_decision?: 'allowed' | 'blocked' | 'pending';
  metadata: Record<string, unknown>;
  fingerprint: string;
  previous_hash?: string;
}
```

### TrustLedgerEntry

```typescript
interface TrustLedgerEntry {
  event_id: string;
  timestamp: string;
  type: string;
  scope: DataScope;
  user_decision: string;
  guardian_action: ResponseAction;
  sha256: string;
  previous_hash?: string;
}
```

### TrustReport

```typescript
interface TrustReport {
  generated_at: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    total_events: number;
    by_risk_level: Record<string, number>;
    by_data_class: Record<string, number>;
    by_scope: Record<string, number>;
    policy_changes: number;
    anomalies: string[];
  };
  events: Array<{
    event_id: string;
    timestamp: string;
    type: string;
    risk_level: string;
    action_taken: string;
    description: string;
  }>;
  guardian_confidence_score: number;
  violations_prevented: number;
  recommendations: Array<{
    type: 'tighten' | 'loosen' | 'maintain';
    scope: string;
    reason: string;
    impact: string;
  }>;
}
```

## Supabase Integration

### Database Schema

```sql
-- Trust ledger roots
CREATE TABLE trust_ledger_roots (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    date DATE NOT NULL,
    hash_root TEXT NOT NULL,
    event_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
);

-- Guardian preferences
CREATE TABLE guardian_preferences (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    trust_level TEXT,
    auto_adjust BOOLEAN,
    risk_weights JSONB,
    private_mode_enabled BOOLEAN
);

-- Guardian events
CREATE TABLE guardian_events (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    event_id TEXT UNIQUE,
    event_type TEXT,
    scope TEXT,
    data_class TEXT,
    risk_level TEXT,
    risk_score NUMERIC,
    action_taken TEXT
);
```

### RLS Policies

All tables have Row Level Security enabled:

- Users can only access their own data
- Admins can only see aggregated statistics
- System can insert events (service role)

## CLI Commands

```bash
# Verify ledger integrity
npm run ops guardian:verify

# Run audit
npm run ops guardian:audit --report

# Generate report
npm run ops guardian:report --weekly --format markdown

# Export Trust Fabric
npm run ops guardian:export-fabric --output ./model.json

# Import Trust Fabric
npm run ops guardian:import-fabric --file ./model.json

# Check status
npm run ops guardian:status
```

## Best Practices

1. **Initialize Early**: Set up Guardian middleware at app startup
2. **Monitor Events**: Review Trust Dashboard regularly
3. **Export Model**: Backup your Trust Fabric model
4. **Verify Integrity**: Run `guardian:verify` regularly
5. **Review Reports**: Check weekly reports for anomalies
6. **Use Private Mode**: Enable during sensitive operations
7. **Trust Recommendations**: Let Guardian learn your preferences
