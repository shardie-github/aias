"use client";

import { useEffect } from "react";

/**
 * Performance Beacon Component
 * Sends Web Vitals and performance metrics to /api/telemetry
 * Runs automatically on page load
 */
export function PerformanceBeacon() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Collect Web Vitals
    const vitals: Record<string, number> = {};

    // TTFB (Time to First Byte)
    if (performance.getEntriesByType) {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        vitals.ttfb = navigation.responseStart - navigation.requestStart;
        vitals.fcp = navigation.responseStart - navigation.fetchStart;
      }
    }

    // LCP (Largest Contentful Paint)
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
          sendTelemetry();
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        // PerformanceObserver not supported
      }

      // CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          vitals.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (e) {
        // PerformanceObserver not supported
      }

      // INP (Interaction to Next Paint) - polyfill needed for older browsers
      try {
        const inpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "event") {
              vitals.inp = (entry as any).processingStart - entry.startTime;
            }
          }
        });
        inpObserver.observe({ entryTypes: ["event"] });
      } catch (e) {
        // PerformanceObserver not supported
      }
    }

    // Send telemetry after page load
    function sendTelemetry() {
      const payload = {
        url: window.location.pathname,
        ...vitals,
        ts: Date.now(),
        userAgent: navigator.userAgent.substring(0, 100),
        connection: (navigator as any).connection
          ? {
              effectiveType: (navigator as any).connection.effectiveType,
              downlink: (navigator as any).connection.downlink,
            }
          : null,
      };

      // Use sendBeacon for reliable delivery
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/telemetry",
          JSON.stringify(payload)
        );
      } else {
        // Fallback to fetch
        fetch("/api/telemetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {
          // Silently fail - telemetry is best effort
        });
      }
    }

    // Send initial telemetry after a delay to capture LCP
    const timeout = setTimeout(() => {
      sendTelemetry();
    }, 5000);

    // Send on page unload
    window.addEventListener("beforeunload", () => {
      sendTelemetry();
    });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return null; // This component doesn't render anything
}
