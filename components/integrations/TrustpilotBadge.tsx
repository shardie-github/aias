"use client";

import React, { useEffect, useState } from "react";
import { useConsent } from "@/app/providers/consent-provider";

interface TrustpilotBadgeProps {
  className?: string;
}

/**
 * TrustpilotBadge: Displays Trustpilot rating badge.
 * Only loads when analytics consent is granted.
 */
export default function TrustpilotBadge({ className = "" }: TrustpilotBadgeProps) {
  const { hasConsent } = useConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!hasConsent("analytics")) {
      return;
    }
    setMounted(true);

    // In production, you would load Trustpilot widget script here
    // Example: const script = document.createElement('script'); ...
    // For demo, we'll just show a placeholder
  }, [hasConsent]);

  if (!hasConsent("analytics")) {
    return null;
  }

  if (!mounted) {
    return (
      <div className={`min-h-[100px] bg-muted/50 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-sm text-muted-foreground">Loading trust badge...</div>
      </div>
    );
  }

  // Placeholder for Trustpilot widget
  // In production, replace with actual Trustpilot embed code
  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-5 h-5 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Trustpilot</div>
          <div className="text-xs text-muted-foreground">4.8 out of 5 stars</div>
          <div className="text-xs text-muted-foreground mt-1">Based on 1,234 reviews</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        <a
          href="https://www.trustpilot.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Read reviews on Trustpilot
        </a>
      </div>
    </div>
  );
}