/**
 * API Security Utilities
 * Input validation, output sanitization, and security checks
 */

import { z } from 'zod';
// Note: isomorphic-dompurify needs to be installed: npm install isomorphic-dompurify
// For now, using a simple sanitization approach

/**
 * Common validation schemas
 */
export const validationSchemas = {
  uuid: z.string().uuid(),
  email: z.string().email(),
  url: z.string().url(),
  tenantId: z.string().uuid(),
  userId: z.string().uuid(),
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
  }),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
};

/**
 * Sanitize string input
 */
export function sanitizeInput(input: string): string {
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
}

/**
 * Sanitize HTML content
 */
export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '');
  
  // Allow only safe tags
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  sanitized = sanitized.replace(tagPattern, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      // Only allow href attribute on anchor tags
      if (tag.toLowerCase() === 'a') {
        return match.replace(/href\s*=\s*["']([^"']*)["']/gi, (hrefMatch, url) => {
          if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
            return hrefMatch;
          }
          return '';
        });
      }
      return match;
    }
    return '';
  });
  
  return sanitized;
}

/**
 * Validate and sanitize input
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.safeParse(input);
    
    if (result.success) {
      return { success: true, data: result.data };
    }
    
    return {
      success: false,
      error: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    };
  }
}

/**
 * Check for SQL injection patterns
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\b(UNION|JOIN)\b)/i,
    /('|"|;|--)/,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for XSS patterns
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate request body
 */
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): T {
  const result = validateInput(schema, body);
  
  if (!result.success) {
    throw new Error(`Invalid request body: ${result.error}`);
  }
  
  return result.data;
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeInput(obj) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as T;
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {} as T;
    for (const [key, value] of Object.entries(obj)) {
      (sanitized as any)[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Check request size limits
 */
export function checkRequestSize(body: string | object, maxSize: number = 1024 * 1024): boolean {
  const size = typeof body === 'string' 
    ? Buffer.byteLength(body, 'utf8')
    : Buffer.byteLength(JSON.stringify(body), 'utf8');
  
  return size <= maxSize;
}

/**
 * Rate limit key generator
 */
export function generateRateLimitKey(
  identifier: string,
  endpoint: string,
  tenantId?: string
): string {
  const parts = ['rate_limit', endpoint, identifier];
  if (tenantId) {
    parts.push(tenantId);
  }
  return parts.join(':');
}

/**
 * Security headers for API responses
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/**
 * Validate API key format
 */
export function validateAPIKey(apiKey: string): boolean {
  // API keys should be UUIDs or base64-encoded strings
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const base64Pattern = /^[A-Za-z0-9+/]{32,}={0,2}$/;
  
  return uuidPattern.test(apiKey) || base64Pattern.test(apiKey);
}

/**
 * Mask sensitive data in logs
 */
export function maskSensitiveData(data: string): string {
  return data
    .replace(/(password|pwd|secret|token|api[_-]?key|auth[_-]?token)=[^&\s]+/gi, '$1=***')
    .replace(/(\d{4}[-\s]?){3}\d{4}/g, '****-****-****-****') // Credit card
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****'); // SSN
}
