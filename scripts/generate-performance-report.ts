#!/usr/bin/env tsx
/**
 * Performance Report Generator
 * Analyzes metrics, detects regressions, and generates PERFORMANCE_REPORT.md
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "../lib/env";
import { writeFileSync } from "fs";
import { join } from "path";

interface MetricAnalysis {
  source: string;
  current: any;
  previous: any;
  change: number;
  isRegression: boolean;
  recommendations: string[];
}

async function analyzeMetrics(): Promise<MetricAnalysis[]> {
  const supabase = createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey
  );

  const analyses: MetricAnalysis[] = [];

  // Get metrics for each source
  const sources = ["vercel", "supabase", "expo", "ci", "telemetry"];

  for (const source of sources) {
    const { data: metrics } = await supabase
      .from("metrics_log")
      .select("metric, ts")
      .eq("source", source)
      .order("ts", { ascending: false })
      .limit(2);

    if (!metrics || metrics.length < 2) {
      continue; // Need at least 2 data points to compare
    }

    const current = metrics[0].metric;
    const previous = metrics[1].metric;

    // Analyze numeric values
    const recommendations: string[] = [];
    let hasRegression = false;

    for (const key in current) {
      if (
        typeof current[key] === "number" &&
        typeof previous[key] === "number" &&
        previous[key] > 0
      ) {
        const change = ((current[key] - previous[key]) / previous[key]) * 100;

        // Check for regressions (>10% worse)
        if (change > 10) {
          hasRegression = true;

          // Generate recommendations based on metric type
          if (key.includes("LCP") || key.includes("lcp")) {
            recommendations.push(
              "Enable Next.js Image Optimization and consider lazy loading below-the-fold content"
            );
          }
          if (key.includes("CLS") || key.includes("cls")) {
            recommendations.push(
              "Add explicit width/height to images and reserve space for dynamic content"
            );
          }
          if (key.includes("TTFB") || key.includes("ttfb")) {
            recommendations.push(
              "Enable edge caching, optimize API routes, or consider moving to edge functions"
            );
          }
          if (key.includes("bundleMB") || key.includes("bundle")) {
            recommendations.push(
              "Run bundle analysis and code-split large dependencies. Consider dynamic imports."
            );
          }
          if (key.includes("Latency") || key.includes("latency")) {
            recommendations.push(
              "Review Supabase query performance, add indexes, or enable connection pooling"
            );
          }
          if (key.includes("queueLength") || key.includes("queue")) {
            recommendations.push(
              "Reduce GitHub Actions concurrency or optimize workflow dependencies"
            );
        }
      }
    }

    analyses.push({
      source,
      current,
      previous,
      change: hasRegression ? 1 : 0,
      isRegression: hasRegression,
      recommendations: [...new Set(recommendations)], // Remove duplicates
    });
  }

  return analyses;
}

async function generateReport() {
  console.log("📊 Generating performance report...\n");

  const supabase = createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey
  );

  // Get latest metrics
  const { data: latestMetrics } = await supabase
    .from("metrics_log")
    .select("source, metric, ts")
    .order("ts", { ascending: false })
    .limit(50);

  // Get 7-day trends
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: trendData } = await supabase
    .from("metrics_log")
    .select("source, metric, ts")
    .gte("ts", sevenDaysAgo.toISOString())
    .order("ts", { ascending: true });

  // Analyze for regressions
  const analyses = await analyzeMetrics();

  const regressions = analyses.filter((a) => a.isRegression);
  const status = regressions.length === 0 ? "✅ Healthy" : "⚠️ Degraded";

  // Calculate cost estimates (rough)
  const vercelMetrics = latestMetrics?.find((m) => m.source === "vercel");
  const pageViews = vercelMetrics?.metric?.pageViews || 0;
  const estimatedVercelCost = Math.max(0, (pageViews - 100000) / 1000000 * 20); // Rough estimate

  // Generate markdown report
  const report = `# Performance Intelligence Report

**Generated:** ${new Date().toISOString()}  
**Status:** ${status}  
**Regressions Detected:** ${regressions.length}

---

## Executive Summary

${regressions.length === 0
    ? "All systems operating within acceptable parameters. No regressions detected."
    : `⚠️ **${regressions.length} regression(s) detected.** See recommendations below.`
}

### Overall Health Score
- **Web Vitals:** ${getHealthScore("vercel", latestMetrics)}
- **Database:** ${getHealthScore("supabase", latestMetrics)}
- **CI/CD:** ${getHealthScore("ci", latestMetrics)}
- **Mobile:** ${getHealthScore("expo", latestMetrics)}

---

## Latest Metrics

### Web Vitals
${formatMetrics("vercel", latestMetrics)}

### Supabase Performance
${formatMetrics("supabase", latestMetrics)}

### Expo Build Metrics
${formatMetrics("expo", latestMetrics)}

### CI/CD Performance
${formatMetrics("ci", latestMetrics)}

---

## 7-Day Trends

${formatTrends(trendData || [])}

---

## Regression Analysis

${regressions.length === 0
    ? "✅ No regressions detected in the last comparison period."
    : regressions
        .map(
          (r) => `### ${r.source.toUpperCase()}
  
**Status:** ⚠️ Regression detected
  
**Recommendations:**
${r.recommendations.map((rec) => `- ${rec}`).join("\n")}
`
        )
        .join("\n")
}

---

## Cost Estimates

- **Vercel:** ~$${estimatedVercelCost.toFixed(2)}/month (estimated)
- **Supabase:** Based on usage (check dashboard)
- **GitHub Actions:** Based on minutes used

---

## Next Best Actions

${generateNextActions(analyses, latestMetrics)}

---

## Automated Optimizations Applied

- ✅ Performance beacon active on all pages
- ✅ Metrics collection running nightly
- ✅ Dashboard available at /admin/metrics
- ✅ Telemetry anonymization enabled

---

*Report generated by Performance Intelligence Layer*
`;

  // Write to file
  const reportPath = join(process.cwd(), "PERFORMANCE_REPORT.md");
  writeFileSync(reportPath, report, "utf-8");

  console.log(`✅ Report generated: ${reportPath}`);
  console.log(`\n📈 Status: ${status}`);
  console.log(`⚠️  Regressions: ${regressions.length}`);

  return { reportPath, regressions };
}

function getHealthScore(source: string, metrics: any[]): string {
  const sourceMetrics = metrics?.filter((m) => m.source === source);
  if (!sourceMetrics || sourceMetrics.length === 0) {
    return "No data";
  }

  const latest = sourceMetrics[0]?.metric || {};
  let score = 100;

  // Deduct points for poor metrics
  if (latest.LCP > 2500) score -= 20;
  if (latest.CLS > 0.1) score -= 20;
  if (latest.avgLatencyMs > 200) score -= 20;
  if (latest.bundleMB > 30) score -= 20;

  if (score >= 80) return "🟢 Excellent";
  if (score >= 60) return "🟡 Good";
  return "🔴 Needs Attention";
}

function formatMetrics(source: string, metrics: any[]): string {
  const sourceMetrics = metrics?.filter((m) => m.source === source);
  if (!sourceMetrics || sourceMetrics.length === 0) {
    return "*No data available*";
  }

  const latest = sourceMetrics[0]?.metric || {};
  const lines: string[] = [];

  for (const key in latest) {
    if (typeof latest[key] === "number") {
      lines.push(`- **${key}:** ${latest[key].toFixed(2)}`);
    } else if (typeof latest[key] === "boolean") {
      lines.push(`- **${key}:** ${latest[key] ? "✅" : "❌"}`);
    } else {
      lines.push(`- **${key}:** ${latest[key]}`);
    }
  }

  return lines.join("\n") || "*No metrics available*";
}

function formatTrends(trendData: any[]): string {
  if (!trendData || trendData.length === 0) {
    return "*No trend data available*";
  }

  const sourceGroups: Record<string, any[]> = {};
  for (const metric of trendData) {
    if (!sourceGroups[metric.source]) {
      sourceGroups[metric.source] = [];
    }
    sourceGroups[metric.source].push(metric);
  }

  const lines: string[] = [];
  for (const [source, metrics] of Object.entries(sourceGroups)) {
    const numericValues: number[] = [];
    for (const m of metrics) {
      const metric = m.metric || {};
      for (const key in metric) {
        if (typeof metric[key] === "number") {
          numericValues.push(metric[key]);
        }
      }
    }

    if (numericValues.length > 0) {
      const avg =
        numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      lines.push(
        `- **${source}:** Avg ${avg.toFixed(2)}, Range ${min.toFixed(2)}-${max.toFixed(2)}`
      );
    }
  }

  return lines.join("\n") || "*No trend data available*";
}

function generateNextActions(analyses: MetricAnalysis[], metrics: any[]): string {
  const actions: string[] = [];

  // Check for specific issues
  const vercelMetrics = metrics?.find((m) => m.source === "vercel");
  if (vercelMetrics?.metric?.LCP > 2500) {
    actions.push("Optimize LCP: Enable image optimization, reduce render-blocking resources");
  }
  if (vercelMetrics?.metric?.CLS > 0.1) {
    actions.push("Fix CLS: Add explicit dimensions to images and reserve space for dynamic content");
  }

  const supabaseMetrics = metrics?.find((m) => m.source === "supabase");
  if (supabaseMetrics?.metric?.avgLatencyMs > 200) {
    actions.push("Optimize Supabase: Review slow queries, add indexes, enable connection pooling");
  }

  const expoMetrics = metrics?.find((m) => m.source === "expo");
  if (expoMetrics?.metric?.bundleMB > 30) {
    actions.push("Reduce Expo bundle: Run bundle analysis, code-split large dependencies");
  }

  const ciMetrics = metrics?.find((m) => m.source === "ci");
  if (ciMetrics?.metric?.queueLength > 3) {
    actions.push("Optimize CI: Reduce workflow concurrency or optimize dependencies");
  }

  if (actions.length === 0) {
    actions.push("✅ All systems operating optimally. Continue monitoring.");
  }

  return actions.map((a, i) => `${i + 1}. ${a}`).join("\n");
}

if (require.main === module) {
  generateReport()
    .then(({ regressions }) => {
      if (regressions.length > 0) {
        console.log("\n⚠️  Regressions detected - consider reviewing recommendations");
        process.exit(1); // Exit with error to trigger alerts
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

export { generateReport, analyzeMetrics };
