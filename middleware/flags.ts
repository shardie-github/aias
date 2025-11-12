// middleware/flags.ts
// Simple feature flag handler for server-side and client-side

import flagsData from "../featureflags/flags.json";

interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rollout_percentage: number;
  target_users: string[];
  metadata: {
    experiment_id?: string;
    owner?: string;
    created_at?: string;
  };
}

const flags: FeatureFlag[] = flagsData.flags;

/**
 * Check if a feature flag is enabled
 * @param key - Feature flag key
 * @param userId - Optional user ID for user-specific flags
 * @returns boolean
 */
export function isFlagEnabled(key: string, userId?: string): boolean {
  const flag = flags.find((f) => f.key === key);
  if (!flag) return false;

  // Check if flag is globally enabled
  if (!flag.enabled) return false;

  // Check if user is in target list
  if (userId && flag.target_users.length > 0) {
    return flag.target_users.includes(userId);
  }

  // Check rollout percentage
  if (flag.rollout_percentage < 100) {
    // Simple hash-based rollout (deterministic per user)
    if (userId) {
      const hash = simpleHash(userId + key);
      const percentage = (hash % 100) + 1;
      return percentage <= flag.rollout_percentage;
    }
    // No user ID, use random (for anonymous users)
    return Math.random() * 100 <= flag.rollout_percentage;
  }

  return true;
}

/**
 * Get all enabled flags for a user
 * @param userId - Optional user ID
 * @returns Array of enabled flag keys
 */
export function getEnabledFlags(userId?: string): string[] {
  return flags.filter((flag) => isFlagEnabled(flag.key, userId)).map((flag) => flag.key);
}

/**
 * Get flag metadata
 * @param key - Feature flag key
 * @returns Flag metadata or null
 */
export function getFlagMetadata(key: string): FeatureFlag | null {
  return flags.find((f) => f.key === key) || null;
}

/**
 * Simple hash function for deterministic rollout
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Server-side usage example:
// if (isFlagEnabled('api_billing_enabled', userId)) {
//   // Enable API billing
// }

// Client-side usage example:
// const enabled = isFlagEnabled('usage_tiers_enabled', user.id);
// if (enabled) {
//   // Show usage-based pricing
// }

export default {
  isFlagEnabled,
  getEnabledFlags,
  getFlagMetadata,
};
