"use client";

import React, { useEffect, useState } from "react";
import { useConsent } from "@/app/providers/consent-provider";

interface LiveVisitorsProps {
  className?: string;
}

/**
 * LiveVisitors: Shows live visitor count (mock for demo).
 * In production, this would connect to Pusher/Ably for real-time updates.
 */
export default function LiveVisitors({ className = "" }: LiveVisitorsProps) {
  const { hasConsent } = useConsent();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasConsent("functional")) {
      return;
    }

    // Mock: Simulate live visitor count
    const interval = setInterval(() => {
      setCount(Math.floor(Math.random() * 50) + 10);
      setLoading(false);
    }, 2000);

    return () => clearInterval(interval);
  }, [hasConsent]);

  if (!hasConsent("functional")) {
    return null;
  }

  if (loading) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        Loading visitor count...
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-sm font-medium">
        <span className="sr-only">Live visitors: </span>
        {count} {count === 1 ? "person" : "people"} viewing now
      </span>
    </div>
  );
}