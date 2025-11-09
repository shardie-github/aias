"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsData {
  performance: {
    webVitals: {
      LCP?: number;
      CLS?: number;
      INP?: number;
      TTFB?: number;
      FCP?: number;
    };
    supabase: {
      avgLatencyMs?: number;
      queryTime?: number;
      rowCount?: number;
    };
    expo: {
      bundleMB?: number;
      duration?: number;
      buildSuccess?: boolean;
    };
    ci: {
      avgBuildMin?: number;
      successRate?: number;
      queueLength?: number;
    };
  };
  status: "healthy" | "degraded" | "error";
  lastUpdated: string;
  sources?: Record<string, any>;
  trends?: Record<string, any>;
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
    // Refresh every 60 seconds
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMetrics() {
    try {
      const response = await fetch("/api/metrics");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to fetch metrics:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle>Error Loading Metrics</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">No metrics available</div>
      </div>
    );
  }

  const statusColor =
    metrics.status === "healthy"
      ? "text-green-600"
      : metrics.status === "degraded"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Intelligence Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time metrics from all connected services
          </p>
        </div>
        <div className="text-right">
          <div className={`text-lg font-semibold ${statusColor}`}>
            Status: {metrics.status.toUpperCase()}
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Web Vitals</CardTitle>
          <CardDescription>Core Web Vitals from Vercel Analytics & Telemetry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="LCP (Largest Contentful Paint)"
              value={metrics.performance.webVitals.LCP}
              unit="ms"
              good={metrics.performance.webVitals.LCP ? metrics.performance.webVitals.LCP <= 2500 : undefined}
              threshold={2500}
            />
            <MetricCard
              label="CLS (Cumulative Layout Shift)"
              value={metrics.performance.webVitals.CLS}
              unit=""
              good={metrics.performance.webVitals.CLS ? metrics.performance.webVitals.CLS <= 0.1 : undefined}
              threshold={0.1}
            />
            <MetricCard
              label="INP (Interaction to Next Paint)"
              value={metrics.performance.webVitals.INP}
              unit="ms"
              good={metrics.performance.webVitals.INP ? metrics.performance.webVitals.INP <= 200 : undefined}
              threshold={200}
            />
            <MetricCard
              label="TTFB (Time to First Byte)"
              value={metrics.performance.webVitals.TTFB}
              unit="ms"
              good={metrics.performance.webVitals.TTFB ? metrics.performance.webVitals.TTFB <= 800 : undefined}
              threshold={800}
            />
            <MetricCard
              label="FCP (First Contentful Paint)"
              value={metrics.performance.webVitals.FCP}
              unit="ms"
              good={metrics.performance.webVitals.FCP ? metrics.performance.webVitals.FCP <= 1800 : undefined}
              threshold={1800}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supabase Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase Performance</CardTitle>
          <CardDescription>Database query performance and latency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Average Latency"
              value={metrics.performance.supabase.avgLatencyMs}
              unit="ms"
              good={metrics.performance.supabase.avgLatencyMs ? metrics.performance.supabase.avgLatencyMs <= 200 : undefined}
            />
            <MetricCard
              label="Query Time"
              value={metrics.performance.supabase.queryTime}
              unit="ms"
            />
            <MetricCard
              label="Row Count"
              value={metrics.performance.supabase.rowCount}
              unit="rows"
            />
          </div>
        </CardContent>
      </Card>

      {/* Expo Metrics */}
      {metrics.performance.expo.bundleMB && (
        <Card>
          <CardHeader>
            <CardTitle>Expo Build Metrics</CardTitle>
            <CardDescription>Mobile app bundle size and build performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                label="Bundle Size"
                value={metrics.performance.expo.bundleMB}
                unit="MB"
                good={metrics.performance.expo.bundleMB ? metrics.performance.expo.bundleMB <= 30 : undefined}
                threshold={30}
              />
              <MetricCard
                label="Build Duration"
                value={metrics.performance.expo.duration}
                unit="min"
              />
              <MetricCard
                label="Build Success"
                value={metrics.performance.expo.buildSuccess ? "Yes" : "No"}
                good={metrics.performance.expo.buildSuccess}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* CI Metrics */}
      {metrics.performance.ci.avgBuildMin && (
        <Card>
          <CardHeader>
            <CardTitle>CI/CD Performance</CardTitle>
            <CardDescription>GitHub Actions build times and success rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                label="Average Build Time"
                value={metrics.performance.ci.avgBuildMin}
                unit="min"
              />
              <MetricCard
                label="Success Rate"
                value={metrics.performance.ci.successRate}
                unit="%"
                good={metrics.performance.ci.successRate ? metrics.performance.ci.successRate >= 95 : undefined}
              />
              <MetricCard
                label="Queue Length"
                value={metrics.performance.ci.queueLength}
                unit="pending"
                good={metrics.performance.ci.queueLength ? metrics.performance.ci.queueLength <= 3 : undefined}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trends */}
      {metrics.trends && Object.keys(metrics.trends).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>7-Day Trends</CardTitle>
            <CardDescription>Moving averages and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics.trends).map(([source, trend]: [string, any]) => (
                <div key={source} className="border-b pb-4 last:border-0">
                  <div className="font-semibold capitalize mb-2">{source}</div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Average:</span>{" "}
                      <span className="font-mono">{trend.average?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Min:</span>{" "}
                      <span className="font-mono">{trend.min?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max:</span>{" "}
                      <span className="font-mono">{trend.max?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Samples:</span>{" "}
                      <span className="font-mono">{trend.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw JSON View */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Metrics Data</CardTitle>
          <CardDescription>JSON representation of all collected metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  good,
  threshold,
}: {
  label: string;
  value?: number | string;
  unit?: string;
  good?: boolean;
  threshold?: number;
}) {
  if (value === undefined || value === null) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold mt-2">—</div>
      </div>
    );
  }

  const displayValue = typeof value === "number" ? value.toFixed(2) : value;
  const colorClass =
    good === undefined
      ? "text-foreground"
      : good
      ? "text-green-600"
      : "text-red-600";

  return (
    <div className="p-4 border rounded-lg">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-2 ${colorClass}`}>
        {displayValue}
        {unit && <span className="text-lg ml-1">{unit}</span>}
      </div>
      {threshold !== undefined && typeof value === "number" && (
        <div className="text-xs text-muted-foreground mt-1">
          Threshold: {threshold}{unit}
        </div>
      )}
    </div>
  );
}
