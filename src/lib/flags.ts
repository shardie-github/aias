/**
 * Feature Flags Helper
 * Lightweight JSON-based feature flags with environment awareness
 * Used for canary releases and feature toggles
 */

import flagsConfig from "@/config/flags.json";

export interface FeatureFlag {
  enabled: boolean;
  env: "development" | "staging" | "production";
  description?: string;
  created?: string;
}

export interface FlagsConfig {
  flags: Record<string, FeatureFlag>;
  environments: {
    development: { default: boolean };
    staging: { default: boolean };
    production: { default: boolean };
  };
}

/**
 * Get current environment
 */
function getCurrentEnv(): "development" | "staging" | "production" {
  if (typeof process !== "undefined") {
    const env = process.env.NODE_ENV || process.env.NEXT_PUBLIC_APP_ENV || "production";
    if (env === "development") return "development";
    if (env === "staging" || env === "preview") return "staging";
  }
  return "production";
}

/**
 * Check if a feature flag is enabled
 * Respects environment restrictions (staging-only flags won't work in production)
 */
export function isFlagEnabled(flagKey: string): boolean {
  const flag = (flagsConfig as FlagsConfig).flags[flagKey];
  
  if (!flag) {
    // Flag doesn't exist, return false
    return false;
  }

  const currentEnv = getCurrentEnv();
  
  // Check if flag is restricted to specific environment
  if (flag.env && flag.env !== currentEnv) {
    // Flag is restricted to a different environment
    return false;
  }

  return flag.enabled;
}

/**
 * Get flag configuration
 */
export function getFlag(flagKey: string): FeatureFlag | null {
  const flag = (flagsConfig as FlagsConfig).flags[flagKey];
  return flag || null;
}

/**
 * Get all flags for current environment
 */
export function getAllFlags(): Record<string, boolean> {
  const currentEnv = getCurrentEnv();
  const result: Record<string, boolean> = {};
  
  for (const [key, flag] of Object.entries((flagsConfig as FlagsConfig).flags)) {
    // Only include flags that are allowed in current environment
    if (!flag.env || flag.env === currentEnv) {
      result[key] = flag.enabled;
    }
  }
  
  return result;
}

/**
 * Check if canary flag is enabled (for agent use)
 * Used by agent to enable canary features in staging
 */
export function isCanaryEnabled(flagKey: string = "canary_example"): boolean {
  const currentEnv = getCurrentEnv();
  
  // Canary flags only work in staging
  if (currentEnv !== "staging") {
    return false;
  }
  
  return isFlagEnabled(flagKey);
}

/**
 * Get flag metadata (for debugging/admin)
 */
export function getFlagMetadata(): {
  currentEnv: string;
  flags: Record<string, FeatureFlag>;
  enabledFlags: string[];
} {
  const currentEnv = getCurrentEnv();
  const enabledFlags: string[] = [];
  
  for (const [key, flag] of Object.entries((flagsConfig as FlagsConfig).flags)) {
    if (isFlagEnabled(key)) {
      enabledFlags.push(key);
    }
  }
  
  return {
    currentEnv,
    flags: (flagsConfig as FlagsConfig).flags,
    enabledFlags,
  };
}
