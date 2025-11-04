/**
 * Lintfix Command - Auto-fix linting issues
 */

import { execSync } from 'child_process';

export async function lintfix(options: { all?: boolean }) {
  console.log('🔧 Auto-fixing linting issues...\n');

  try {
    execSync('pnpm lint:fix', { stdio: 'inherit' });
    console.log('\n✅ Linting fixes applied');
  } catch (error) {
    console.error('\n❌ Lintfix failed:', error);
    throw error;
  }
}
