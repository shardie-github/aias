#!/usr/bin/env tsx
/**
 * Security Self-Check Script — Hardonia
 * Runs common integrity and configuration checks for Supabase, Prisma, and CI.
 * 
 * This script validates:
 * - Environment variables (Supabase, Database)
 * - Content Security Policy headers
 * - Prisma schema validation
 * - Database connectivity and schema sync
 * - Prisma client generation
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
  warning?: boolean;
}

const results: CheckResult[] = [];
let exitCode = 0;

/**
 * Log a check result
 */
function logResult(name: string, passed: boolean, message: string, warning = false): void {
  results.push({ name, passed, message, warning });
  const icon = passed ? "✅" : warning ? "⚠️ " : "❌";
  const color = passed ? "\x1b[32m" : warning ? "\x1b[33m" : "\x1b[31m";
  const reset = "\x1b[0m";
  console.log(`${color}${icon}${reset} ${name}: ${message}`);
  
  if (!passed && !warning) {
    exitCode = 1;
  }
}

/**
 * Check environment variables
 */
function checkEnv(): void {
  const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "DATABASE_URL"];
  const missing = required.filter((k) => !process.env[k]);
  
  if (missing.length) {
    logResult(
      "Environment Variables",
      false,
      `Missing: ${missing.join(", ")}`
    );
  } else {
    logResult(
      "Environment Variables",
      true,
      `All required variables present (${required.length} checked)`
    );
  }
  
  // Optional: Check for recommended variables
  const recommended = ["DIRECT_URL", "SUPABASE_SERVICE_ROLE_KEY"];
  const missingRecommended = recommended.filter((k) => !process.env[k]);
  
  if (missingRecommended.length > 0) {
    logResult(
      "Optional Environment Variables",
      true,
      `Missing optional vars: ${missingRecommended.join(", ")}`,
      true
    );
  }
}

/**
 * Check Content Security Policy
 */
function checkCSP(): void {
  const publicDir = path.join(process.cwd(), "public");
  const headersFile = path.join(publicDir, "_headers");
  
  if (!fs.existsSync(headersFile)) {
    logResult(
      "Content Security Policy",
      false,
      "No CSP found. Add strict CSP to /public/_headers",
      true
    );
    
    // Suggest creating a basic CSP file
    const exampleCSP = `/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-src 'self' https://js.stripe.com;
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
`;
    
    console.log("\n💡 Suggested CSP content (save to /public/_headers):");
    console.log(exampleCSP);
    return;
  }
  
  const headersContent = fs.readFileSync(headersFile, "utf8");
  
  if (!headersContent.includes("Content-Security-Policy")) {
    logResult(
      "Content Security Policy",
      false,
      "CSP header not found in /public/_headers",
      true
    );
  } else {
    logResult(
      "Content Security Policy",
      true,
      "CSP policy found in /public/_headers"
    );
    
    // Check for common CSP weaknesses
    const cspLower = headersContent.toLowerCase();
    if (cspLower.includes("'unsafe-inline'") || cspLower.includes("'unsafe-eval'")) {
      logResult(
        "CSP Security",
        true,
        "CSP contains unsafe-inline or unsafe-eval (consider hardening)",
        true
      );
    }
    
    // Check for security headers
    const securityHeaders = [
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy"
    ];
    
    const missingHeaders = securityHeaders.filter(
      (header) => !headersContent.includes(header)
    );
    
    if (missingHeaders.length > 0) {
      logResult(
        "Security Headers",
        true,
        `Missing recommended headers: ${missingHeaders.join(", ")}`,
        true
      );
    } else {
      logResult(
        "Security Headers",
        true,
        "All recommended security headers present"
      );
    }
  }
}

/**
 * Check Prisma schema exists
 */
function checkPrismaSchema(): void {
  const schemaPath = path.join(process.cwd(), "apps", "web", "prisma", "schema.prisma");
  
  if (!fs.existsSync(schemaPath)) {
    logResult(
      "Prisma Schema",
      false,
      `Schema file not found at ${schemaPath}`
    );
    return;
  }
  
  logResult(
    "Prisma Schema",
    true,
    "Schema file found"
  );
}

/**
 * Run a command and handle errors
 */
function runCmd(cmd: string, description: string): void {
  try {
    console.log(`\n▶ Running: ${description}`);
    const output = execSync(cmd, { 
      stdio: "pipe",
      encoding: "utf8",
      cwd: process.cwd()
    });
    
    // Show first few lines of output
    const lines = output.toString().split("\n").filter(Boolean);
    if (lines.length > 0) {
      const preview = lines.slice(0, 5).join("\n");
      if (preview) {
        console.log(preview);
      }
    }
    
    logResult(
      description,
      true,
      "Command completed successfully"
    );
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    const output = error.stdout?.toString() || error.stderr?.toString() || errorMessage;
    
    logResult(
      description,
      false,
      `Command failed: ${output.split("\n")[0] || errorMessage}`
    );
    
    // Show error details
    if (output && output.length > 0) {
      const errorLines = output.split("\n").slice(0, 10);
      console.error("\nError details:");
      errorLines.forEach((line: string) => console.error(`  ${line}`));
    }
  }
}

