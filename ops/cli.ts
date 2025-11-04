#!/usr/bin/env tsx
/**
 * Master Orchestrator CLI
 * Production framework operations command-line interface
 */

import { program } from 'commander';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import command modules
import { doctor } from './commands/doctor.js';
import { init } from './commands/init.js';
import { check } from './commands/check.js';
import { release } from './commands/release.js';
import { snapshot } from './commands/snapshot.js';
import { restore } from './commands/restore.js';
import { rotateSecrets } from './commands/rotate-secrets.js';
import { sbGuard } from './commands/sb-guard.js';
import { testE2E } from './commands/test-e2e.js';
import { benchmark } from './commands/benchmark.js';
import { lintfix } from './commands/lintfix.js';
import { docs } from './commands/docs.js';
import { changelog } from './commands/changelog.js';

program
  .name('ops')
  .description('Production framework operations CLI')
  .version('1.0.0');

program
  .command('doctor')
  .description('Run comprehensive health checks')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    const exitCode = await doctor(options);
    process.exit(exitCode);
  });

program
  .command('init')
  .description('Initialize production framework')
  .option('--force', 'Force re-initialization')
  .action(async (options) => {
    await init(options);
  });

program
  .command('check')
  .description('Run quick validation checks')
  .option('--type <type>', 'Check type: env|db|api|all', 'all')
  .action(async (options) => {
    const exitCode = await check(options);
    process.exit(exitCode);
  });

program
  .command('release')
  .description('Execute release process')
  .option('--dry-run', 'Dry run without actual deployment')
  .option('--version <version>', 'Specify version (semver)')
  .option('--skip-tests', 'Skip tests')
  .action(async (options) => {
    const exitCode = await release(options);
    process.exit(exitCode);
  });

program
  .command('snapshot')
  .description('Create database snapshot')
  .option('--encrypt', 'Encrypt snapshot')
  .option('--tables <tables>', 'Comma-separated table list')
  .action(async (options) => {
    await snapshot(options);
  });

program
  .command('restore')
  .description('Restore database from snapshot')
  .option('--file <file>', 'Snapshot file path')
  .option('--dry-run', 'Dry run without actual restore')
  .action(async (options) => {
    await restore(options);
  });

program
  .command('rotate-secrets')
  .description('Rotate secrets and update environments')
  .option('--key <key>', 'Specific key to rotate')
  .option('--force', 'Force rotation even if not expired')
  .action(async (options) => {
    await rotateSecrets(options);
  });

program
  .command('sb-guard')
  .description('Scan Supabase RLS policies')
  .option('--fix', 'Auto-generate missing policies')
  .option('--report', 'Generate audit report')
  .action(async (options) => {
    const exitCode = await sbGuard(options);
    process.exit(exitCode);
  });

program
  .command('test:e2e')
  .description('Run E2E tests')
  .option('--headed', 'Run in headed mode')
  .option('--project <project>', 'Specific project to test')
  .action(async (options) => {
    const exitCode = await testE2E(options);
    process.exit(exitCode);
  });

program
  .command('benchmark')
  .description('Run performance benchmarks')
  .option('--output <output>', 'Output format: json|html', 'html')
  .action(async (options) => {
    await benchmark(options);
  });

program
  .command('lintfix')
  .description('Auto-fix linting issues')
  .option('--all', 'Fix all files')
  .action(async (options) => {
    await lintfix(options);
  });

program
  .command('docs')
  .description('Generate documentation')
  .option('--rebuild', 'Force rebuild all docs')
  .action(async (options) => {
    await docs(options);
  });

program
  .command('changelog')
  .description('Generate changelog')
  .option('--version <version>', 'Version to generate changelog for')
  .action(async (options) => {
    await changelog(options);
  });

program.parse(process.argv);
