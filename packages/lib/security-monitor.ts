import { prisma } from './database';
import { config } from '@ai-consultancy/config';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  source: string;
  description: string;
  metadata: Record<string, any>;
  userId?: string;
  orgId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface ThreatDetectionRule {
  id: string;
  name: string;
  description: string;
  pattern: string;
  severity: SecuritySeverity;
  enabled: boolean;
  actions: SecurityAction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityAlert {
  id: string;
  eventId: string;
  ruleId?: string;
  severity: SecuritySeverity;
  title: string;
  description: string;
  status: AlertStatus;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum SecurityEventType {
  LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  DATA_BREACH_ATTEMPT = 'DATA_BREACH_ATTEMPT',
  MALICIOUS_REQUEST = 'MALICIOUS_REQUEST',
  API_ABUSE = 'API_ABUSE',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  GEOGRAPHIC_ANOMALY = 'GEOGRAPHIC_ANOMALY',
  DEVICE_ANOMALY = 'DEVICE_ANOMALY',
  BEHAVIORAL_ANOMALY = 'BEHAVIORAL_ANOMALY',
}

export enum SecuritySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum SecurityAction {
  LOG = 'LOG',
  ALERT = 'ALERT',
  BLOCK = 'BLOCK',
  RATE_LIMIT = 'RATE_LIMIT',
  NOTIFY_ADMIN = 'NOTIFY_ADMIN',
  SUSPEND_USER = 'SUSPEND_USER',
  REQUIRE_2FA = 'REQUIRE_2FA',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
}

export class SecurityMonitor {
  private threatRules: Map<string, ThreatDetectionRule> = new Map();
  private rateLimiters: Map<string, { count: number; resetTime: number }> = new Map();
  private userSessions: Map<string, { lastActivity: Date; ipAddress: string; userAgent: string }> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    const defaultRules: ThreatDetectionRule[] = [
      {
        id: 'brute-force-detection',
        name: 'Brute Force Detection',
        description: 'Detects multiple failed login attempts from the same IP',
        pattern: 'login_failure:5:300', // 5 failures in 5 minutes
        severity: SecuritySeverity.HIGH,
        enabled: true,
        actions: [SecurityAction.BLOCK, SecurityAction.ALERT],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'suspicious-login-location',
        name: 'Suspicious Login Location',
        description: 'Detects login from unusual geographic location',
        pattern: 'geo_anomaly:true',
        severity: SecuritySeverity.MEDIUM,
        enabled: true,
        actions: [SecurityAction.ALERT, SecurityAction.REQUIRE_2FA],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'api-rate-limit',
        name: 'API Rate Limit Exceeded',
        description: 'Detects excessive API usage',
        pattern: 'api_calls:1000:3600', // 1000 calls in 1 hour
        severity: SecuritySeverity.MEDIUM,
        enabled: true,
        actions: [SecurityAction.RATE_LIMIT, SecurityAction.ALERT],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'malicious-request',
        name: 'Malicious Request Detection',
        description: 'Detects potentially malicious HTTP requests',
        pattern: 'malicious_pattern:true',
        severity: SecuritySeverity.HIGH,
        enabled: true,
        actions: [SecurityAction.BLOCK, SecurityAction.ALERT],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    defaultRules.forEach(rule => {
      this.threatRules.set(rule.id, rule);
    });
  }

  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): Promise<SecurityEvent> {
    const securityEvent = await prisma.webhookEvent.create({
      data: {
        source: 'security-monitor',
        event: event.type,
        payload: {
          ...event,
          timestamp: new Date(),
        },
        orgId: event.orgId || 'security',
      },
    });

    const fullEvent: SecurityEvent = {
      id: securityEvent.id,
      ...event,
      timestamp: new Date(),
      resolved: false,
    };

    // Check against threat detection rules
    await this.checkThreatRules(fullEvent);

    // Update user session tracking
    if (event.userId) {
      this.userSessions.set(event.userId, {
        lastActivity: new Date(),
        ipAddress: event.ipAddress || 'unknown',
        userAgent: event.userAgent || 'unknown',
      });
    }

    return fullEvent;
  }

  private async checkThreatRules(event: SecurityEvent): Promise<void> {
    for (const rule of this.threatRules.values()) {
      if (!rule.enabled) continue;

      if (await this.matchesRule(event, rule)) {
        await this.executeRuleActions(event, rule);
      }
    }
  }

  private async matchesRule(event: SecurityEvent, rule: ThreatDetectionRule): Promise<boolean> {
    const [patternType, ...params] = rule.pattern.split(':');

    switch (patternType) {
      case 'login_failure':
        return await this.checkLoginFailurePattern(event, params);
      case 'geo_anomaly':
        return await this.checkGeographicAnomaly(event);
      case 'api_calls':
        return await this.checkApiRateLimit(event, params);
      case 'malicious_pattern':
        return await this.checkMaliciousPattern(event);
      default:
        return false;
    }
  }

  private async checkLoginFailurePattern(event: SecurityEvent, params: string[]): Promise<boolean> {
    if (event.type !== SecurityEventType.LOGIN_FAILURE) return false;

    const maxFailures = parseInt(params[0]);
    const timeWindow = parseInt(params[1]) * 1000; // Convert to milliseconds
    const now = Date.now();

    // Get recent login failures for this IP
    const recentFailures = await prisma.webhookEvent.count({
      where: {
        source: 'security-monitor',
        event: SecurityEventType.LOGIN_FAILURE,
        payload: {
          path: ['ipAddress'],
          equals: event.ipAddress,
        },
        createdAt: {
          gte: new Date(now - timeWindow),
        },
      },
    });

    return recentFailures >= maxFailures;
  }

  private async checkGeographicAnomaly(event: SecurityEvent): Promise<boolean> {
    if (!event.metadata.country || !event.metadata.previousCountries) return false;

    const currentCountry = event.metadata.country;
    const previousCountries = event.metadata.previousCountries as string[];

    // Check if user has logged in from this country before
    return !previousCountries.includes(currentCountry);
  }

  private async checkApiRateLimit(event: SecurityEvent, params: string[]): Promise<boolean> {
    const maxCalls = parseInt(params[0]);
    const timeWindow = parseInt(params[1]) * 1000; // Convert to milliseconds
    const now = Date.now();

    const key = `${event.userId || event.ipAddress}:api_calls`;
    const rateLimit = this.rateLimiters.get(key);

    if (!rateLimit || now > rateLimit.resetTime) {
      this.rateLimiters.set(key, { count: 1, resetTime: now + timeWindow });
      return false;
    }

    rateLimit.count++;
    return rateLimit.count > maxCalls;
  }

  private async checkMaliciousPattern(event: SecurityEvent): Promise<boolean> {
    const maliciousPatterns = [
      /script\s*>/i,
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /union\s+select/i,
      /drop\s+table/i,
      /delete\s+from/i,
      /insert\s+into/i,
      /update\s+set/i,
    ];

    const requestData = JSON.stringify(event.metadata);
    return maliciousPatterns.some(pattern => pattern.test(requestData));
  }

  private async executeRuleActions(event: SecurityEvent, rule: ThreatDetectionRule): Promise<void> {
    for (const action of rule.actions) {
      switch (action) {
        case SecurityAction.LOG:
          console.log(`Security event logged: ${event.type} - ${event.description}`);
          break;

        case SecurityAction.ALERT:
          await this.createSecurityAlert(event, rule);
          break;

        case SecurityAction.BLOCK:
          await this.blockSource(event);
          break;

        case SecurityAction.RATE_LIMIT:
          await this.applyRateLimit(event);
          break;

        case SecurityAction.NOTIFY_ADMIN:
          await this.notifyAdmin(event, rule);
          break;

        case SecurityAction.SUSPEND_USER:
          if (event.userId) {
            await this.suspendUser(event.userId);
          }
          break;

        case SecurityAction.REQUIRE_2FA:
          if (event.userId) {
            await this.require2FA(event.userId);
          }
          break;
      }
    }
  }

  private async createSecurityAlert(event: SecurityEvent, rule: ThreatDetectionRule): Promise<void> {
    const alert = await prisma.webhookEvent.create({
      data: {
        source: 'security-alert',
        event: 'security.alert.created',
        payload: {
          eventId: event.id,
          ruleId: rule.id,
          severity: event.severity,
          title: `Security Alert: ${rule.name}`,
          description: event.description,
          status: AlertStatus.ACTIVE,
          acknowledged: false,
          createdAt: new Date(),
        },
        orgId: event.orgId || 'security',
      },
    });

    // Send real-time notification
    await this.sendRealTimeAlert(alert.id, event, rule);
  }

  private async blockSource(event: SecurityEvent): Promise<void> {
    const blockData = {
      type: 'ip_block',
      source: event.ipAddress,
      reason: event.description,
      blockedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    await prisma.webhookEvent.create({
      data: {
        source: 'security-block',
        event: 'source.blocked',
        payload: blockData,
        orgId: event.orgId || 'security',
      },
    });
  }

  private async applyRateLimit(event: SecurityEvent): Promise<void> {
    const key = `${event.userId || event.ipAddress}:rate_limited`;
    this.rateLimiters.set(key, {
      count: 0,
      resetTime: Date.now() + 60 * 60 * 1000, // 1 hour
    });
  }

  private async notifyAdmin(event: SecurityEvent, rule: ThreatDetectionRule): Promise<void> {
    // Send notification to admin users
    console.log(`Admin notification: ${rule.name} - ${event.description}`);
    
    // In a real implementation, this would send emails, Slack messages, etc.
  }

  private async suspendUser(userId: string): Promise<void> {
    // Suspend user account
    console.log(`User ${userId} suspended due to security threat`);
    
    // In a real implementation, this would update the user's status in the database
  }

  private async require2FA(userId: string): Promise<void> {
    // Require 2FA for next login
    console.log(`2FA required for user ${userId}`);
    
    // In a real implementation, this would set a flag in the user's record
  }

  private async sendRealTimeAlert(alertId: string, event: SecurityEvent, rule: ThreatDetectionRule): Promise<void> {
    // Send real-time alert via WebSocket or similar
    console.log(`Real-time alert sent: ${alertId}`);
  }

  async getSecurityEvents(orgId: string, limit = 50, offset = 0): Promise<SecurityEvent[]> {
    const events = await prisma.webhookEvent.findMany({
      where: {
        source: 'security-monitor',
        orgId,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return events.map(event => ({
      id: event.id,
      type: event.event as SecurityEventType,
      severity: event.payload.severity || SecuritySeverity.LOW,
      source: event.payload.source || 'unknown',
      description: event.payload.description || '',
      metadata: event.payload.metadata || {},
      userId: event.payload.userId,
      orgId: event.orgId,
      ipAddress: event.payload.ipAddress,
      userAgent: event.payload.userAgent,
      timestamp: event.createdAt,
      resolved: event.payload.resolved || false,
      resolvedAt: event.payload.resolvedAt,
      resolvedBy: event.payload.resolvedBy,
    }));
  }

  async getSecurityStats(orgId: string, days = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totalEvents = await prisma.webhookEvent.count({
      where: {
        source: 'security-monitor',
        orgId,
        createdAt: { gte: startDate },
      },
    });

    const criticalEvents = await prisma.webhookEvent.count({
      where: {
        source: 'security-monitor',
        orgId,
        createdAt: { gte: startDate },
        payload: {
          path: ['severity'],
          equals: SecuritySeverity.CRITICAL,
        },
      },
    });

    const highEvents = await prisma.webhookEvent.count({
      where: {
        source: 'security-monitor',
        orgId,
        createdAt: { gte: startDate },
        payload: {
          path: ['severity'],
          equals: SecuritySeverity.HIGH,
        },
      },
    });

    const resolvedEvents = await prisma.webhookEvent.count({
      where: {
        source: 'security-monitor',
        orgId,
        createdAt: { gte: startDate },
        payload: {
          path: ['resolved'],
          equals: true,
        },
      },
    });

    return {
      totalEvents,
      criticalEvents,
      highEvents,
      resolvedEvents,
      unresolvedEvents: totalEvents - resolvedEvents,
      criticalRate: totalEvents > 0 ? (criticalEvents / totalEvents) * 100 : 0,
      resolutionRate: totalEvents > 0 ? (resolvedEvents / totalEvents) * 100 : 0,
    };
  }

  async addThreatRule(rule: Omit<ThreatDetectionRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ThreatDetectionRule> {
    const newRule: ThreatDetectionRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.threatRules.set(newRule.id, newRule);
    return newRule;
  }

  async updateThreatRule(id: string, updates: Partial<ThreatDetectionRule>): Promise<ThreatDetectionRule | null> {
    const rule = this.threatRules.get(id);
    if (!rule) return null;

    const updatedRule = {
      ...rule,
      ...updates,
      updatedAt: new Date(),
    };

    this.threatRules.set(id, updatedRule);
    return updatedRule;
  }

  async deleteThreatRule(id: string): Promise<boolean> {
    return this.threatRules.delete(id);
  }

  async getThreatRules(): Promise<ThreatDetectionRule[]> {
    return Array.from(this.threatRules.values());
  }

  async isSourceBlocked(ipAddress: string): Promise<boolean> {
    const blockEvent = await prisma.webhookEvent.findFirst({
      where: {
        source: 'security-block',
        event: 'source.blocked',
        payload: {
          path: ['source'],
          equals: ipAddress,
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Check last 24 hours
        },
      },
    });

    return !!blockEvent;
  }

  async isRateLimited(key: string): Promise<boolean> {
    const rateLimit = this.rateLimiters.get(key);
    if (!rateLimit) return false;

    return Date.now() < rateLimit.resetTime;
  }
}

export const securityMonitor = new SecurityMonitor();
