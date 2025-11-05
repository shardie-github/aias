"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ConsentKey = "analytics" | "marketing" | "functional";

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface ConsentContextType {
  consent: ConsentState;
  updateConsent: (key: ConsentKey, value: boolean) => void;
  hasConsent: (key: ConsentKey) => boolean;
  resetConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const STORAGE_KEY = "hardonia-consent";
const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  marketing: false,
  functional: true, // Functional cookies are often allowed by default
};

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsent({ ...DEFAULT_CONSENT, ...parsed });
      }
    } catch (e) {
      console.warn("Failed to load consent preferences:", e);
    }
  }, []);

  const updateConsent = (key: ConsentKey, value: boolean) => {
    setConsent((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save consent preferences:", e);
      }
      return updated;
    });
  };

  const hasConsent = (key: ConsentKey): boolean => {
    return consent[key] ?? false;
  };

  const resetConsent = () => {
    setConsent(DEFAULT_CONSENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to reset consent preferences:", e);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConsentContext.Provider value={{ consent, updateConsent, hasConsent, resetConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}