/**
 * Validate Prisma schema
 */
function validatePrisma(): void {
  const schemaPath = path.join(process.cwd(), "apps", "web", "prisma", "schema.prisma");
  runCmd(
    `npx prisma validate --schema=${schemaPath}`,
    "Prisma Schema Validation"
  );
}

/**
 * Pull database schema
 */
function pullPrismaSchema(): void {
  const schemaPath = path.join(process.cwd(), "apps", "web", "prisma", "schema.prisma");
  runCmd(
    `npx prisma db pull --schema=${schemaPath}`,
    "Prisma Database Schema Pull"
  );
}

/**
 * Generate Prisma client
 */
function generatePrismaClient(): void {
  const schemaPath = path.join(process.cwd(), "apps", "web", "prisma", "schema.prisma");
  runCmd(
    `npx prisma generate --schema=${schemaPath}`,
    "Prisma Client Generation"
  );
}

/**
 * Check for sensitive files in repository
 */
function checkSensitiveFiles(): void {
  const sensitivePatterns = [
    ".env",
    ".env.local",
    ".env.production",
    "*.key",
    "*.pem",
    "secrets.json"
  ];
  
  const found: string[] = [];
  
  // Check if .env files exist (they should be gitignored)
  const envFiles = [".env", ".env.local", ".env.production"];
  envFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      found.push(file);
    }
  });
  
  if (found.length > 0) {
    logResult(
      "Sensitive Files",
      true,
      `Found ${found.length} .env file(s) - ensure they're in .gitignore`,
      true
    );
  } else {
    logResult(
      "Sensitive Files",
      true,
      "No .env files found in root (expected behavior)"
    );
  }
}

/**
 * Check gitignore for sensitive files
 */
function checkGitignore(): void {
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  
  if (!fs.existsSync(gitignorePath)) {
    logResult(
      ".gitignore",
      false,
      ".gitignore file not found"
    );
    return;
  }
  
  const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
  const requiredPatterns = [".env", ".env.local", "node_modules", ".next", "dist"];
  const missingPatterns = requiredPatterns.filter(
    (pattern) => !gitignoreContent.includes(pattern)
  );
  
  if (missingPatterns.length > 0) {
    logResult(
      ".gitignore",
      true,
      `Missing patterns: ${missingPatterns.join(", ")}`,
      true
    );
  } else {
    logResult(
      ".gitignore",
      true,
      "Essential patterns present"
    );
  }
}

/**
 * Print summary
 */
function printSummary(): void {
  console.log("\n" + "=".repeat(60));
  console.log("Security Self-Check Summary");
  console.log("=".repeat(60));
  
  const passed = results.filter((r) => r.passed && !r.warning).length;
  const warnings = results.filter((r) => r.warning).length;
  const failed = results.filter((r) => !r.passed && !r.warning).length;
  
  console.log(`\n✅ Passed: ${passed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nTotal Checks: ${results.length}`);
  
  if (failed > 0) {
    console.log("\n❌ Failed Checks:");
    results
      .filter((r) => !r.passed && !r.warning)
      .forEach((r) => console.log(`  - ${r.name}: ${r.message}`));
  }
  
  if (warnings > 0) {
    console.log("\n⚠️  Warnings:");
    results
      .filter((r) => r.warning)
      .forEach((r) => console.log(`  - ${r.name}: ${r.message}`));
  }
  
  console.log("\n" + "=".repeat(60));
}

/**
 * Main execution
 */
function main(): void {
  console.log("🔒 Security Self-Check — Hardonia");
  console.log("=".repeat(60));
  console.log(`Working directory: ${process.cwd()}`);
  console.log(`Node version: ${process.version}`);
  console.log("=".repeat(60) + "\n");
  
  // Run checks
  checkEnv();
  checkCSP();
  checkPrismaSchema();
  checkSensitiveFiles();
  checkGitignore();
  
  // Only run Prisma commands if schema exists
  const schemaPath = path.join(process.cwd(), "apps", "web", "prisma", "schema.prisma");
  if (fs.existsSync(schemaPath)) {
    validatePrisma();
    pullPrismaSchema();
    generatePrismaClient();
  } else {
    logResult(
      "Prisma Commands",
      false,
      "Skipped - Prisma schema not found"
    );
  }
  
  // Print summary
  printSummary();
  
  // Exit with appropriate code
  process.exit(exitCode);
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main as runSecurityCheck };
