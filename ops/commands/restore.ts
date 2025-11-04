/**
 * Restore Command - Restore database from snapshot
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export async function restore(options: {
  file?: string;
  dryRun?: boolean;
}) {
  console.log('🔄 Restoring database from snapshot...\n');

  if (options.dryRun) {
    console.log('⚠️  DRY RUN MODE - No actual restore will be performed\n');
  }

  const snapshotDir = path.join(process.cwd(), 'ops', 'snapshots');

  // Find snapshot file
  let snapshotFile = options.file;
  if (!snapshotFile) {
    // Find latest snapshot
    const files = fs.readdirSync(snapshotDir)
      .filter((f) => f.endsWith('.sql') || f.endsWith('.sql.enc'))
      .sort()
      .reverse();

    if (files.length === 0) {
      throw new Error('No snapshot files found');
    }

    snapshotFile = path.join(snapshotDir, files[0]);
    console.log(`📂 Using latest snapshot: ${files[0]}`);
  }

  if (!fs.existsSync(snapshotFile)) {
    throw new Error(`Snapshot file not found: ${snapshotFile}`);
  }

  try {
    // Check if encrypted
    let restoreFile = snapshotFile;
    if (snapshotFile.endsWith('.enc')) {
      const encryptionKey = process.env.ENCRYPTION_KEY;
      if (!encryptionKey) {
        throw new Error('ENCRYPTION_KEY not set for encrypted snapshot');
      }

      restoreFile = snapshotFile.replace('.enc', '');
      console.log('🔓 Decrypting snapshot...');
      execSync(
        `openssl enc -aes-256-cbc -d -in "${snapshotFile}" -out "${restoreFile}" -pass pass:${encryptionKey}`,
        { stdio: 'inherit' }
      );
    }

    if (options.dryRun) {
      console.log('✅ Dry run complete - would restore:', restoreFile);
      return;
    }

    // Check for migration lock
    console.log('🔒 Checking migration lock...');
    try {
      execSync('npx prisma migrate status', { stdio: 'pipe' });
    } catch (error) {
      console.warn('⚠️  Migration lock detected, proceeding anyway...');
    }

    // Restore database
    console.log('📥 Restoring database...');
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not set');
    }

    execSync(`psql "${dbUrl}" < "${restoreFile}"`, { stdio: 'inherit' });

    // Clean up decrypted file if we created one
    if (snapshotFile.endsWith('.enc')) {
      fs.unlinkSync(restoreFile);
    }

    console.log('✅ Database restored successfully!');
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  }
}
