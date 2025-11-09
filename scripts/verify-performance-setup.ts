#!/usr/bin/env tsx
/**
 * Verification script for Performance Intelligence Layer setup
 * Checks that all components are properly configured
 */

import { existsSync } from "fs";
import { join } from "path";

interface CheckResult {
  name: string;
  status: "✅" | "❌" | "⚠️";
  message: string;
}

function checkFile(path: string, name: string): CheckResult {
  const fullPath = join(process.cwd(), path);
  const exists = existsSync(fullPath);
  return {
    name,
    status: exists ? "✅" : "❌",
    message: exists ? "Found" : "Missing",
  };
}

function checkEnvVar(name: string): CheckResult {
  const value = process.env[name];
  return {
    name: `Env: ${name}`,
    status: value ? "✅" : "⚠️",
    message: value ? "Set" : "Not set (optional)",
  };
}

async function main() {
  console.log("🔍 Verifying Performance Intelligence Layer setup...\n");

  const checks: CheckResult[] = [];

  // Check files
  checks.push(checkFile("supabase/migrations/20250123000000_performance_metrics.sql", "Migration file"));
  checks.push(checkFile("app/api/metrics/route.ts", "Metrics API endpoint"));
  checks.push(checkFile("app/api/telemetry/route.ts", "Telemetry API endpoint"));
  checks.push(checkFile("app/admin/metrics/page.tsx", "Dashboard page"));
  checks.push(checkFile("components/performance-beacon.tsx", "Performance beacon component"));
  checks.push(checkFile("scripts/collect-metrics.ts", "Collection script"));
  checks.push(checkFile("scripts/generate-performance-report.ts", "Report generator"));
  checks.push(checkFile("scripts/auto-optimize.ts", "Optimization script"));
  checks.push(checkFile("scripts/alert-regressions.ts", "Alerting script"));
  checks.push(checkFile(".github/workflows/telemetry.yml", "GitHub workflow"));

  // Check environment variables
  checks.push(checkEnvVar("SUPABASE_URL"));
  checks.push(checkEnvVar("SUPABASE_SERVICE_ROLE_KEY"));
  checks.push(checkEnvVar("VERCEL_TOKEN"));
  checks.push(checkEnvVar("GITHUB_TOKEN"));
  checks.push(checkEnvVar("TELEMETRY_WEBHOOK_URL"));

  // Display results
  console.log("File Checks:\n");
  for (const check of checks.filter((c) => !c.name.startsWith("Env:"))) {
    console.log(`  ${check.status} ${check.name}: ${check.message}`);
  }

  console.log("\nEnvironment Variables:\n");
  for (const check of checks.filter((c) => c.name.startsWith("Env:"))) {
    console.log(`  ${check.status} ${check.name}: ${check.message}`);
  }

  // Summary
  const passed = checks.filter((c) => c.status === "✅").length;
  const failed = checks.filter((c) => c.status === "❌").length;
  const warnings = checks.filter((c) => c.status === "⚠️").length;

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⚠️  Warnings: ${warnings}`);

  if (failed > 0) {
    console.log("\n❌ Some required files are missing. Please check the setup.");
    process.exit(1);
  }

  if (warnings > 0) {
    console.log("\n⚠️  Some optional environment variables are not set.");
    console.log("   The system will work but some features may be limited.");
  }

  console.log("\n✅ Setup verification complete!");
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { checkFile, checkEnvVar };
