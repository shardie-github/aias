/**
 * Changelog Command - Generate changelog
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export async function changelog(options: { version?: string }) {
  console.log('📝 Generating changelog...\n');

  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  let existingChangelog = '';

  if (fs.existsSync(changelogPath)) {
    existingChangelog = fs.readFileSync(changelogPath, 'utf-8');
  }

  const version = options.version || '1.0.0';
  const date = new Date().toISOString().split('T')[0];

  // Get git commits since last tag
  let commits: string[] = [];
  try {
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo ""', {
      encoding: 'utf-8',
    }).trim();

    if (lastTag) {
      const logOutput = execSync(`git log ${lastTag}..HEAD --pretty=format:"%s"`, {
        encoding: 'utf-8',
      });
      commits = logOutput.split('\n').filter((c) => c.trim());
    } else {
      const logOutput = execSync('git log --pretty=format:"%s" -10', {
        encoding: 'utf-8',
      });
      commits = logOutput.split('\n').filter((c) => c.trim());
    }
  } catch (error) {
    console.warn('⚠️  Could not fetch git commits');
  }

  // Categorize commits
  const features: string[] = [];
  const fixes: string[] = [];
  const chores: string[] = [];

  commits.forEach((commit) => {
    const lower = commit.toLowerCase();
    if (lower.startsWith('feat') || lower.includes('feature')) {
      features.push(commit);
    } else if (lower.startsWith('fix') || lower.includes('bug')) {
      fixes.push(commit);
    } else {
      chores.push(commit);
    }
  });

  // Generate changelog entry
  let newEntry = `## [${version}] - ${date}\n\n`;

  if (features.length > 0) {
    newEntry += '### Added\n\n';
    features.forEach((feat) => {
      newEntry += `- ${feat}\n`;
    });
    newEntry += '\n';
  }

  if (fixes.length > 0) {
    newEntry += '### Fixed\n\n';
    fixes.forEach((fix) => {
      newEntry += `- ${fix}\n`;
    });
    newEntry += '\n';
  }

  if (chores.length > 0 && chores.length < 10) {
    newEntry += '### Changed\n\n';
    chores.slice(0, 5).forEach((chore) => {
      newEntry += `- ${chore}\n`;
    });
    newEntry += '\n';
  }

  // Prepend to existing changelog
  const header = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n`;

  const updatedChangelog =
    existingChangelog.startsWith('# Changelog')
      ? existingChangelog.replace(/^# Changelog[\s\S]*?\n\n/, header + newEntry)
      : header + newEntry + (existingChangelog ? '\n' + existingChangelog : '');

  fs.writeFileSync(changelogPath, updatedChangelog);
  console.log(`✅ Changelog updated: ${changelogPath}`);
}
