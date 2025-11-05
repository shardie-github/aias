"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useConsent } from "@/app/providers/consent-provider";
import flags from "@/config/integrations";

// Lazy load analytics only when consent is granted
// Handle cases where packages aren't installed
const VercelAnalytics = dynamic(
  () => import("@vercel/analytics/react").then(m => m.Analytics).catch(() => null),
  { ssr: false }
);
const VercelSpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then(m => m.SpeedInsights).catch(() => null),
  { ssr: false }
);

/**
 * Analytics: Loads analytics providers only when consent is granted.
 */
export function Analytics() {
  const { hasConsent } = useConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasConsent("analytics")) {
    return null;
  }

  return (
    <>
      {flags.vercelAnalytics && (
        <>
          <VercelAnalytics />
          <VercelSpeedInsights />
        </>
      )}
    </>
  );
}