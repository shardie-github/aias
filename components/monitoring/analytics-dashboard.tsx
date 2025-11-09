"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTelemetry } from "@/lib/monitoring/enhanced-telemetry";

export function AnalyticsDashboard() {
  const { getPerformanceMetrics, getEngagement } = useTelemetry();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [engagement, setEngagement] = useState<any>(null);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("sessionId") || "current";
    const perfMetrics = getPerformanceMetrics();
    const eng = getEngagement(sessionId);
    
    setMetrics(perfMetrics);
    setEngagement(eng);
  }, [getPerformanceMetrics, getEngagement]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Page Views</CardTitle>
          <CardDescription>Total page views this session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{engagement?.pageViews || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interactions</CardTitle>
          <CardDescription>User interactions tracked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{engagement?.interactions || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
          <CardDescription>Average response time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.length > 0
              ? `${Math.round(metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length)}ms`
              : "N/A"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Total events tracked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{engagement?.events?.length || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
}
