/**
 * Security Headers Middleware
 * Implements comprehensive security headers for the AIAS platform
 */

export interface SecurityHeadersConfig {
  cspReportUri?: string;
  hstsMaxAge?: number;
  frameOptions?: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
  contentTypeOptions?: boolean;
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  permissionsPolicy?: Record<string, string[]>;
  dnsPrefetchControl?: boolean;
}

export class SecurityHeaders {
  private config: Required<SecurityHeadersConfig>;

  constructor(config: SecurityHeadersConfig = {}) {
    this.config = {
      cspReportUri: config.cspReportUri || '/csp-report',
      hstsMaxAge: config.hstsMaxAge || 31536000, // 1 year
      frameOptions: config.frameOptions || 'SAMEORIGIN',
      contentTypeOptions: config.contentTypeOptions ?? true,
      referrerPolicy: config.referrerPolicy || 'strict-origin-when-cross-origin',
      permissionsPolicy: config.permissionsPolicy || this.getDefaultPermissionsPolicy(),
      dnsPrefetchControl: config.dnsPrefetchControl ?? true,
    };
  }

  /**
   * Generate Content Security Policy header
   */
  private generateCSP(nonce?: string): string {
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.google-analytics.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://vitals.vercel-insights.com wss:",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ];

    if (nonce) {
      directives[1] = `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://js.stripe.com https://www.google-analytics.com https://www.googletagmanager.com`;
    }

    if (this.config.cspReportUri) {
      directives.push(`report-uri ${this.config.cspReportUri}`);
    }

    return directives.join('; ');
  }

  /**
   * Generate Permissions Policy header
   */
  private getDefaultPermissionsPolicy(): Record<string, string[]> {
    return {
      'camera': [],
      'microphone': [],
      'geolocation': [],
      'interest-cohort': [], // FLoC
      'payment': ['self'],
      'usb': [],
      'magnetometer': [],
      'gyroscope': [],
      'accelerometer': [],
      'ambient-light-sensor': [],
      'autoplay': ['self'],
      'battery': [],
      'bluetooth': [],
      'clipboard-read': [],
      'clipboard-write': [],
      'display-capture': [],
      'document-domain': [],
      'encrypted-media': ['self'],
      'fullscreen': ['self'],
      'gamepad': [],
      'midi': [],
      'notifications': [],
      'persistent-storage': [],
      'picture-in-picture': [],
      'publickey-credentials-get': [],
      'screen-wake-lock': [],
      'sync-xhr': [],
      'web-share': [],
      'xr-spatial-tracking': [],
    };
  }

  /**
   * Generate all security headers
   */
  getHeaders(nonce?: string): Record<string, string> {
    const headers: Record<string, string> = {};

    // Content Security Policy
    headers['Content-Security-Policy'] = this.generateCSP(nonce);

    // HTTP Strict Transport Security
    headers['Strict-Transport-Security'] = `max-age=${this.config.hstsMaxAge}; includeSubDomains; preload`;

    // X-Frame-Options
    headers['X-Frame-Options'] = this.config.frameOptions;

    // X-Content-Type-Options
    if (this.config.contentTypeOptions) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    // Referrer Policy
    headers['Referrer-Policy'] = this.config.referrerPolicy;

    // Permissions Policy
    const permissionsPolicy = Object.entries(this.config.permissionsPolicy)
      .map(([feature, allowlist]) => `${feature}=(${allowlist.join(' ')})`)
      .join(', ');
    headers['Permissions-Policy'] = permissionsPolicy;

    // X-DNS-Prefetch-Control
    if (this.config.dnsPrefetchControl) {
      headers['X-DNS-Prefetch-Control'] = 'off';
    }

    // Additional security headers
    headers['X-XSS-Protection'] = '1; mode=block';
    headers['X-Permitted-Cross-Domain-Policies'] = 'none';
    headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
    headers['Cross-Origin-Opener-Policy'] = 'same-origin';
    headers['Cross-Origin-Resource-Policy'] = 'same-origin';

    return headers;
  }

  /**
   * Generate nonce for CSP
   */
  generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate CSP report
   */
  validateCSPReport(report: any): boolean {
    try {
      // Basic validation of CSP report structure
      return (
        report &&
        typeof report === 'object' &&
        report['csp-report'] &&
        typeof report['csp-report'] === 'object'
      );
    } catch {
      return false;
    }
  }

  /**
   * Get security headers for development
   */
  getDevelopmentHeaders(): Record<string, string> {
    const headers = this.getHeaders();
    
    // Relax CSP for development
    headers['Content-Security-Policy'] = headers['Content-Security-Policy']
      .replace("'unsafe-inline'", "'unsafe-inline' 'unsafe-eval'")
      .replace('frame-ancestors \'none\'', 'frame-ancestors \'self\'');
    
    return headers;
  }

  /**
   * Get security headers for production
   */
  getProductionHeaders(nonce?: string): Record<string, string> {
    return this.getHeaders(nonce);
  }
}

// Default instance
export const securityHeaders = new SecurityHeaders();

// Utility functions
export const applySecurityHeaders = (headers: Headers, nonce?: string): void => {
  const securityHeadersObj = securityHeaders.getProductionHeaders(nonce);
  Object.entries(securityHeadersObj).forEach(([key, value]) => {
    headers.set(key, value);
  });
};

export const generateNonce = (): string => {
  return securityHeaders.generateNonce();
};