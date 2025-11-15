#!/usr/bin/env tsx
/**
 * Full-Stack Guardian Audit Script
 * 
 * Comprehensive audit across all five domains:
 * 1. Environment & Secret Drift Elimination
 * 2. Supabase Schema & Migration Sentinel
 * 3. Vercel Deployment Forensics
 * 4. Repo Integrity & Code Health
 * 5. AI-Agent Mesh Orchestrator
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

interface AuditResult {
  domain: string;
  status: 'healthy' | 'warning' | 'critical';
  issues: Issue[];
  recommendations: string[];
}

interface Issue {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  file?: string;
  line?: number;
  fix?: string;
}

const REPORTS_DIR = join(process.cwd(), 'reports', 'guardian');
const ENV_EXAMPLE = join(process.cwd(), '.env.example');
const VERCEL_JSON = join(process.cwd(), 'vercel.json');
const NEXT_CONFIG = join(process.cwd(), 'next.config.ts');
const SUPABASE_MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');
const PRISMA_SCHEMA = join(process.cwd(), 'apps', 'web', 'prisma', 'schema.prisma');

// Ensure reports directory exists
try {
  require('fs').mkdirSync(REPORTS_DIR, { recursive: true });
} catch {}

/**
 * 1. ENVIRONMENT & SECRET DRIFT AUDIT
 */
async function auditEnvironment(): Promise<AuditResult> {
  const issues: Issue[] = [];
  const recommendations: string[] = [];

  // Read .env.example
  let envExample: string = '';
  if (existsSync(ENV_EXAMPLE)) {
    envExample = readFileSync(ENV_EXAMPLE, 'utf-8');
  } else {
    issues.push({
      severity: 'critical',
      message: '.env.example file missing',
      fix: 'Create .env.example with all required environment variables',
    });
  }

  // Extract env vars from .env.example
  const envVars = new Set<string>();
  const envLines = envExample.split('\n');
  envLines.forEach((line) => {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match) {
      envVars.add(match[1]);
    }
  });

  // Check for required Supabase vars
  const requiredSupabaseVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DATABASE_URL',
  ];

  requiredSupabaseVars.forEach((varName) => {
    if (!envVars.has(varName) && !envVars.has(varName.replace('NEXT_PUBLIC_', ''))) {
      issues.push({
        severity: 'critical',
        message: `Missing required env var in .env.example: ${varName}`,
        fix: `Add ${varName} to .env.example`,
      });
    }
  });

  // Check for Vercel-specific vars
  const vercelVars = ['VERCEL_TOKEN', 'VERCEL_PROJECT_ID'];
  vercelVars.forEach((varName) => {
    if (!envVars.has(varName)) {
      issues.push({
        severity: 'warning',
        message: `Missing optional Vercel var: ${varName}`,
        fix: `Add ${varName} to .env.example if using Vercel CLI`,
      });
    }
  });

  // Check for integration vars (TikTok, Meta, etc.)
  const integrationVars = [
    'TIKTOK_ACCESS_TOKEN',
    'TIKTOK_ADVERTISER_ID',
    'META_ACCESS_TOKEN',
    'META_AD_ACCOUNT_ID',
    'ELEVENLABS_API_KEY',
    'ZAPIER_SECRET',
  ];

  const missingIntegrationVars = integrationVars.filter((v) => !envVars.has(v));
  if (missingIntegrationVars.length > 0) {
    issues.push({
      severity: 'info',
      message: `Optional integration vars not documented: ${missingIntegrationVars.join(', ')}`,
      fix: 'Add these to .env.example if using these integrations',
    });
  }

  // Check for inconsistent naming
  if (envVars.has('SUPABASE_URL') && envVars.has('NEXT_PUBLIC_SUPABASE_URL')) {
    recommendations.push(
      'Ensure SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL have the same value'
    );
  }

  return {
    domain: 'Environment & Secret Drift',
    status: issues.some((i) => i.severity === 'critical') ? 'critical' : 
            issues.some((i) => i.severity === 'warning') ? 'warning' : 'healthy',
    issues,
    recommendations,
  };
}

