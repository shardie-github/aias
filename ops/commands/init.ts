/**
 * Init Command - Initialize production framework
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export async function init(options: { force?: boolean }) {
  console.log('🚀 Initializing production framework...\n');

  const rootDir = process.cwd();

  // Create directory structure
  const directories = [
    'ops/docs',
    'ops/reports',
    'ops/runbooks',
    'ops/secrets',
    'ops/store',
    'tests/reality',
    'partners',
  ];

  directories.forEach((dir) => {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created ${dir}/`);
    } else if (options.force) {
      console.log(`⚠️  ${dir}/ already exists`);
    }
  });

  // Initialize secrets rotation tracking
  const secretsPath = path.join(rootDir, 'ops', 'secrets', 'rotation.json');
  if (!fs.existsSync(secretsPath) || options.force) {
    const rotation = {
      lastUpdated: new Date().toISOString(),
      secrets: {},
    };
    fs.writeFileSync(secretsPath, JSON.stringify(rotation, null, 2));
    console.log('✅ Initialized secrets rotation tracking');
  }

  // Create .env.example if not exists
  const envExamplePath = path.join(rootDir, '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    const envExample = `# Core Configuration
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DIRECT_URL=postgresql://user:password@localhost:5432/dbname

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security
JWT_SECRET=your-jwt-secret
SECRET_KEY_BASE=your-secret-key-base
ENCRYPTION_KEY=your-32-char-encryption-key

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Providers (optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# Observability
ENABLE_OTEL=true
OTEL_SERVICE_NAME=aias-platform
`;
    fs.writeFileSync(envExamplePath, envExample);
    console.log('✅ Created .env.example');
  }

  // Create .envrc for direnv
  const envrcPath = path.join(rootDir, '.envrc');
  if (!fs.existsSync(envrcPath)) {
    const envrc = `# Load environment variables
dotenv_if_exists .env.local
dotenv_if_exists .env

# Node.js version
use nodejs

# Allow direnv
export PATH=$PWD/node_modules/.bin:$PATH
`;
    fs.writeFileSync(envrcPath, envrc);
    console.log('✅ Created .envrc');
  }

  console.log('\n✅ Framework initialization complete!');
  console.log('\nNext steps:');
  console.log('1. Copy .env.example to .env.local and fill in values');
  console.log('2. Run: npm run ops doctor');
  console.log('3. Run: npm run ops check');
}
