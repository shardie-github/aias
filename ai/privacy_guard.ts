/**
 * Privacy Guard System
 * Redacts PII before any prompt or telemetry export
 * Enforces privacy by design principles
 */

interface PIIPattern {
  name: string;
  pattern: RegExp;
  replacement: string;
  category: 'email' | 'phone' | 'ssn' | 'credit_card' | 'address' | 'name' | 'ip' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface RedactionResult {
  original: string;
  redacted: string;
  redactions: Array<{
    pattern: string;
    category: string;
    severity: string;
    position: { start: number; end: number };
  }>;
  pii_detected: boolean;
  confidence: number;
}

interface ComplianceReport {
  timestamp: string;
  total_checks: number;
  pii_detected: number;
  redactions_made: number;
  compliance_score: number;
  violations: Array<{
    type: string;
    severity: string;
    description: string;
  }>;
}

class PrivacyGuard {
  private piiPatterns: PIIPattern[];
  private complianceRules: Map<string, any>;

  constructor() {
    this.piiPatterns = this.initializePIIPatterns();
    this.complianceRules = this.initializeComplianceRules();
  }

  /**
   * Initialize PII detection patterns
   */
  private initializePIIPatterns(): PIIPattern[] {
    return [
      // Email addresses
      {
        name: 'email',
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        replacement: '[EMAIL_REDACTED]',
        category: 'email',
        severity: 'high'
      },
      
      // Phone numbers (US format)
      {
        name: 'phone_us',
        pattern: /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
        replacement: '[PHONE_REDACTED]',
        category: 'phone',
        severity: 'high'
      },
      
      // SSN (US format)
      {
        name: 'ssn',
        pattern: /\b(?!000|666|9\d{2})\d{3}[-.\s]?(?!00)\d{2}[-.\s]?(?!0000)\d{4}\b/g,
        replacement: '[SSN_REDACTED]',
        category: 'ssn',
        severity: 'critical'
      },
      
      // Credit card numbers
      {
        name: 'credit_card',
        pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
        replacement: '[CARD_REDACTED]',
        category: 'credit_card',
        severity: 'critical'
      },
      
      // IP addresses
      {
        name: 'ipv4',
        pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
        replacement: '[IP_REDACTED]',
        category: 'ip',
        severity: 'medium'
      },
      
      // IPv6 addresses
      {
        name: 'ipv6',
        pattern: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
        replacement: '[IP_REDACTED]',
        category: 'ip',
        severity: 'medium'
      },
      
      // Names (basic pattern)
      {
        name: 'name_basic',
        pattern: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
        replacement: '[NAME_REDACTED]',
        category: 'name',
        severity: 'medium'
      },
      
      // Addresses (basic pattern)
      {
        name: 'address',
        pattern: /\b\d+\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Circle|Cir|Court|Ct)\b/gi,
        replacement: '[ADDRESS_REDACTED]',
        category: 'address',
        severity: 'high'
      },
      
      // API keys and tokens
      {
        name: 'api_key',
        pattern: /\b(?:sk-|pk_|AKIA|AIza|ya29)[A-Za-z0-9_-]{20,}\b/g,
        replacement: '[API_KEY_REDACTED]',
        category: 'other',
        severity: 'critical'
      },
      
      // JWT tokens
      {
        name: 'jwt',
        pattern: /\beyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\b/g,
        replacement: '[JWT_REDACTED]',
        category: 'other',
        severity: 'high'
      },
      
      // Database connection strings
      {
        name: 'db_connection',
        pattern: /(?:mongodb|postgresql|mysql|redis):\/\/[^\s]+/gi,
        replacement: '[DB_CONNECTION_REDACTED]',
        category: 'other',
        severity: 'critical'
      }
    ];
  }

  /**
   * Initialize compliance rules
   */
  private initializeComplianceRules(): Map<string, any> {
    const rules = new Map();
    
    // GDPR rules
    rules.set('gdpr', {
      data_retention_days: 90,
      consent_required: true,
      right_to_erasure: true,
      data_portability: true,
      breach_notification_hours: 72
    });
    
    // CCPA rules
    rules.set('ccpa', {
      data_retention_days: 365,
      opt_out_required: true,
      disclosure_required: true,
      deletion_required: true
    });
    
    // HIPAA rules
    rules.set('hipaa', {
      encryption_required: true,
      access_controls: true,
      audit_logging: true,
      breach_notification_days: 60
    });
    
    return rules;
  }

