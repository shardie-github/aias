// [STAKE+TRUST:BEGIN:status_page]
"use client";

import { useEffect, useState } from "react";

interface StatusItem {
  service: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  message?: string;
}

export default function Status() {
  const [status, setStatus] = useState<StatusItem[]>([
    { service: "API", status: "operational" },
    { service: "Database", status: "operational" },
    { service: "Authentication", status: "operational" },
    { service: "Storage", status: "operational" },
  ]);

  useEffect(() => {
    // TODO: Fetch real status from monitoring API
    // fetch("/api/status").then(r => r.json()).then(data => setStatus(data));
  }, []);

  const getStatusColor = (s: string) => {
    switch (s) {
      case "operational":
        return "text-green-600 dark:text-green-400";
      case "degraded":
        return "text-yellow-600 dark:text-yellow-400";
      case "outage":
        return "text-red-600 dark:text-red-400";
      case "maintenance":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case "operational":
        return "Operational";
      case "degraded":
        return "Degraded Performance";
      case "outage":
        return "Outage";
      case "maintenance":
        return "Maintenance";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Status & Uptime</h1>
        <p className="text-muted-foreground mt-2">
          Real-time information about system health and incidents.
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-green-600 dark:text-green-400 text-2xl">●</span>
          <h2 className="text-xl font-semibold">All Systems Operational</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          All services are running normally. No incidents reported.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Service Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {status.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{item.service}</span>
                <span className={getStatusColor(item.status)}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
              {item.message && (
                <p className="text-sm text-muted-foreground">{item.message}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Incident Communication</h2>
        <p className="text-sm text-muted-foreground mb-4">
          We communicate incidents and maintenance windows through:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>This status page</li>
          <li>Email notifications (for subscribed users)</li>
          <li>
            <a href="/docs/trust/STATUS.md" className="text-primary hover:underline">
              Incident communication policy
            </a>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          For incident reporting, contact:{" "}
          <a href="mailto:support@example.com" className="text-primary hover:underline">
            support@example.com
          </a>
        </p>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm">
          <strong>Note:</strong> This is a placeholder status page. Real-time monitoring and incident tracking will be integrated when the status_page feature flag is enabled.
        </p>
      </div>
    </div>
  );
}
// [STAKE+TRUST:END:status_page]
