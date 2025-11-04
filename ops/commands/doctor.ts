/**
 * Doctor Command - Comprehensive health checks
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: string;
}

export async function doctor(options: { verbose?: boolean }): Promise<number> {
  const results: CheckResult[] = [];
  let exitCode = 0;

  console.log('🔍 Running comprehensive health checks...\n');

  // 1. Environment variables
  results.push(await checkEnvVars());

  // 2. Database connectivity
  results.push(await checkDatabase());

  // 3. Prisma schema validation
  results.push(await checkPrismaSchema());

  // 4. Dependencies
  results.push(await checkDependencies());

  // 5. TypeScript compilation
  results.push(await checkTypeScript());

  // 6. Linting
  results.push(await checkLinting());

  // 7. Tests
  results.push(await checkTests());

  // 8. Build
  results.push(await checkBuild());

  // 9. Performance budgets
  results.push(await checkPerformanceBudgets());

  // 10. Security
  results.push(await checkSecurity());

  // 11. Secrets rotation status
  results.push(await checkSecretsRotation());

  // 12. RLS policies
  results.push(await checkRLSPolicies());

  // 13. Migration status
  results.push(await checkMigrations());

  // 14. Observability
  results.push(await checkObservability());

  // Print results
  console.log('\n📊 Health Check Results:\n');
  results.forEach((result) => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
    console.log(`${icon} ${result.name}: ${result.message}`);
    if (options.verbose && result.details) {
      console.log(`   ${result.details}`);
    }
    if (result.status === 'fail') {
      exitCode = 1;
    }
  });

  console.log(`\n${exitCode === 0 ? '✅ All checks passed!' : '❌ Some checks failed'}\n`);

  return exitCode;
}

async function checkEnvVars(): Promise<CheckResult> {
  try {
    const required = [
      'DATABASE_URL',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ];
    const missing: string[] = [];

    for (const key of required) {
      if (!process.env[key]) {
        missing.push(key);
      }
    }

    if (missing.length > 0) {
      return {
        name: 'Environment Variables',
        status: 'fail',
        message: `Missing: ${missing.join(', ')}`,
      };
    }

    return {
      name: 'Environment Variables',
      status: 'pass',
      message: 'All required variables present',
    };
  } catch (error) {
    return {
      name: 'Environment Variables',
      status: 'fail',
      message: `Error: ${error}`,
    };
  }
}

async function checkDatabase(): Promise<CheckResult> {
  try {
    // Try to connect to database
    execSync('npx prisma db execute --stdin <<< "SELECT 1"', { stdio: 'pipe' });
    return {
      name: 'Database Connectivity',
      status: 'pass',
      message: 'Database connection successful',
    };
  } catch (error) {
    return {
      name: 'Database Connectivity',
      status: 'fail',
      message: 'Failed to connect to database',
      details: String(error),
    };
  }
}

async function checkPrismaSchema(): Promise<CheckResult> {
  try {
    execSync('npx prisma validate', { stdio: 'pipe' });
    return {
      name: 'Prisma Schema',
      status: 'pass',
      message: 'Schema is valid',
    };
  } catch (error) {
    return {
      name: 'Prisma Schema',
      status: 'fail',
      message: 'Schema validation failed',
      details: String(error),
    };
  }
}

async function checkDependencies(): Promise<CheckResult> {
  try {
    if (!fs.existsSync('node_modules')) {
      return {
        name: 'Dependencies',
        status: 'fail',
        message: 'node_modules not found - run pnpm install',
      };
    }
    return {
      name: 'Dependencies',
      status: 'pass',
      message: 'Dependencies installed',
    };
  } catch (error) {
    return {
      name: 'Dependencies',
      status: 'fail',
      message: `Error: ${error}`,
    };
  }
}

async function checkTypeScript(): Promise<CheckResult> {
  try {
    execSync('pnpm typecheck', { stdio: 'pipe' });
    return {
      name: 'TypeScript',
      status: 'pass',
      message: 'No type errors',
    };
  } catch (error) {
    return {
      name: 'TypeScript',
      status: 'fail',
      message: 'Type errors found',
      details: String(error),
    };
  }
}

async function checkLinting(): Promise<CheckResult> {
  try {
    execSync('pnpm lint', { stdio: 'pipe' });
    return {
      name: 'Linting',
      status: 'pass',
      message: 'No linting errors',
    };
  } catch (error) {
    return {
      name: 'Linting',
      status: 'warn',
      message: 'Linting issues found',
      details: String(error),
    };
  }
}

async function checkTests(): Promise<CheckResult> {
  try {
    execSync('pnpm test --run', { stdio: 'pipe' });
    return {
      name: 'Tests',
      status: 'pass',
      message: 'All tests passing',
    };
  } catch (error) {
    return {
      name: 'Tests',
      status: 'fail',
      message: 'Some tests failing',
      details: String(error),
    };
  }
}

async function checkBuild(): Promise<CheckResult> {
  try {
    execSync('pnpm build', { stdio: 'pipe' });
    return {
      name: 'Build',
      status: 'pass',
      message: 'Build successful',
    };
  } catch (error) {
    return {
      name: 'Build',
      status: 'fail',
      message: 'Build failed',
      details: String(error),
    };
  }
}

async function checkPerformanceBudgets(): Promise<CheckResult> {
  try {
    const budgetsPath = path.join(process.cwd(), 'ops', 'perf', 'BUDGETS.md');
    if (!fs.existsSync(budgetsPath)) {
      return {
        name: 'Performance Budgets',
        status: 'warn',
        message: 'Budget file not found',
      };
    }
    return {
      name: 'Performance Budgets',
      status: 'pass',
      message: 'Budget file exists',
    };
  } catch (error) {
    return {
      name: 'Performance Budgets',
      status: 'warn',
      message: `Error: ${error}`,
    };
  }
}

async function checkSecurity(): Promise<CheckResult> {
  try {
    execSync('pnpm audit:security', { stdio: 'pipe' });
    return {
      name: 'Security',
      status: 'pass',
      message: 'No high-severity vulnerabilities',
    };
  } catch (error) {
    return {
      name: 'Security',
      status: 'warn',
      message: 'Security vulnerabilities found',
      details: String(error),
    };
  }
}

async function checkSecretsRotation(): Promise<CheckResult> {
  try {
    const secretsPath = path.join(process.cwd(), 'ops', 'secrets', 'rotation.json');
    if (!fs.existsSync(secretsPath)) {
      return {
        name: 'Secrets Rotation',
        status: 'warn',
        message: 'Rotation tracking not initialized',
      };
    }
    const rotation = JSON.parse(fs.readFileSync(secretsPath, 'utf-8'));
    const expired = Object.entries(rotation).filter(([_, v]: [string, any]) => {
      const daysSince = (Date.now() - new Date(v.lastRotated).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 20;
    });

    if (expired.length > 0) {
      return {
        name: 'Secrets Rotation',
        status: 'warn',
        message: `${expired.length} secrets need rotation`,
      };
    }

    return {
      name: 'Secrets Rotation',
      status: 'pass',
      message: 'All secrets within rotation window',
    };
  } catch (error) {
    return {
      name: 'Secrets Rotation',
      status: 'warn',
      message: `Error: ${error}`,
    };
  }
}

async function checkRLSPolicies(): Promise<CheckResult> {
  try {
    // Check if RLS audit exists
    const auditPath = path.join(process.cwd(), 'ops', 'reports', 'rls-audit.md');
    if (!fs.existsSync(auditPath)) {
      return {
        name: 'RLS Policies',
        status: 'warn',
        message: 'RLS audit not found - run ops sb-guard',
      };
    }
    return {
      name: 'RLS Policies',
      status: 'pass',
      message: 'RLS audit available',
    };
  } catch (error) {
    return {
      name: 'RLS Policies',
      status: 'warn',
      message: `Error: ${error}`,
    };
  }
}

async function checkMigrations(): Promise<CheckResult> {
  try {
    execSync('npx prisma migrate status', { stdio: 'pipe' });
    return {
      name: 'Migrations',
      status: 'pass',
      message: 'Migrations up to date',
    };
  } catch (error) {
    return {
      name: 'Migrations',
      status: 'warn',
      message: 'Migration issues detected',
      details: String(error),
    };
  }
}

async function checkObservability(): Promise<CheckResult> {
  try {
    const otelEnabled = process.env.ENABLE_OTEL !== 'false';
    if (!otelEnabled) {
      return {
        name: 'Observability',
        status: 'warn',
        message: 'OpenTelemetry disabled',
      };
    }
    return {
      name: 'Observability',
      status: 'pass',
      message: 'Observability enabled',
    };
  } catch (error) {
    return {
      name: 'Observability',
      status: 'warn',
      message: `Error: ${error}`,
    };
  }
}
