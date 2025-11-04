/**
 * Rotate Secrets Command - Rotate secrets and update environments
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { randomBytes } from 'crypto';

export async function rotateSecrets(options: {
  key?: string;
  force?: boolean;
}) {
  console.log('🔐 Rotating secrets...\n');

  const secretsPath = path.join(process.cwd(), 'ops', 'secrets', 'rotation.json');
  let rotation: any = {
    lastUpdated: new Date().toISOString(),
    secrets: {},
  };

  if (fs.existsSync(secretsPath)) {
    rotation = JSON.parse(fs.readFileSync(secretsPath, 'utf-8'));
  }

  const secretsToRotate = options.key
    ? [options.key]
    : [
        'JWT_SECRET',
        'SECRET_KEY_BASE',
        'ENCRYPTION_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
      ];

  for (const key of secretsToRotate) {
    // Check if rotation is needed (20 days)
    const existing = rotation.secrets[key];
    if (existing && !options.force) {
      const daysSince = (Date.now() - new Date(existing.lastRotated).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 20) {
        console.log(`⏭️  ${key}: Rotated ${Math.floor(daysSince)} days ago, skipping`);
        continue;
      }
    }

    console.log(`🔄 Rotating ${key}...`);

    // Generate new secret
    let newSecret: string;
    switch (key) {
      case 'JWT_SECRET':
        newSecret = randomBytes(32).toString('base64');
        break;
      case 'SECRET_KEY_BASE':
        newSecret = randomBytes(64).toString('base64');
        break;
      case 'ENCRYPTION_KEY':
        newSecret = randomBytes(32).toString('hex').slice(0, 32);
        break;
      default:
        newSecret = randomBytes(32).toString('base64');
    }

    // Update rotation tracking
    rotation.secrets[key] = {
      lastRotated: new Date().toISOString(),
      length: newSecret.length,
    };

    // Update environment files
    const envFiles = ['.env.local', '.env'];
    for (const envFile of envFiles) {
      const envPath = path.join(process.cwd(), envFile);
      if (fs.existsSync(envPath)) {
        let content = fs.readFileSync(envPath, 'utf-8');
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(content)) {
          content = content.replace(regex, `${key}=${newSecret}`);
        } else {
          content += `\n${key}=${newSecret}\n`;
        }
        fs.writeFileSync(envPath, content);
        console.log(`  ✅ Updated ${envFile}`);
      }
    }

    // Update Supabase (if applicable)
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
      console.log('  ⚠️  Manual update required for Supabase dashboard');
    }

    // Update Vercel (if applicable)
    if (process.env.VERCEL) {
      console.log('  ⚠️  Manual update required for Vercel environment variables');
    }

    console.log(`  ✅ ${key} rotated successfully`);
  }

  // Save rotation tracking
  rotation.lastUpdated = new Date().toISOString();
  fs.writeFileSync(secretsPath, JSON.stringify(rotation, null, 2));

  console.log('\n✅ Secret rotation complete!');
  console.log('\n⚠️  Remember to:');
  console.log('1. Update Supabase dashboard for service role keys');
  console.log('2. Update Vercel environment variables');
  console.log('3. Restart services to pick up new secrets');
}
