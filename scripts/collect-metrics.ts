#!/usr/bin/env tsx
/**
 * Performance Metrics Collection Script
 * Collects metrics from Vercel, Supabase, Expo, and GitHub Actions
 * Stores them in Supabase metrics_log table
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "../lib/env";

interface MetricSource {
  source: string;
  metric: Record<string, any>;
}

async function collectVercelMetrics(): Promise<MetricSource | null> {
  try {
    // Try to pull Vercel analytics (requires Vercel CLI)
    const { execSync } = require("child_process");
    
    if (!env.vercel.token) {
      console.warn("⚠️  VERCEL_TOKEN not set, skipping Vercel metrics");
      return null;
    }

    // In production, you'd use: vercel analytics pull --json
    // For now, we'll simulate or use Vercel API
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;
    if (!vercelProjectId) {
      console.warn("⚠️  VERCEL_PROJECT_ID not set, skipping Vercel metrics");
      return null;
    }

    // Fetch from Vercel Analytics API
    const response = await fetch(
      `https://vercel.com/api/v1/analytics/${vercelProjectId}`,
      {
        headers: {
          Authorization: `Bearer ${env.vercel.token}`,
        },
      }
    ).catch(() => null);

    if (!response || !response.ok) {
      console.warn("⚠️  Could not fetch Vercel analytics");
      return null;
    }

    const data = await response.json().catch(() => null);
    if (!data) return null;

    return {
      source: "vercel",
      metric: {
        LCP: data.lcp || null,
        CLS: data.cls || null,
        INP: data.inp || null,
        TTFB: data.ttfb || null,
        FCP: data.fcp || null,
        errors: data.errors || 0,
        pageViews: data.pageViews || 0,
      },
    };
  } catch (error: any) {
    console.error("Error collecting Vercel metrics:", error.message);
    return null;
  }
}

async function collectSupabaseMetrics(): Promise<MetricSource | null> {
  try {
    const supabase = createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey
    );

    // Test query performance
    const startTime = Date.now();
    const { data, error } = await supabase
      .from("metrics_log")
      .select("id")
      .limit(1);
    const queryTime = Date.now() - startTime;

    if (error) {
      console.warn("⚠️  Supabase query test failed:", error.message);
      return null;
    }

    // Get table stats
    const { count } = await supabase
      .from("metrics_log")
      .select("*", { count: "exact", head: true });

    return {
      source: "supabase",
      metric: {
        avgLatencyMs: queryTime,
        queryTime: queryTime,
        rowCount: count || 0,
        edgeLatency: queryTime, // Approximate
      },
    };
  } catch (error: any) {
    console.error("Error collecting Supabase metrics:", error.message);
    return null;
  }
}

async function collectExpoMetrics(): Promise<MetricSource | null> {
  try {
    // Check if EAS CLI is available
    const { execSync } = require("child_process");
    
    try {
      // Try to get latest build info
      const output = execSync("eas build:list --json --limit=1", {
        encoding: "utf-8",
        stdio: "pipe",
      });
      
      const builds = JSON.parse(output);
      if (!builds || builds.length === 0) {
        return null;
      }

      const latestBuild = builds[0];
      const bundleSizeMB = latestBuild.artifacts?.buildSize
        ? latestBuild.artifacts.buildSize / (1024 * 1024)
        : null;

      return {
        source: "expo",
        metric: {
          bundleMB: bundleSizeMB,
          duration: latestBuild.duration || null,
          buildSuccess: latestBuild.status === "finished",
          buildId: latestBuild.id,
        },
      };
    } catch (e: any) {
      if (e.message.includes("eas: command not found")) {
        console.warn("⚠️  EAS CLI not found, skipping Expo metrics");
        return null;
      }
      throw e;
    }
  } catch (error: any) {
    console.error("Error collecting Expo metrics:", error.message);
    return null;
  }
}

async function collectCIMetrics(): Promise<MetricSource | null> {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY || "your-org/aias-platform";

    if (!githubToken) {
      console.warn("⚠️  GITHUB_TOKEN not set, skipping CI metrics");
      return null;
    }

    // Fetch recent workflow runs
    const response = await fetch(
      `https://api.github.com/repos/${repo}/actions/runs?per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      console.warn("⚠️  Could not fetch GitHub Actions runs");
      return null;
    }

    const data = await response.json();
    const runs = data.workflow_runs || [];

    if (runs.length === 0) {
      return null;
    }

    const successfulRuns = runs.filter((r: any) => r.conclusion === "success");
    const successRate = (successfulRuns.length / runs.length) * 100;

    const durations = runs
      .map((r: any) => {
        const start = new Date(r.created_at).getTime();
        const end = new Date(r.updated_at).getTime();
        return (end - start) / 1000 / 60; // minutes
      })
      .filter((d: number) => !isNaN(d));

    const avgBuildMin =
      durations.length > 0
        ? durations.reduce((a: number, b: number) => a + b, 0) / durations.length
        : null;

    const pendingRuns = runs.filter(
      (r: any) => r.status === "queued" || r.status === "in_progress"
    ).length;

    return {
      source: "ci",
      metric: {
        avgBuildMin: avgBuildMin,
        successRate: successRate,
        queueLength: pendingRuns,
        totalRuns: runs.length,
      },
    };
  } catch (error: any) {
    console.error("Error collecting CI metrics:", error.message);
    return null;
  }
}

async function storeMetrics(metrics: MetricSource[]) {
  const supabase = createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey
  );

  for (const metric of metrics) {
    const { error } = await supabase.from("metrics_log").insert({
      source: metric.source,
      metric: metric.metric,
    });

    if (error) {
      console.error(`Error storing ${metric.source} metrics:`, error);
    } else {
      console.log(`✅ Stored ${metric.source} metrics`);
    }
  }
}

async function main() {
  console.log("🔍 Collecting performance metrics...\n");

  const metrics: MetricSource[] = [];

  // Collect from all sources
  const [vercel, supabase, expo, ci] = await Promise.all([
    collectVercelMetrics(),
    collectSupabaseMetrics(),
    collectExpoMetrics(),
    collectCIMetrics(),
  ]);

  if (vercel) metrics.push(vercel);
  if (supabase) metrics.push(supabase);
  if (expo) metrics.push(expo);
  if (ci) metrics.push(ci);

  if (metrics.length === 0) {
    console.warn("⚠️  No metrics collected");
    process.exit(0);
  }

  // Store in Supabase
  await storeMetrics(metrics);

  console.log(`\n✅ Collected and stored ${metrics.length} metric sources`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { collectVercelMetrics, collectSupabaseMetrics, collectExpoMetrics, collectCIMetrics };
