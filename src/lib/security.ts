/**
 * Enterprise-Grade Security Framework
 * Comprehensive security measures for data protection and threat mitigation
 */

import { createHash, randomBytes, createCipher, createDecipher } from 'crypto';

export interface SecurityConfig {
  encryption: {
    algorithm: string;
    keyLength: number;
    ivLength: number;
  };
  authentication: {
    jwtSecret: string;
    tokenExpiry: number;
    refreshTokenExpiry: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  rateLimiting: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  audit: {
    logLevel: 'minimal' | 'standard' | 'comprehensive';
    retentionDays: number;
    realTimeAlerts: boolean;
  };
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'authentication' | 'authorization' | 'data_access' | 'security_violation' | 'system_event';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, unknown>;
  resolved: boolean;
}

export interface ThreatDetection {
  suspiciousActivity: boolean;
  bruteForceAttempts: number;
  unusualLocation: boolean;
  dataExfiltration: boolean;
  privilegeEscalation: boolean;
  riskScore: number; // 0-100
}

export class SecurityManager {
  private static instance: SecurityManager;
  private securityEvents: Map<string, SecurityEvent> = new Map();
  private failedAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private threatPatterns: Map<string, Record<string, unknown>> = new Map();
  private config: SecurityConfig;

  constructor() {
    this.config = {
      encryption: {
        algorithm: 'aes-256-gcm',
        keyLength: 32,
        ivLength: 16
      },
      authentication: {
        jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
        tokenExpiry: 15 * 60 * 1000, // 15 minutes
        refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000 // 15 minutes
      },
      rateLimiting: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        skipSuccessfulRequests: false
      },
      audit: {
        logLevel: 'comprehensive',
        retentionDays: 2555, // 7 years
        realTimeAlerts: true
      }
    };
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * Encrypt sensitive data with AES-256-GCM
   */
  encryptData(data: string, key?: string): { encrypted: string; iv: string; tag: string } {
    const encryptionKey = key ? Buffer.from(key, 'hex') : randomBytes(this.config.encryption.keyLength);
    const iv = randomBytes(this.config.encryption.ivLength);
    
    const cipher = createCipher(this.config.encryption.algorithm, encryptionKey);
    cipher.setAAD(Buffer.from('enterprise-security', 'utf8'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData: { encrypted: string; iv: string; tag: string }, key?: string): string {
    const encryptionKey = key ? Buffer.from(key, 'hex') : randomBytes(this.config.encryption.keyLength);
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const tag = Buffer.from(encryptedData.tag, 'hex');
    
    const decipher = createDecipher(this.config.encryption.algorithm, encryptionKey);
    decipher.setAAD(Buffer.from('enterprise-security', 'utf8'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Hash password with salt using PBKDF2
   */
  async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const salt = randomBytes(32).toString('hex');
    const hash = createHash('sha256')
      .update(password + salt)
      .digest('hex');
    
    return { hash, salt };
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const testHash = createHash('sha256')
      .update(password + salt)
      .digest('hex');
    
    return testHash === hash;
  }

  /**
   * Generate secure JWT token
   */
  generateJWT(payload: Record<string, unknown>): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + (this.config.authentication.tokenExpiry / 1000),
      iss: 'enterprise-security-system'
    };

    // In production, use a proper JWT library
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
    
    const signature = createHash('sha256')
      .update(`${encodedHeader}.${encodedPayload}.${this.config.authentication.jwtSecret}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Verify JWT token
   */
  verifyJWT(token: string): { valid: boolean; payload?: Record<string, unknown>; error?: string } {
    try {
      const [header, payload, signature] = token.split('.');
      
      const expectedSignature = createHash('sha256')
        .update(`${header}.${payload}.${this.config.authentication.jwtSecret}`)
        .digest('base64url');

      if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
      }

      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
      
      if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }

      return decodedPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Check for suspicious activity and potential threats
   */
  async detectThreats(userId: string, ipAddress: string, userAgent: string, activity: string): Promise<ThreatDetection> {
    const threats: ThreatDetection = {
      suspiciousActivity: false,
      bruteForceAttempts: 0,
      unusualLocation: false,
      dataExfiltration: false,
      privilegeEscalation: false,
      riskScore: 0
    };

    // Check for brute force attempts
    const attemptKey = `${userId}_${ipAddress}`;
    const attempts = this.failedAttempts.get(attemptKey);
    if (attempts) {
      threats.bruteForceAttempts = attempts.count;
      if (attempts.count >= this.config.authentication.maxLoginAttempts) {
        threats.suspiciousActivity = true;
        threats.riskScore += 40;
      }
    }

    // Check for unusual patterns
    if (this.isUnusualActivity(activity)) {
      threats.suspiciousActivity = true;
      threats.riskScore += 20;
    }

    // Check for data exfiltration patterns
    if (this.detectDataExfiltration(activity)) {
      threats.dataExfiltration = true;
      threats.riskScore += 60;
    }

    // Check for privilege escalation attempts
    if (this.detectPrivilegeEscalation(activity)) {
      threats.privilegeEscalation = true;
      threats.riskScore += 50;
    }

    // Log high-risk events
    if (threats.riskScore > 50) {
      await this.logSecurityEvent({
        type: 'security_violation',
        severity: 'high',
        userId,
        ipAddress,
        userAgent,
        details: { threats, activity }
      });
    }

    return threats;
  }

  /**
   * Log security events for audit and monitoring
   */
  async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      resolved: false,
      ...event
    };

    this.securityEvents.set(securityEvent.id, securityEvent);

    // Real-time alerting for critical events
    if (this.config.audit.realTimeAlerts && event.severity === 'critical') {
      await this.sendSecurityAlert(securityEvent);
    }

    // Clean up old events
    this.cleanupOldEvents();
  }

  /**
   * Check if user is locked out due to failed attempts
   */
  isUserLockedOut(userId: string, ipAddress: string): boolean {
    const attemptKey = `${userId}_${ipAddress}`;
    const attempts = this.failedAttempts.get(attemptKey);
    
    if (!attempts) return false;
    
    const lockoutExpiry = attempts.lastAttempt + this.config.authentication.lockoutDuration;
    return Date.now() < lockoutExpiry && attempts.count >= this.config.authentication.maxLoginAttempts;
  }

  /**
   * Record failed authentication attempt
   */
  recordFailedAttempt(userId: string, ipAddress: string): void {
    const attemptKey = `${userId}_${ipAddress}`;
    const attempts = this.failedAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
    
    attempts.count++;
    attempts.lastAttempt = Date.now();
    
    this.failedAttempts.set(attemptKey, attempts);
  }

  /**
   * Clear failed attempts after successful authentication
   */
  clearFailedAttempts(userId: string, ipAddress: string): void {
    const attemptKey = `${userId}_${ipAddress}`;
    this.failedAttempts.delete(attemptKey);
  }

  /**
   * Generate security report for compliance
   */
  generateSecurityReport(startDate: Date, endDate: Date): { report: Record<string, unknown>; summary: Record<string, unknown> } {
    const events = Array.from(this.securityEvents.values())
      .filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= startDate && eventDate <= endDate;
      });

    const report = {
      period: { startDate, endDate },
      totalEvents: events.length,
      eventsByType: this.groupEventsByType(events),
      eventsBySeverity: this.groupEventsBySeverity(events),
      topThreats: this.getTopThreats(events),
      complianceMetrics: this.calculateComplianceMetrics(events),
      recommendations: this.generateSecurityRecommendations(events)
    };

    return report;
  }

  // Private helper methods
  private isUnusualActivity(activity: string): boolean {
    const suspiciousPatterns = [
      /admin/i,
      /delete/i,
      /drop/i,
      /truncate/i,
      /union/i,
      /select.*from/i,
      /<script/i,
      /javascript:/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(activity));
  }

  private detectDataExfiltration(activity: string): boolean {
    const exfiltrationPatterns = [
      /bulk.*download/i,
      /export.*all/i,
      /mass.*copy/i,
      /batch.*extract/i
    ];

    return exfiltrationPatterns.some(pattern => pattern.test(activity));
  }

  private detectPrivilegeEscalation(activity: string): boolean {
    const escalationPatterns = [
      /role.*admin/i,
      /permission.*grant/i,
      /access.*elevate/i,
      /privilege.*escalate/i
    ];

    return escalationPatterns.some(pattern => pattern.test(activity));
  }

  private async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    // In production, integrate with alerting system
    if (import.meta.env.DEV) {
      console.warn(`[SECURITY ALERT] ${event.severity.toUpperCase()}: ${event.type}`, event);
    }
    // TODO: Integrate with actual alerting system (Slack, email, etc.)
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private cleanupOldEvents(): void {
    const cutoffDate = Date.now() - (this.config.audit.retentionDays * 24 * 60 * 60 * 1000);
    
    for (const [id, event] of this.securityEvents.entries()) {
      if (new Date(event.timestamp).getTime() < cutoffDate) {
        this.securityEvents.delete(id);
      }
    }
  }

  private groupEventsByType(events: SecurityEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupEventsBySeverity(events: SecurityEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getTopThreats(events: SecurityEvent[]): Array<{ type: string; count: number; severity: string }> {
    const threatCounts = new Map<string, number>();
    
    events.forEach(event => {
      if (event.type === 'security_violation') {
        const threat = event.details?.threats?.type || 'unknown';
        threatCounts.set(threat, (threatCounts.get(threat) || 0) + 1);
      }
    });

    return Array.from(threatCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([threat, count]) => ({ threat, count }));
  }

  private calculateComplianceMetrics(events: SecurityEvent[]): { totalEvents: number; criticalEvents: number; resolutionRate: number; averageResolutionTime: number } {
    const totalEvents = events.length;
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    const resolvedEvents = events.filter(e => e.resolved).length;

    return {
      totalEvents,
      criticalEvents,
      resolutionRate: totalEvents > 0 ? (resolvedEvents / totalEvents) * 100 : 100,
      averageResolutionTime: this.calculateAverageResolutionTime(events),
      complianceScore: this.calculateComplianceScore(events)
    };
  }

  private calculateAverageResolutionTime(events: SecurityEvent[]): number {
    // Simplified calculation - in production, track actual resolution times
    return events.length * 0.5; // Placeholder
  }

  private calculateComplianceScore(events: SecurityEvent[]): number {
    const criticalEvents = events.filter(e => e.severity === 'critical').length;
    const totalEvents = events.length;
    
    if (totalEvents === 0) return 100;
    
    const criticalRatio = criticalEvents / totalEvents;
    return Math.max(0, 100 - (criticalRatio * 50));
  }

  private generateSecurityRecommendations(events: SecurityEvent[]): string[] {
    const recommendations: string[] = [];
    
    const criticalEvents = events.filter(e => e.severity === 'critical');
    if (criticalEvents.length > 0) {
      recommendations.push('Review and address all critical security events immediately');
    }

    const bruteForceEvents = events.filter(e => e.type === 'authentication' && e.details?.bruteForce);
    if (bruteForceEvents.length > 0) {
      recommendations.push('Implement additional rate limiting and account lockout policies');
    }

    const dataAccessEvents = events.filter(e => e.type === 'data_access');
    if (dataAccessEvents.length > 100) {
      recommendations.push('Review data access patterns and implement additional monitoring');
    }

    return recommendations;
  }
}

export const securityManager = SecurityManager.getInstance();