/**
 * 2. SUPABASE SCHEMA AUDIT
 */
async function auditSchema(): Promise<AuditResult> {
  const issues: Issue[] = [];
  const recommendations: string[] = [];

  // Check migrations directory exists
  if (!existsSync(SUPABASE_MIGRATIONS_DIR)) {
    issues.push({
      severity: 'critical',
      message: 'Supabase migrations directory missing',
      fix: 'Create supabase/migrations directory',
    });
    return {
      domain: 'Supabase Schema',
      status: 'critical',
      issues,
      recommendations,
    };
  }

  // List migration files
  const migrationFiles = readdirSync(SUPABASE_MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    issues.push({
      severity: 'warning',
      message: 'No migration files found',
      fix: 'Create initial migration file',
    });
  }

  // Check for Prisma schema
  if (!existsSync(PRISMA_SCHEMA)) {
    issues.push({
      severity: 'warning',
      message: 'Prisma schema file missing',
      fix: 'Create apps/web/prisma/schema.prisma',
    });
  } else {
    // Read Prisma schema and check for common issues
    const prismaSchema = readFileSync(PRISMA_SCHEMA, 'utf-8');
    
    // Check for DATABASE_URL usage
    if (!prismaSchema.includes('env("DATABASE_URL")')) {
      issues.push({
        severity: 'warning',
        message: 'Prisma schema may not be using DATABASE_URL env var',
        file: PRISMA_SCHEMA,
      });
    }

    // Check for Direct URL
    if (!prismaSchema.includes('directUrl')) {
      recommendations.push('Consider adding directUrl to Prisma datasource for connection pooling');
    }
  }

  // Check migration naming consistency
  const timestampPattern = /^\d{14}_/;
  const nonTimestampMigrations = migrationFiles.filter((f) => !timestampPattern.test(f));
  if (nonTimestampMigrations.length > 0) {
    issues.push({
      severity: 'warning',
      message: `Some migrations don't follow timestamp naming: ${nonTimestampMigrations.join(', ')}`,
      fix: 'Rename migrations to use timestamp prefix (YYYYMMDDHHMMSS_description.sql)',
    });
  }

  return {
    domain: 'Supabase Schema',
    status: issues.some((i) => i.severity === 'critical') ? 'critical' : 
            issues.some((i) => i.severity === 'warning') ? 'warning' : 'healthy',
    issues,
    recommendations,
  };
}

/**
 * 3. VERCEL DEPLOYMENT AUDIT
 */
async function auditVercel(): Promise<AuditResult> {
  const issues: Issue[] = [];
  const recommendations: string[] = [];

  // Check vercel.json exists
  if (!existsSync(VERCEL_JSON)) {
    issues.push({
      severity: 'warning',
      message: 'vercel.json missing - Vercel will use defaults',
      fix: 'Create vercel.json for explicit configuration',
    });
  } else {
    const vercelConfig = JSON.parse(readFileSync(VERCEL_JSON, 'utf-8'));

    // Check build command
    if (!vercelConfig.buildCommand) {
      issues.push({
        severity: 'warning',
        message: 'No buildCommand specified in vercel.json',
        file: VERCEL_JSON,
      });
    }

    // Check framework
    if (vercelConfig.framework !== 'nextjs') {
      issues.push({
        severity: 'warning',
        message: `Framework set to ${vercelConfig.framework}, expected 'nextjs'`,
        file: VERCEL_JSON,
      });
    }

    // Check for security headers
    if (!vercelConfig.headers || vercelConfig.headers.length === 0) {
      recommendations.push('Add security headers to vercel.json');
    }
  }

  // Check next.config.ts
  if (!existsSync(NEXT_CONFIG)) {
    issues.push({
      severity: 'critical',
      message: 'next.config.ts missing',
      fix: 'Create next.config.ts',
    });
  } else {
    const nextConfig = readFileSync(NEXT_CONFIG, 'utf-8');

    // Check for image domains
    if (!nextConfig.includes('remotePatterns') && !nextConfig.includes('domains')) {
      recommendations.push('Configure image remotePatterns in next.config.ts for Supabase');
    }

    // Check for security headers
    if (!nextConfig.includes('headers()')) {
      recommendations.push('Consider adding security headers in next.config.ts');
    }
  }

  return {
    domain: 'Vercel Deployment',
    status: issues.some((i) => i.severity === 'critical') ? 'critical' : 
            issues.some((i) => i.severity === 'warning') ? 'warning' : 'healthy',
    issues,
    recommendations,
  };
}

