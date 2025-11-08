#!/usr/bin/env tsx
/**
 * Check Node.js version against .nvmrc
 * Fails if version doesn't match
 */

import { readFileSync } from "fs";
import { join } from "path";

const nvmrcPath = join(process.cwd(), ".nvmrc");
const requiredVersion = readFileSync(nvmrcPath, "utf-8").trim().replace(/^v/, "");
const currentVersion = process.version.replace(/^v/, "");

const [requiredMajor] = requiredVersion.split(".").map(Number);
const [currentMajor] = currentVersion.split(".").map(Number);

if (currentMajor !== requiredMajor) {
  console.error(
    `❌ Node.js version mismatch!\n` +
    `   Required: v${requiredMajor}.x.x (from .nvmrc)\n` +
    `   Current:  v${currentVersion}\n` +
    `\n` +
    `   Please install the correct version:\n` +
    `   nvm install ${requiredVersion}\n` +
    `   nvm use ${requiredVersion}`
  );
  process.exit(1);
}

console.log(`✓ Node.js version matches .nvmrc (v${currentVersion})`);
