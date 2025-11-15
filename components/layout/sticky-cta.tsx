"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="font-semibold text-sm mb-1">Ready to Build Your Custom AI Platform?</div>
            <div className="text-xs text-muted-foreground">
              Schedule a strategy call • See our builds • Get a custom quote
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" asChild>
              <Link href="/demo">
                Schedule Call
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