/**
 * 4. REPO INTEGRITY AUDIT
 */
async function auditRepoIntegrity(): Promise<AuditResult> {
  const issues: Issue[] = [];
  const recommendations: string[] = [];

  // Check for required documentation
  const requiredDocs = [
    { file: 'README.md', severity: 'critical' as const },
    { file: 'docs/ENVIRONMENT.md', severity: 'warning' as const },
    { file: 'docs/ARCHITECTURE.md', severity: 'info' as const },
    { file: 'docs/API.md', severity: 'info' as const },
    { file: 'docs/WORKFLOW.md', severity: 'info' as const },
  ];

  requiredDocs.forEach(({ file, severity }) => {
    const fullPath = join(process.cwd(), file);
    if (!existsSync(fullPath)) {
      issues.push({
        severity,
        message: `Missing documentation: ${file}`,
        fix: `Create ${file} with relevant documentation`,
      });
    }
  });

  // Check for package.json scripts consistency
  const packageJsonPath = join(process.cwd(), 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const scripts = packageJson.scripts || {};

    // Check for common scripts
    const commonScripts = ['dev', 'build', 'start', 'lint', 'test'];
    commonScripts.forEach((script) => {
      if (!scripts[script]) {
        issues.push({
          severity: 'warning',
          message: `Missing script: ${script}`,
          file: 'package.json',
        });
      }
    });
  }

  return {
    domain: 'Repo Integrity',
    status: issues.some((i) => i.severity === 'critical') ? 'critical' : 
            issues.some((i) => i.severity === 'warning') ? 'warning' : 'healthy',
    issues,
    recommendations,
  };
}

/**
 * 5. AI-AGENT MESH AUDIT
 */
async function auditAgentMesh(): Promise<AuditResult> {
  const issues: Issue[] = [];
  const recommendations: string[] = [];

  // Check for Zapier spec
  const zapierSpec = join(process.cwd(), 'automations', 'zapier_spec.json');
  if (existsSync(zapierSpec)) {
    try {
      const spec = JSON.parse(readFileSync(zapierSpec, 'utf-8'));
      if (!spec.triggers || spec.triggers.length === 0) {
        issues.push({
          severity: 'warning',
          message: 'Zapier spec exists but has no triggers',
          file: zapierSpec,
        });
      }
    } catch (e) {
      issues.push({
        severity: 'critical',
        message: 'Zapier spec file is invalid JSON',
        file: zapierSpec,
      });
    }
  } else {
    recommendations.push('Consider creating automations/zapier_spec.json for Zapier integration');
  }

  // Check for API routes that might be used by agents
  const apiRoutesDir = join(process.cwd(), 'app', 'api');
  if (existsSync(apiRoutesDir)) {
    const apiRoutes = readdirSync(apiRoutesDir, { recursive: true })
      .filter((f) => f.endsWith('route.ts') || f.endsWith('route.js'));

    // Check for ETL routes (mentioned in zapier_spec.json)
    const etlRoutes = ['etl/meta-ads', 'etl/tiktok-ads', 'etl/shopify-orders', 'etl/compute-metrics'];
    etlRoutes.forEach((route) => {
      const routePath = join(apiRoutesDir, route, 'route.ts');
      if (!existsSync(routePath)) {
        issues.push({
          severity: 'info',
          message: `ETL route not found: ${route}`,
          fix: `Create app/api/${route}/route.ts if using Zapier automation`,
        });
      }
    });
  }

  // Check for webhook handlers
  const webhookRoutes = ['stripe/webhook'];
  webhookRoutes.forEach((route) => {
    const routePath = join(process.cwd(), 'app', 'api', route, 'route.ts');
    if (!existsSync(routePath)) {
      issues.push({
        severity: 'warning',
        message: `Webhook route missing: ${route}`,
        fix: `Create app/api/${route}/route.ts`,
      });
    }
  });

  return {
    domain: 'AI-Agent Mesh',
    status: issues.some((i) => i.severity === 'critical') ? 'critical' : 
            issues.some((i) => i.severity === 'warning') ? 'warning' : 'healthy',
    issues,
    recommendations,
  };
}

