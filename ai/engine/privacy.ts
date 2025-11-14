/**
 * Privacy Layer - PII Tokenization & Sanitization
 * Tokenize all PII before model exposure
 */

import { TokenizedData } from './types';

export class PrivacyGuard {
  private static piiPatterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\(\d{3}\)\s?\d{3}[-.]?\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    ip: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    userId: /\b(user|usr|id|userId|user_id)[:=]\s*['"]?([a-zA-Z0-9_-]+)['"]?/gi,
  };

  private static tokenMap = new Map<string, string>();
  private static reverseMap = new Map<string, string>();
  private static tokenCounter = 0;

  /**
   * Tokenize PII in data
   */
  static tokenize(data: any): TokenizedData {
    const piiFields: string[] = [];
    const tokenized = this.tokenizeRecursive(data, piiFields);

    return {
      original: data,
      tokenized,
      piiFields: [...new Set(piiFields)],
      anonymized: piiFields.length > 0,
    };
  }

  /**
   * Recursively tokenize PII in nested objects
   */
  private static tokenizeRecursive(obj: any, piiFields: string[]): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.tokenizeString(obj, piiFields);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.tokenizeRecursive(item, piiFields));
    }

    if (typeof obj === 'object') {
      const tokenized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        
        // Check if key suggests PII
        if (this.isPIIKey(lowerKey)) {
          piiFields.push(key);
          tokenized[key] = this.generateToken(value);
        } else {
          tokenized[key] = this.tokenizeRecursive(value, piiFields);
        }
      }
      return tokenized;
    }

    return obj;
  }

  /**
   * Tokenize string content
   */
  private static tokenizeString(str: string, piiFields: string[]): string {
    let tokenized = str;

    for (const [type, pattern] of Object.entries(this.piiPatterns)) {
      const matches = str.match(pattern);
      if (matches) {
        piiFields.push(type);
        for (const match of matches) {
          const token = this.generateToken(match);
          tokenized = tokenized.replace(match, token);
        }
      }
    }

    return tokenized;
  }

  /**
   * Check if key suggests PII
   */
  private static isPIIKey(key: string): boolean {
    const piiKeywords = [
      'email', 'phone', 'ssn', 'social', 'credit', 'card', 'password',
      'passwd', 'secret', 'token', 'api_key', 'apikey', 'auth', 'user_id',
      'userid', 'ip', 'address', 'zip', 'postal', 'name', 'firstname',
      'lastname', 'dob', 'birth', 'driver', 'license',
    ];

    return piiKeywords.some(keyword => key.includes(keyword));
  }

  /**
   * Generate token for PII value
   */
  private static generateToken(value: any): string {
    const strValue = String(value);
    
    // Check if already tokenized
    if (this.tokenMap.has(strValue)) {
      return this.tokenMap.get(strValue)!;
    }

    // Generate new token
    const token = `[TOKEN_${++this.tokenCounter}]`;
    this.tokenMap.set(strValue, token);
    this.reverseMap.set(token, strValue);
    
    return token;
  }

  /**
   * Detokenize (reverse tokenization)
   */
  static detokenize(tokenized: any): any {
    if (tokenized === null || tokenized === undefined) {
      return tokenized;
    }

    if (typeof tokenized === 'string') {
      return this.detokenizeString(tokenized);
    }

    if (Array.isArray(tokenized)) {
      return tokenized.map(item => this.detokenize(item));
    }

    if (typeof tokenized === 'object') {
      const detokenized: any = {};
      for (const [key, value] of Object.entries(tokenized)) {
        detokenized[key] = this.detokenize(value);
      }
      return detokenized;
    }

    return tokenized;
  }

  /**
   * Detokenize string
   */
  private static detokenizeString(str: string): string {
    let detokenized = str;
    
    for (const [token, original] of this.reverseMap.entries()) {
      detokenized = detokenized.replace(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), original);
    }

    return detokenized;
  }

  /**
   * Sanitize for telemetry (minimal, no PII)
   */
  static sanitizeForTelemetry(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      
      // Skip PII fields entirely
      if (this.isPIIKey(lowerKey)) {
        continue;
      }

      // Sanitize nested objects
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeForTelemetry(value);
      } else if (typeof value === 'string') {
        // Remove any PII from strings
        sanitized[key] = this.tokenizeString(value, []);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Clear token maps (for testing/cleanup)
   */
  static clearTokens(): void {
    this.tokenMap.clear();
    this.reverseMap.clear();
    this.tokenCounter = 0;
  }
}
