#!/usr/bin/env tsx
/**
 * Regression Alerting System
 * Detects regressions and creates GitHub issues or sends webhooks
 */

import { createClient } from "@supabase/supabase-js";
import { env } from "../lib/env";

interface Regression {
  source: string;
  metric: string;
  current: number;
  previous: number;
  changePercent: number;
}

async function detectRegressions(): Promise<Regression[]> {
  const supabase = createClient(
    env.supabase.url,
    env.supabase.serviceRoleKey
  );

  const regressions: Regression[] = [];

  // Get latest metrics for each source
  const sources = ["vercel", "supabase", "expo", "ci", "telemetry"];

  for (const source of sources) {
    const { data: metrics } = await supabase
      .from("metrics_log")
      .select("metric, ts")
      .eq("source", source)
      .order("ts", { ascending: false })
      .limit(3); // Check last 3 to detect consecutive regressions

    if (!metrics || metrics.length < 2) {
      continue;
    }

    const current = metrics[0].metric;
    const previous = metrics[1].metric;

    // Check for regressions (>10% worse)
    for (const key in current) {
      if (
        typeof current[key] === "number" &&
        typeof previous[key] === "number" &&
        previous[key] > 0
      ) {
        const changePercent =
          ((current[key] - previous[key]) / previous[key]) * 100;

        // Regression: metric got worse by more than 10%
        if (changePercent > 10) {
          regressions.push({
            source,
            metric: key,
            current: current[key],
            previous: previous[key],
            changePercent,
          });
        }
      }
    }
  }

  return regressions;
}

async function createGitHubIssue(regressions: Regression[]) {
  const githubToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || "your-org/aias-platform";

  if (!githubToken) {
    console.warn("⚠️  GITHUB_TOKEN not set, skipping GitHub issue creation");
    return;
  }

  const title = "🚨 Performance Regression Detected";
  const body = `## Performance Regression Alert

**Detected:** ${new Date().toISOString()}

### Regressions Found

${regressions
    .map(
      (r) => `- **${r.source}/${r.metric}**: ${r.previous.toFixed(2)} → ${r.current.toFixed(2)} (+${r.changePercent.toFixed(1)}%)
`
    )
    .join("\n")}

### Recommended Actions

${regressions
    .map((r) => {
      if (r.metric.includes("LCP") || r.metric.includes("lcp")) {
        return `- **${r.source}/${r.metric}**: Enable image optimization, reduce render-blocking resources`;
      }
      if (r.metric.includes("CLS") || r.metric.includes("cls")) {
        return `- **${r.source}/${r.metric}**: Add explicit dimensions to images`;
      }
      if (r.metric.includes("Latency") || r.metric.includes("latency")) {
        return `- **${r.source}/${r.metric}**: Review queries, add indexes`;
      }
      if (r.metric.includes("bundle")) {
        return `- **${r.source}/${r.metric}**: Optimize bundle size`;
      }
      return `- **${r.source}/${r.metric}**: Review and optimize`;
    })
    .join("\n")}

---

*Automated by Performance Intelligence Layer*
`;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          labels: ["performance", "regression", "automated"],
        }),
      }
    );

    if (response.ok) {
      const issue = await response.json();
      console.log(`✅ Created GitHub issue: ${issue.html_url}`);
      return issue.html_url;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to create GitHub issue: ${error}`);
    }
  } catch (error: any) {
    console.error("Error creating GitHub issue:", error.message);
  }
}

async function sendWebhook(regressions: Regression[]) {
  const webhookUrl = process.env.TELEMETRY_WEBHOOK_URL;

  if (!webhookUrl) {
    return; // Webhook not configured
  }

  const payload = {
    text: `🚨 Performance Regression Detected`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Performance Regression Alert*\n\n${regressions
            .map(
              (r) =>
                `• ${r.source}/${r.metric}: ${r.previous.toFixed(2)} → ${r.current.toFixed(2)} (+${r.changePercent.toFixed(1)}%)`
            )
            .join("\n")}`,
        },
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("✅ Sent webhook notification");
  } catch (error: any) {
    console.error("Error sending webhook:", error.message);
  }
}

async function main() {
  console.log("🔍 Checking for performance regressions...\n");

  const regressions = await detectRegressions();

  if (regressions.length === 0) {
    console.log("✅ No regressions detected");
    return;
  }

  console.log(`⚠️  Found ${regressions.length} regression(s):\n`);
  for (const r of regressions) {
    console.log(
      `  ${r.source}/${r.metric}: ${r.previous.toFixed(2)} → ${r.current.toFixed(2)} (+${r.changePercent.toFixed(1)}%)`
    );
  }

  // Check for consecutive regressions (3+)
  const consecutiveRegressions = regressions.filter((r) => r.changePercent > 10);
  if (consecutiveRegressions.length >= 3) {
    console.log("\n🚨 Three or more consecutive regressions detected - creating alerts...");

    // Create GitHub issue
    await createGitHubIssue(regressions);

    // Send webhook if configured
    await sendWebhook(regressions);
  } else {
    console.log("\n⚠️  Regressions detected but not severe enough to trigger alerts");
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { detectRegressions, createGitHubIssue, sendWebhook };
