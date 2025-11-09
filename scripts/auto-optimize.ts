#!/usr/bin/env tsx
/**
 * Auto-Optimization Script
 * Analyzes metrics and applies safe, incremental optimizations
 * Logs all changes for audit trail
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "../lib/env";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface Optimization {
  type: string;
  description: string;
  action: () => Promise<void>;
  applied: boolean;
  timestamp: string;
}

async function analyzeAndOptimize() {
  console.log("🔧 Auto-optimization analysis starting...\n");

  const supabase = createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey
  );

  // Get latest metrics
  const { data: latestMetrics } = await supabase
    .from("metrics_log")
    .select("source, metric, ts")
    .order("ts", { ascending: false })
    .limit(20);

  const optimizations: Optimization[] = [];

  // Analyze each source
  for (const metric of latestMetrics || []) {
    const source = metric.source;
    const data = metric.metric || {};

    // Supabase optimizations
    if (source === "supabase" && data.avgLatencyMs > 200) {
      optimizations.push({
        type: "supabase_index",
        description: `Query latency high (${data.avgLatencyMs}ms). Recommend adding indexes.`,
        action: async () => {
          console.log("📝 Recommendation: Review slow queries and add indexes");
          // In production, you'd analyze query logs and suggest specific indexes
        },
        applied: false,
        timestamp: new Date().toISOString(),
      });
    }

    // Expo bundle optimizations
    if (source === "expo" && data.bundleMB > 30) {
      optimizations.push({
        type: "expo_bundle",
        description: `Bundle size large (${data.bundleMB}MB). Recommend optimization.`,
        action: async () => {
          console.log("📝 Recommendation: Run 'eas build:configure' and enable tree-shaking");
        },
        applied: false,
        timestamp: new Date().toISOString(),
      });
    }

    // CI optimizations
    if (source === "ci" && data.queueLength > 3) {
      optimizations.push({
        type: "ci_concurrency",
        description: `CI queue length high (${data.queueLength}). Recommend reducing concurrency.`,
        action: async () => {
          console.log("📝 Recommendation: Review GitHub Actions workflow concurrency settings");
        },
        applied: false,
        timestamp: new Date().toISOString(),
      });
    }

    // Web Vitals optimizations
    if (source === "vercel" || source === "telemetry") {
      if (data.LCP > 2500) {
        optimizations.push({
          type: "image_optimization",
          description: `LCP high (${data.LCP}ms). Enable image optimization.`,
          action: async () => {
            // Check if next.config.ts has image optimization enabled
            const configPath = join(process.cwd(), "next.config.ts");
            try {
              const config = readFileSync(configPath, "utf-8");
              if (!config.includes("images:")) {
                console.log("📝 Recommendation: Add image optimization to next.config.ts");
              }
            } catch (e) {
              // Config file not found or unreadable
            }
          },
          applied: false,
          timestamp: new Date().toISOString(),
        });
      }

      if (data.CLS > 0.1) {
        optimizations.push({
          type: "layout_stability",
          description: `CLS high (${data.CLS}). Fix layout shifts.`,
          action: async () => {
            console.log("📝 Recommendation: Add explicit dimensions to images and reserve space for dynamic content");
          },
          applied: false,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  // Apply safe optimizations (read-only recommendations for now)
  console.log(`\n📋 Found ${optimizations.length} optimization opportunity(ies):\n`);

  for (const opt of optimizations) {
    console.log(`  ${opt.type}: ${opt.description}`);
    await opt.action();
  }

  // Log optimizations to a file for audit trail
  const logPath = join(process.cwd(), "optimization-log.json");
  let log: Optimization[] = [];
  try {
    const existingLog = readFileSync(logPath, "utf-8");
    log = JSON.parse(existingLog);
  } catch (e) {
    // File doesn't exist yet
  }

  log.push(...optimizations);
  writeFileSync(logPath, JSON.stringify(log, null, 2), "utf-8");

  console.log(`\n✅ Optimization analysis complete. Logged to ${logPath}`);
}

if (require.main === module) {
  analyzeAndOptimize().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { analyzeAndOptimize };