  /**
   * Redact PII from text
   */
  redactPII(text: string): RedactionResult {
    let redactedText = text;
    const redactions: Array<{
      pattern: string;
      category: string;
      severity: string;
      position: { start: number; end: number };
    }> = [];

    // Apply each PII pattern
    this.piiPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern.pattern)];
      
      matches.forEach(match => {
        if (match.index !== undefined) {
          const start = match.index;
          const end = start + match[0].length;
          
          // Check if this position is already redacted
          const isAlreadyRedacted = redactions.some(r => 
            (start >= r.position.start && start < r.position.end) ||
            (end > r.position.start && end <= r.position.end)
          );
          
          if (!isAlreadyRedacted) {
            redactions.push({
              pattern: pattern.name,
              category: pattern.category,
              severity: pattern.severity,
              position: { start, end }
            });
          }
        }
      });
      
      // Apply replacement
      redactedText = redactedText.replace(pattern.pattern, pattern.replacement);
    });

    // Sort redactions by position
    redactions.sort((a, b) => a.position.start - b.position.start);

    return {
      original: text,
      redacted: redactedText,
      redactions,
      pii_detected: redactions.length > 0,
      confidence: this.calculateConfidence(redactions)
    };
  }

  /**
   * Calculate confidence score for PII detection
   */
  private calculateConfidence(redactions: Array<{ severity: string }>): number {
    if (redactions.length === 0) return 1.0;
    
    const severityWeights = {
      low: 0.3,
      medium: 0.6,
      high: 0.8,
      critical: 0.95
    };
    
    const totalWeight = redactions.reduce((sum, r) => sum + (severityWeights[r.severity] || 0.5), 0);
    return Math.min(1.0, totalWeight / redactions.length);
  }

  /**
   * Validate data for compliance
   */
  validateCompliance(data: any, regulations: string[] = ['gdpr']): ComplianceReport {
    const violations: Array<{
      type: string;
      severity: string;
      description: string;
    }> = [];
    
    let totalChecks = 0;
    let piiDetected = 0;
    let redactionsMade = 0;

    // Check each regulation
    regulations.forEach(regulation => {
      const rules = this.complianceRules.get(regulation);
      if (!rules) return;

      // Check data retention
      if (rules.data_retention_days) {
        totalChecks++;
        if (this.checkDataRetention(data, rules.data_retention_days)) {
          violations.push({
            type: 'data_retention',
            severity: 'medium',
            description: `Data older than ${rules.data_retention_days} days found`
          });
        }
      }

      // Check for PII
      const piiCheck = this.checkForPII(data);
      totalChecks++;
      if (piiCheck.detected) {
        piiDetected++;
        violations.push({
          type: 'pii_detection',
          severity: 'high',
          description: `PII detected: ${piiCheck.types.join(', ')}`
        });
      }

      // Check encryption requirements
      if (rules.encryption_required) {
        totalChecks++;
        if (!this.checkEncryption(data)) {
          violations.push({
            type: 'encryption',
            severity: 'critical',
            description: 'Sensitive data not encrypted'
          });
        }
      }
    });

    const complianceScore = totalChecks > 0 ? ((totalChecks - violations.length) / totalChecks) * 100 : 100;

    return {
      timestamp: new Date().toISOString(),
      total_checks: totalChecks,
      pii_detected: piiDetected,
      redactions_made: redactionsMade,
      compliance_score: complianceScore,
      violations
    };
  }

  /**
   * Check data retention compliance
   */
  private checkDataRetention(data: any, maxDays: number): boolean {
    const cutoffDate = new Date(Date.now() - maxDays * 24 * 60 * 60 * 1000);
    
    if (Array.isArray(data)) {
      return data.some(item => 
        item.created_at && new Date(item.created_at) < cutoffDate
      );
    }
    
    return data.created_at && new Date(data.created_at) < cutoffDate;
  }

  /**
   * Check for PII in data
   */
  private checkForPII(data: any): { detected: boolean; types: string[] } {
    const dataString = JSON.stringify(data);
    const types: string[] = [];
    
    this.piiPatterns.forEach(pattern => {
      if (pattern.pattern.test(dataString)) {
        types.push(pattern.category);
      }
    });
    
    return {
      detected: types.length > 0,
      types: [...new Set(types)]
    };
  }

  /**
   * Check encryption compliance
   */
  private checkEncryption(data: any): boolean {
    // Simple check for encrypted fields
    const encryptedFields = ['encrypted_data', 'cipher_text', 'hash'];
    const dataString = JSON.stringify(data).toLowerCase();
    
    return encryptedFields.some(field => dataString.includes(field));
  }

  /**
   * Sanitize data for AI processing
   */
  sanitizeForAI(data: any): any {
    if (typeof data === 'string') {
      return this.redactPII(data).redacted;
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeForAI(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        // Skip sensitive keys
        if (this.isSensitiveKey(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeForAI(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  /**
   * Check if a key is sensitive
   */
  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = [
      'password', 'passwd', 'pwd', 'secret', 'token', 'key', 'auth',
      'ssn', 'social', 'credit', 'card', 'cvv', 'cvc', 'pin',
      'email', 'phone', 'address', 'name', 'dob', 'birth'
    ];
    
    return sensitiveKeys.some(sensitive => 
      key.toLowerCase().includes(sensitive)
    );
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(): Promise<ComplianceReport> {
    // This would typically scan the entire database
    // For now, return a sample report
    return {
      timestamp: new Date().toISOString(),
      total_checks: 10,
      pii_detected: 0,
      redactions_made: 0,
      compliance_score: 100,
      violations: []
    };
  }

  /**
   * Audit data flows
   */
  auditDataFlows(): Array<{
    source: string;
    destination: string;
    data_type: string;
    pii_included: boolean;
    compliance_status: string;
  }> {
    return [
      {
        source: 'user_input',
        destination: 'ai_processing',
        data_type: 'text',
        pii_included: false,
        compliance_status: 'compliant'
      },
      {
        source: 'database',
        destination: 'analytics',
        data_type: 'metrics',
        pii_included: false,
        compliance_status: 'compliant'
      },
      {
        source: 'api_logs',
        destination: 'monitoring',
        data_type: 'logs',
        pii_included: true,
        compliance_status: 'needs_review'
      }
    ];
  }
}

// Export for use in other modules
export { PrivacyGuard, type PIIPattern, type RedactionResult, type ComplianceReport };

// CLI execution
if (require.main === module) {
  const guard = new PrivacyGuard();
  
  // Test with sample data
  const testData = {
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      ssn: '123-45-6789'
    },
    message: 'Please process this data for AI analysis'
  };
  
  console.log('Original data:', JSON.stringify(testData, null, 2));
  
  const sanitized = guard.sanitizeForAI(testData);
  console.log('Sanitized data:', JSON.stringify(sanitized, null, 2));
  
  const compliance = guard.validateCompliance(testData);
  console.log('Compliance report:', compliance);
}