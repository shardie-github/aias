"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Lazy load Lottie only when needed
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottiePlayerProps {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * LottiePlayer: Displays Lottie animations with lazy loading and accessibility.
 * Reserves space to prevent CLS.
 */
export default function LottiePlayer({
  src,
  autoplay = true,
  loop = true,
  className = "",
  ariaLabel,
}: LottiePlayerProps) {
  const [animationData, setAnimationData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAnimation = async () => {
      try {
        setLoading(true);
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
        const data = await response.json();
        if (!cancelled) {
          setAnimationData(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load animation");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAnimation();

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (loading) {
    return (
      <div
        ref={containerRef}
        className={`flex items-center justify-center min-h-[200px] bg-muted/50 rounded-lg ${className}`}
        aria-label={ariaLabel || "Loading animation"}
        role="img"
      >
        <div className="text-sm text-muted-foreground">Loading animation...</div>
      </div>
    );
  }

  if (error || !animationData) {
    return (
      <div
        className={`flex items-center justify-center min-h-[200px] bg-muted/50 rounded-lg border border-dashed ${className}`}
        role="alert"
        aria-label={ariaLabel || "Animation error"}
      >
        <div className="text-sm text-muted-foreground">Animation unavailable</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-[200px] flex items-center justify-center ${className}`}
      role="img"
      aria-label={ariaLabel || "Animation"}
    >
      <Lottie
        animationData={animationData}
        autoplay={autoplay}
        loop={loop}
        className="w-full max-w-md"
        aria-hidden="true"
      />
    </div>
  );
}