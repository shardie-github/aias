/**
 * Guardian Core Service
 * Self-governing privacy guardian that monitors app behavior
 */

import { createHash } from 'crypto';
import { existsSync, mkdirSync, appendFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { PrivacyGuard } from '../ai/privacy_guard';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type DataScope = 'user' | 'app' | 'api' | 'external';
export type DataClass = 'telemetry' | 'location' | 'audio' | 'biometrics' | 'content' | 'credentials' | 'other';
export type ResponseAction = 'allow' | 'mask' | 'redact' | 'block' | 'alert';

export interface GuardianEvent {
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

export interface TrustLedgerEntry {
  event_id: string;
  timestamp: string;
  type: string;
  scope: DataScope;
  user_decision: string;
  guardian_action: ResponseAction;
  sha256: string;
  previous_hash?: string;
}

export interface PolicyConfig {
  allowed_scopes: DataScope[];
  data_classes: DataClass[];
  risk_weights: {
    impact: Record<RiskLevel, number>;
    likelihood: Record<string, number>;
  };
  response_actions: Record<RiskLevel, ResponseAction[]>;
  thresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export class GuardianService {
  private static instance: GuardianService;
  private ledgerPath: string;
  private logsPath: string;
  private policiesPath: string;
  private policies: Map<string, PolicyConfig>;
  private privateMode: boolean = false;
  private lastHash: string = '';
  private privacyGuard: PrivacyGuard;

  private constructor() {
    // Initialize paths
    const guardianDir = join(process.cwd(), 'guardian');
    this.ledgerPath = join(guardianDir, 'logs', 'trust_ledger.jsonl');
    this.logsPath = join(guardianDir, 'logs');
    this.policiesPath = join(guardianDir, 'policies');

    // Ensure directories exist
    [guardianDir, this.logsPath, this.policiesPath].forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });

    this.policies = new Map();
    this.privacyGuard = new PrivacyGuard();
    this.loadPolicies();
    this.initializeLedger();
  }

  static getInstance(): GuardianService {
    if (!GuardianService.instance) {
      GuardianService.instance = new GuardianService();
    }
    return GuardianService.instance;
  }

  /**
   * Initialize ledger with first entry
   */
  private initializeLedger(): void {
    if (!existsSync(this.ledgerPath) || readFileSync(this.ledgerPath, 'utf-8').trim() === '') {
      const genesisHash = this.computeHash('genesis');
      this.lastHash = genesisHash;
      const genesisEntry: TrustLedgerEntry = {
        event_id: 'genesis',
        timestamp: new Date().toISOString(),
        type: 'init',
        scope: 'app',
        user_decision: 'system',
        guardian_action: 'allow',
        sha256: genesisHash,
      };
      this.appendToLedger(genesisEntry);
    } else {
      // Read last hash from ledger
      const lines = readFileSync(this.ledgerPath, 'utf-8').trim().split('\n');
      if (lines.length > 0) {
        const lastEntry = JSON.parse(lines[lines.length - 1]);
        this.lastHash = lastEntry.sha256;
      }
    }
  }

  /**
   * Load policy configurations
   */
  private loadPolicies(): void {
    const defaultPolicy: PolicyConfig = {
      allowed_scopes: ['user', 'app'],
      data_classes: ['telemetry', 'content'],
      risk_weights: {
        impact: {
          low: 0.2,
          medium: 0.5,
          high: 0.8,
          critical: 1.0,
        },
        likelihood: {
          direct: 1.0,
          inferred: 0.6,
          aggregated: 0.3,
        },
      },
      response_actions: {
        low: ['allow'],
        medium: ['allow', 'mask'],
        high: ['mask', 'redact', 'alert'],
        critical: ['block', 'alert'],
      },
      thresholds: {
        low: 0.3,
        medium: 0.5,
        high: 0.7,
        critical: 0.9,
      },
    };

    this.policies.set('default', defaultPolicy);
  }

  /**
   * Compute hash for ledger entry
   */
  private computeHash(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  /**
   * Append entry to immutable ledger
   */
  private appendToLedger(entry: TrustLedgerEntry): void {
    const entryString = JSON.stringify(entry);
    appendFileSync(this.ledgerPath, entryString + '\n', 'utf-8');
  }

  /**
   * Assess risk for a data access event
   */
  assessRisk(
    scope: DataScope,
    dataClass: DataClass,
    metadata: Record<string, unknown> = {}
  ): { score: number; level: RiskLevel } {
    const policy = this.policies.get('default')!;

    // Check if scope is allowed
    if (!policy.allowed_scopes.includes(scope)) {
      return { score: 1.0, level: 'critical' };
    }

    // Check if data class is restricted
    const restrictedClasses: DataClass[] = ['biometrics', 'credentials'];
    if (restrictedClasses.includes(dataClass)) {
      return { score: 0.8, level: 'high' };
    }

    // Calculate risk score
    let score = 0.0;
    
    // Impact factor based on data class
    const impactMap: Record<DataClass, number> = {
      telemetry: 0.2,
      location: 0.5,
      audio: 0.7,
      biometrics: 0.9,
      content: 0.4,
      credentials: 1.0,
      other: 0.3,
    };

    const impact = impactMap[dataClass] || 0.3;
    
    // Likelihood factor
    const likelihood = metadata.external === true ? 1.0 : 0.5;
    
    score = impact * likelihood;

    // Determine risk level
    let level: RiskLevel = 'low';
    if (score >= policy.thresholds.critical) level = 'critical';
    else if (score >= policy.thresholds.high) level = 'high';
    else if (score >= policy.thresholds.medium) level = 'medium';
    else level = 'low';

    return { score, level };
  }

  /**
   * Generate event fingerprint
   */
  private generateFingerprint(event: Omit<GuardianEvent, 'fingerprint' | 'event_id'>): string {
    const fingerprintData = {
      timestamp: event.timestamp,
      type: event.type,
      scope: event.scope,
      data_class: event.data_class,
      risk_score: event.risk_score,
    };
    return this.computeHash(JSON.stringify(fingerprintData));
  }

  /**
   * Record a guardian event
   */
  recordEvent(
    type: string,
    scope: DataScope,
    dataClass: DataClass,
    description: string,
    metadata: Record<string, unknown> = {}
  ): GuardianEvent {
    // Skip if private mode is active
    if (this.privateMode && scope !== 'user') {
      return {
        event_id: this.generateEventId(),
        timestamp: new Date().toISOString(),
        type,
        scope,
        data_class: dataClass,
        description: 'Event suppressed (Private Mode)',
        risk_score: 0,
        risk_level: 'low',
        action_taken: 'block',
        metadata: {},
        fingerprint: '',
      };
    }

    // Assess risk
    const { score, level } = this.assessRisk(scope, dataClass, metadata);
    const policy = this.policies.get('default')!;
    
    // Determine action
    const actions = policy.response_actions[level];
    const action = actions[0] || 'allow';

    // Create event
    const event: Omit<GuardianEvent, 'fingerprint' | 'event_id'> = {
      timestamp: new Date().toISOString(),
      type,
      scope,
      data_class: dataClass,
      description,
      risk_score: score,
      risk_level: level,
      action_taken: action,
      metadata: this.sanitizeMetadata(metadata),
    };

    const fingerprint = this.generateFingerprint(event);
    const event_id = this.generateEventId();
    const fullEvent: GuardianEvent = {
      ...event,
      event_id,
      fingerprint,
    };

    // Apply action
    this.applyAction(action, fullEvent);

    // Record to ledger
    const ledgerEntry: TrustLedgerEntry = {
      event_id,
      timestamp: fullEvent.timestamp,
      type,
      scope,
      user_decision: fullEvent.user_decision || 'pending',
      guardian_action: action,
      sha256: this.computeHash(JSON.stringify(fullEvent) + this.lastHash),
      previous_hash: this.lastHash,
    };

    this.lastHash = ledgerEntry.sha256;
    this.appendToLedger(ledgerEntry);

    // Also write full event to JSONL log
    const logPath = join(this.logsPath, `events_${new Date().toISOString().split('T')[0]}.jsonl`);
    appendFileSync(logPath, JSON.stringify(fullEvent) + '\n', 'utf-8');

    return fullEvent;
  }

  /**
   * Apply response action
   */
  private applyAction(action: ResponseAction, event: GuardianEvent): void {
    switch (action) {
      case 'block':
        console.warn(`[GUARDIAN] BLOCKED: ${event.type} - ${event.description}`);
        break;
      case 'mask':
        console.warn(`[GUARDIAN] MASKED: ${event.type} - ${event.description}`);
        break;
      case 'redact':
        console.warn(`[GUARDIAN] REDACTED: ${event.type} - ${event.description}`);
        break;
      case 'alert':
        console.warn(`[GUARDIAN] ALERT: ${event.type} - ${event.description}`);
        break;
      case 'allow':
      default:
        // Allow silently
        break;
    }
  }

  /**
   * Sanitize metadata before storing
   */
  private sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value === 'string') {
        const redacted = this.privacyGuard.redactPII(value);
        sanitized[key] = redacted.redacted;
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Enable private mode (freeze telemetry)
   */
  enablePrivateMode(): void {
    this.privateMode = true;
    this.recordEvent('guardian', 'user', 'telemetry', 'Private Mode enabled', {
      action: 'enable_private_mode',
    });
  }

  /**
   * Disable private mode
   */
  disablePrivateMode(): void {
    this.privateMode = false;
    this.recordEvent('guardian', 'user', 'telemetry', 'Private Mode disabled', {
      action: 'disable_private_mode',
    });
  }

  /**
   * Get private mode status
   */
  isPrivateMode(): boolean {
    return this.privateMode;
  }

  /**
   * Emergency data lockdown
   */
  async emergencyLockdown(): Promise<void> {
    this.enablePrivateMode();
    
    // Clear local telemetry cache
    // This would integrate with your telemetry service
    console.log('[GUARDIAN] Emergency lockdown activated');
    
    this.recordEvent('guardian', 'user', 'telemetry', 'Emergency lockdown activated', {
      action: 'emergency_lockdown',
    });
  }

  /**
   * Get events from ledger
   */
  getLedgerEvents(limit: number = 100): TrustLedgerEntry[] {
    if (!existsSync(this.ledgerPath)) return [];
    
    const lines = readFileSync(this.ledgerPath, 'utf-8').trim().split('\n');
    const entries = lines
      .filter(line => line.trim())
      .map(line => JSON.parse(line) as TrustLedgerEntry)
      .slice(-limit);
    
    return entries.reverse(); // Most recent first
  }

  /**
   * Verify ledger integrity
   */
  verifyLedgerIntegrity(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!existsSync(this.ledgerPath)) {
      return { valid: false, errors: ['Ledger file does not exist'] };
    }

    const lines = readFileSync(this.ledgerPath, 'utf-8').trim().split('\n');
    let previousHash = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const entry = JSON.parse(line) as TrustLedgerEntry;
        
        // Verify hash chain
        if (i > 0 && entry.previous_hash !== previousHash) {
          errors.push(`Hash chain broken at entry ${i}: expected ${previousHash}, got ${entry.previous_hash}`);
        }
        
        // Verify entry hash
        const expectedHash = this.computeHash(
          JSON.stringify({
            event_id: entry.event_id,
            timestamp: entry.timestamp,
            type: entry.type,
            scope: entry.scope,
            user_decision: entry.user_decision,
            guardian_action: entry.guardian_action,
            previous_hash: entry.previous_hash || '',
          })
        );
        
        if (entry.sha256 !== expectedHash) {
          errors.push(`Invalid hash for entry ${i}: event_id ${entry.event_id}`);
        }
        
        previousHash = entry.sha256;
      } catch (error) {
        errors.push(`Invalid JSON at line ${i}: ${error}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const guardianService = GuardianService.getInstance();
