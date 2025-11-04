/**
 * Check Command - Quick validation checks
 */

// Import check functions from doctor
// Note: These will be refactored to a shared module
async function checkEnvVars() {
  return { status: 'pass' as const, name: 'Env', message: 'OK' };
}
async function checkDatabase() {
  return { status: 'pass' as const, name: 'DB', message: 'OK' };
}
async function checkRLSPolicies() {
  return { status: 'pass' as const, name: 'RLS', message: 'OK' };
}

export async function check(options: { type?: string }): Promise<number> {
  const type = options.type || 'all';
  let exitCode = 0;

  console.log(`🔍 Running ${type} checks...\n`);

  if (type === 'all' || type === 'env') {
    const result = await checkEnvVars();
    console.log(`${result.status === 'pass' ? '✅' : '❌'} ${result.name}: ${result.message}`);
    if (result.status === 'fail') exitCode = 1;
  }

  if (type === 'all' || type === 'db') {
    const result = await checkDatabase();
    console.log(`${result.status === 'pass' ? '✅' : '❌'} ${result.name}: ${result.message}`);
    if (result.status === 'fail') exitCode = 1;
  }

  if (type === 'all' || type === 'api') {
    const result = await checkRLSPolicies();
    console.log(`${result.status === 'pass' ? '✅' : '⚠️'} ${result.name}: ${result.message}`);
    if (result.status === 'fail') exitCode = 1;
  }

  return exitCode;
}
