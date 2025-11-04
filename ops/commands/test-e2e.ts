/**
 * Test E2E Command - Run end-to-end tests
 */

import { execSync } from 'child_process';

export async function testE2E(options: {
  headed?: boolean;
  project?: string;
}): Promise<number> {
  console.log('🧪 Running E2E tests...\n');

  try {
    let command = 'pnpm test:e2e';
    if (options.project) {
      command += ` --project ${options.project}`;
    }
    if (options.headed) {
      command += ' --headed';
    }

    execSync(command, { stdio: 'inherit' });
    console.log('\n✅ E2E tests passed');
    return 0;
  } catch (error) {
    console.error('\n❌ E2E tests failed');
    return 1;
  }
}
