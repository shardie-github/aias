/**
 * Alert Notification Utility
 * Sends alerts to configured webhooks when regressions persist 3+ cycles
 * Never echoes secret values - only references secret names
 */

import { env } from "@/lib/env";

export interface AlertPayload {
  type: "reliability" | "security" | "cost";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  metrics?: Record<string, any>;
  runbook?: string;
  dashboard?: string;
}

/**
 * Get webhook URL from environment variable
 * Returns undefined if secret not configured
 */
function getWebhookUrl(type: "reliability" | "security" | "cost"): string | undefined {
  const secretName = type === "reliability" 
    ? "RELIABILITY_ALERT_WEBHOOK"
    : type === "security"
    ? "SECURITY_ALERT_WEBHOOK"
    : "COST_ALERT_WEBHOOK";

  // Access via env - never echo the actual value
  const webhookUrl = process.env[secretName];
  return webhookUrl;
}

/**
 * Send alert to configured webhook
 * Returns true if sent successfully, false if webhook not configured
 */
export async function sendAlert(payload: AlertPayload): Promise<boolean> {
  const webhookUrl = getWebhookUrl(payload.type);
  
  if (!webhookUrl) {
    console.warn(`[Alert] Webhook not configured for type: ${payload.type}`);
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `🚨 ${payload.severity.toUpperCase()}: ${payload.title}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${payload.title}*\n${payload.message}`,
            },
          },
          ...(payload.metrics
            ? [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "```\n" + JSON.stringify(payload.metrics, null, 2) + "\n```",
                  },
                },
              ]
            : []),
          ...(payload.runbook
            ? [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `📖 Runbook: ${payload.runbook}`,
                  },
                },
              ]
            : []),
          ...(payload.dashboard
            ? [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `📊 Dashboard: ${payload.dashboard}`,
                  },
                },
              ]
            : []),
        ],
      }),
    });

    if (!response.ok) {
      console.error(`[Alert] Webhook returned ${response.status}: ${response.statusText}`);
      return false;
    }

    console.log(`[Alert] Successfully sent ${payload.type} alert`);
    return true;
  } catch (error: any) {
    console.error(`[Alert] Failed to send ${payload.type} alert:`, error.message);
    return false;
  }
}

/**
 * Check if regression has persisted for N cycles
 * Used by agent to determine when to send alerts
 */
export function shouldAlert(regressionCount: number, threshold: number = 3): boolean {
  return regressionCount >= threshold;
}

/**
 * Format alert payload for reliability regression
 */
export function createReliabilityAlert(
  metric: string,
  current: number,
  target: number,
  cycles: number
): AlertPayload {
  return {
    type: "reliability",
    severity: current > target * 1.5 ? "high" : "medium",
    title: `Performance Regression: ${metric}`,
    message: `${metric} has exceeded SLO for ${cycles} cycles.\nCurrent: ${current}, Target: ${target}`,
    metrics: {
      metric,
      current,
      target,
      cycles,
    },
    runbook: "docs/runbooks/api-latency.md",
    dashboard: "/admin/metrics",
  };
}

/**
 * Format alert payload for security incident
 */
export function createSecurityAlert(
  issue: string,
  severity: "low" | "medium" | "high" | "critical",
  details?: Record<string, any>
): AlertPayload {
  return {
    type: "security",
    severity,
    title: `Security Alert: ${issue}`,
    message: details ? JSON.stringify(details, null, 2) : issue,
    metrics: details,
    runbook: "docs/runbooks/db-hotspot.md",
    dashboard: "/admin/compliance",
  };
}

/**
 * Format alert payload for cost overrun
 */
export function createCostAlert(
  service: string,
  current: number,
  budget: number,
  percentage: number
): AlertPayload {
  return {
    type: "cost",
    severity: percentage > 150 ? "high" : percentage > 120 ? "medium" : "low",
    title: `Budget Alert: ${service}`,
    message: `${service} spending is ${percentage.toFixed(0)}% of budget.\nCurrent: $${current}, Budget: $${budget}`,
    metrics: {
      service,
      current,
      budget,
      percentage,
    },
    dashboard: "/admin/metrics",
  };
}
