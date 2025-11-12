> Archived on 2025-11-12. Superseded by: (see docs/final index)

# How Guardian Learns

## Overview

Guardian uses a Trust Fabric AI layer to learn your privacy preferences and adaptively adjust its behavior. This document explains how the learning system works.

## Learning Mechanisms

### 1. Privacy Mode Toggle Frequency

Guardian tracks how often you enable/disable Private Mode:

- **High frequency** (>5 times/week): Suggests you want stricter defaults
- **Low frequency** (<2 times/week): Indicates current settings are comfortable

**Impact**: Guardian recommends tighter or looser defaults accordingly.

### 2. Signal Disabling Patterns

When you disable specific signals (location, microphone, etc.), Guardian learns:

- Which data classes you're uncomfortable with
- Context-specific preferences
- Risk tolerance levels

**Example**: If you consistently disable location tracking, Guardian will:
- Increase risk weight for location-based events
- Suggest blocking location access by default
- Apply stricter rules to location data

### 3. User Decision Patterns

Guardian observes your responses to privacy prompts:

- **Always Allow**: You consistently allow certain operations
- **Always Block**: You consistently block certain operations
- **Context-Dependent**: Your decisions vary by context

**Learning**: Guardian builds a model of your preferences:

```typescript
learned_preferences: {
  always_allows: ['user:telemetry', 'app:content'],
  always_blocks: ['external:location', 'api:credentials'],
  context_rules: [
    {
      context: 'camera_active',
      action: 'block',
      confidence: 0.9
    }
  ]
}
```

### 4. Risk Tolerance Assessment

Guardian calculates your risk tolerance:

- **Low**: You frequently block medium-risk events
- **Medium**: Balanced approach, default behavior
- **High**: You allow most operations

**Calculation**: Based on:
- Ratio of blocked/allowed events
- Privacy mode toggle frequency
- Response to high-risk events

### 5. Context-Aware Rules

Guardian learns context-specific preferences:

**Detected Contexts**:
- Camera active
- Microphone active
- Location tracking enabled
- Biometric authentication
- Sensitive data entry

**Learning Process**:
1. Detect context from event metadata
2. Observe user decision for that context
3. Update confidence score
4. Apply rule in future similar contexts

## Adaptive Recommendations

Guardian generates recommendations based on learned patterns:

### Tighten Recommendations

Triggered when:
- Privacy mode toggled frequently
- Multiple signals disabled
- Consistent blocking of certain operations
- Low risk tolerance detected

**Example Recommendation**:
```json
{
  "type": "tighten",
  "scope": "external",
  "reason": "User has toggled privacy mode 7 times this week",
  "impact": "May reduce false positives",
  "confidence": 0.8
}
```

### Loosen Recommendations

Triggered when:
- User consistently allows certain operations
- No privacy mode toggles
- High trust level maintained

**Example Recommendation**:
```json
{
  "type": "loosen",
  "scope": "app:telemetry",
  "reason": "User consistently allows telemetry events",
  "impact": "May reduce unnecessary prompts",
  "confidence": 0.6
}
```

### Maintain Recommendations

Triggered when:
- Consistent low-risk pattern
- Balanced user behavior
- Stable preferences

**Example Recommendation**:
```json
{
  "type": "maintain",
  "scope": "all",
  "reason": "Consistent low-risk pattern detected",
  "impact": "Current settings are appropriate",
  "confidence": 0.9
}
```

## Risk Weight Adjustment

Guardian adaptively adjusts risk weights:

```typescript
// Based on learned preferences
adjustRiskWeights(): Record<string, number> {
  const weights: Record<string, number> = {};
  
  // Increase weight for blocked operations
  always_blocks.forEach(blocked => {
    weights[blocked] = (weights[blocked] || 0.5) + 0.2;
  });
  
  // Decrease weight for allowed operations
  always_allows.forEach(allowed => {
    weights[allowed] = Math.max(0.1, (weights[allowed] || 0.5) - 0.1);
  });
  
  return weights;
}
```

## Trust Fabric Model

Your learned preferences are stored in a Trust Fabric model:

```typescript
interface TrustFabricModel {
  comfort_zones: {
    privacy_mode_toggles: number;
    signals_disabled: string[];
    average_trust_responses: Record<string, 'allow' | 'block' | 'mask'>;
    risk_tolerance: 'low' | 'medium' | 'high';
  };
  learned_preferences: {
    always_allows: string[];
    always_blocks: string[];
    context_rules: Array<{
      context: string;
      action: 'allow' | 'block' | 'mask';
      confidence: number;
    }>;
  };
  adaptive_weights: Record<string, number>;
  last_updated: string;
}
```

## Export/Import

Your Trust Fabric model is portable:

**Export**:
```bash
npm run ops guardian:export-fabric --output ./my-model.json
```

**Import**:
```bash
npm run ops guardian:import-fabric --file ./my-model.json
```

This allows you to:
- Backup your preferences
- Transfer to new devices
- Share with trusted parties
- Restore after reset

## Privacy & Transparency

- **Local Learning**: All learning happens on your device
- **No External Calls**: Guardian doesn't send data to external services
- **User-Owned**: Your model belongs to you
- **Explainable**: Every recommendation is explainable
- **Auditable**: All learning data is in the ledger

## Continuous Improvement

Guardian continuously improves:

1. **Daily**: Analyze events, update preferences
2. **Weekly**: Generate recommendations
3. **Monthly**: Review and adjust risk weights
4. **Quarterly**: Full model refresh

## Best Practices

1. **Let It Learn**: Allow Guardian to observe your behavior
2. **Review Recommendations**: Check weekly reports
3. **Provide Feedback**: Use privacy toggles to signal preferences
4. **Export Regularly**: Backup your Trust Fabric model
5. **Trust the Process**: Guardian improves over time

## Limitations

- Learning requires sufficient data (minimum 50 events)
- Recommendations improve with more usage
- Context detection depends on metadata quality
- Risk weights adjust gradually (not instant)

## Future Enhancements

Planned improvements:
- Federated learning across devices
- Collaborative filtering
- Advanced context detection
- Predictive privacy protection
