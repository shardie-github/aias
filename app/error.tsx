"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Application error:", error);
    
    // TODO: Send to error tracking service (e.g., Sentry, LogRocket)
    // Example:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
    
    // Track error in analytics (if available)
    if (typeof window !== 'undefined' && (window as any).va?.track) {
      (window as any).va.track('error', {
        message: error.message,
        digest: error.digest,
        stack: error.stack?.substring(0, 500), // Limit stack trace size
      });
    }
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        {error.digest && (
          <p className="text-sm text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