/**
 * Generate comprehensive report
 */
async function generateReport(results: AuditResult[]): Promise<string> {
  const timestamp = new Date().toISOString();
  const criticalCount = results.filter((r) => r.status === 'critical').length;
  const warningCount = results.filter((r) => r.status === 'warning').length;
  const healthyCount = results.filter((r) => r.status === 'healthy').length;

  let report = `# Full-Stack Guardian Audit Report\n\n`;
  report += `**Generated:** ${timestamp}\n\n`;
  report += `## Executive Summary\n\n`;
  report += `- ✅ **Healthy:** ${healthyCount} domain(s)\n`;
  report += `- ⚠️ **Warnings:** ${warningCount} domain(s)\n`;
  report += `- 🔴 **Critical:** ${criticalCount} domain(s)\n\n`;

  report += `## Domain Audits\n\n`;

  results.forEach((result) => {
    const statusIcon = result.status === 'healthy' ? '✅' : 
                      result.status === 'warning' ? '⚠️' : '🔴';
    report += `### ${statusIcon} ${result.domain}\n\n`;
    report += `**Status:** ${result.status.toUpperCase()}\n\n`;

    if (result.issues.length > 0) {
      report += `#### Issues (${result.issues.length})\n\n`;
      result.issues.forEach((issue) => {
        const severityIcon = issue.severity === 'critical' ? '🔴' : 
                            issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        report += `- ${severityIcon} **${issue.severity.toUpperCase()}:** ${issue.message}\n`;
        if (issue.file) {
          report += `  - File: \`${issue.file}\`\n`;
        }
        if (issue.fix) {
          report += `  - Fix: ${issue.fix}\n`;
        }
      });
      report += `\n`;
    }

    if (result.recommendations.length > 0) {
      report += `#### Recommendations\n\n`;
      result.recommendations.forEach((rec) => {
        report += `- 💡 ${rec}\n`;
      });
      report += `\n`;
    }
  });

  report += `\n## Next Steps\n\n`;
  if (criticalCount > 0) {
    report += `1. **URGENT:** Address all critical issues immediately\n`;
  }
  if (warningCount > 0) {
    report += `2. **IMPORTANT:** Review and fix warning-level issues\n`;
  }
  report += `3. Review recommendations for optimization opportunities\n`;
  report += `4. Re-run audit after fixes to verify improvements\n`;

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Starting Full-Stack Guardian Audit...\n');

  const results: AuditResult[] = [];

  console.log('1️⃣ Auditing Environment & Secret Drift...');
  results.push(await auditEnvironment());

  console.log('2️⃣ Auditing Supabase Schema...');
  results.push(await auditSchema());

  console.log('3️⃣ Auditing Vercel Deployment...');
  results.push(await auditVercel());

  console.log('4️⃣ Auditing Repo Integrity...');
  results.push(await auditRepoIntegrity());

  console.log('5️⃣ Auditing AI-Agent Mesh...');
  results.push(await auditAgentMesh());

  console.log('\n📊 Generating report...');
  const report = await generateReport(results);

  const reportPath = join(REPORTS_DIR, `audit-${Date.now()}.md`);
  require('fs').writeFileSync(reportPath, report);
  console.log(`\n✅ Report saved to: ${reportPath}\n`);

  // Print summary
  console.log(report);

  // Exit with error code if critical issues found
  const hasCritical = results.some((r) => r.status === 'critical');
  process.exit(hasCritical ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}

export { auditEnvironment, auditSchema, auditVercel, auditRepoIntegrity, auditAgentMesh };
