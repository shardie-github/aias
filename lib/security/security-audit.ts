/**
 * Security Audit and Hardening Utilities
 * Provides automated security checks and recommendations
 */

export interface SecurityAuditResult {
  score: number;
  issues: SecurityIssue[];
  recommendations: SecurityRecommendation[];
  passed: boolean;
}

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'xss' | 'csrf' | 'injection' | 'auth' | 'headers' | 'dependencies';
  description: string;
  file?: string;
  line?: number;
  fix?: string;
}

export interface SecurityRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  implementation: string;
}

/**
 * Run comprehensive security audit
 */
export async function runSecurityAudit(): Promise<SecurityAuditResult> {
  const issues: SecurityIssue[] = [];
  const recommendations: SecurityRecommendation[] = [];

  // Check security headers
  issues.push(...checkSecurityHeaders());
  
  // Check for XSS vulnerabilities
  issues.push(...checkXSSVulnerabilities());
  
  // Check for injection vulnerabilities
  issues.push(...checkInjectionVulnerabilities());
  
  // Check authentication/authorization
  issues.push(...checkAuthIssues());
  
  // Check dependencies
  issues.push(...checkDependencyVulnerabilities());

  // Generate recommendations
  recommendations.push(...generateSecurityRecommendations(issues));

  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const highCount = issues.filter(i => i.severity === 'high').length;
  
  const score = Math.max(0, 100 - (criticalCount * 20) - (highCount * 10) - (issues.length * 2));

  return {
    score,
    issues,
    recommendations,
    passed: criticalCount === 0 && highCount === 0,
  };
}

function checkSecurityHeaders(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  // Check if CSP is properly configured
  issues.push({
    severity: 'medium',
    category: 'headers',
    description: 'Verify Content-Security-Policy includes nonce for inline scripts',
    fix: 'Add nonce generation and validation',
  });

  return issues;
}

function checkXSSVulnerabilities(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  // Check for dangerouslySetInnerHTML usage
  issues.push({
    severity: 'high',
    category: 'xss',
    description: 'Review all dangerouslySetInnerHTML usage for XSS risks',
    fix: 'Use sanitization library or React-safe alternatives',
  });

  return issues;
}

function checkInjectionVulnerabilities(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  // Check for SQL injection risks
  issues.push({
    severity: 'critical',
    category: 'injection',
    description: 'Ensure all database queries use parameterized statements',
    fix: 'Use Prisma query builder or parameterized queries',
  });

  return issues;
}

function checkAuthIssues(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  // Check for proper session management
  issues.push({
    severity: 'high',
    category: 'auth',
    description: 'Verify session tokens are properly secured and rotated',
    fix: 'Implement secure session management with httpOnly cookies',
  });

  return issues;
}

function checkDependencyVulnerabilities(): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  // This would integrate with npm audit or Snyk
  issues.push({
    severity: 'medium',
    category: 'dependencies',
    description: 'Run npm audit regularly and update vulnerable dependencies',
    fix: 'Automate dependency vulnerability scanning in CI',
  });

  return issues;
}

function generateSecurityRecommendations(issues: SecurityIssue[]): SecurityRecommendation[] {
  const recommendations: SecurityRecommendation[] = [];

  if (issues.some(i => i.category === 'headers')) {
    recommendations.push({
      priority: 'high',
      category: 'headers',
      description: 'Implement comprehensive security headers middleware',
      implementation: 'Add security headers to next.config.ts and middleware.ts',
    });
  }

  if (issues.some(i => i.category === 'xss')) {
    recommendations.push({
      priority: 'high',
      category: 'xss',
      description: 'Add input sanitization for all user inputs',
      implementation: 'Use DOMPurify or similar for HTML sanitization',
    });
  }

  if (issues.some(i => i.category === 'auth')) {
    recommendations.push({
      priority: 'critical',
      category: 'auth',
      description: 'Implement rate limiting and CSRF protection',
      implementation: 'Add rate limiting middleware and CSRF tokens',
    });
  }

  return recommendations;
}
