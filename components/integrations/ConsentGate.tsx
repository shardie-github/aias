"use client";

import React, { ReactNode } from "react";
import { useConsent } from "@/app/providers/consent-provider";

type ConsentKey = "analytics" | "marketing" | "functional";

interface ConsentGateProps {
  children: ReactNode;
  requireKey: ConsentKey;
  fallback?: ReactNode;
}

/**
 * ConsentGate: Wraps components that require user consent.
 * Only renders children if the required consent type is granted.
 */
export default function ConsentGate({ children, requireKey, fallback = null }: ConsentGateProps) {
  const { hasConsent } = useConsent();
  const granted = hasConsent(requireKey);

  if (!granted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}