/**
 * Quiet Mode
 */

interface QuietModeConfig {
  enabled: boolean;
  degradeFeatures: string[];
  bannerMessage?: string;
  disableBilling?: boolean;
  disableAI?: boolean;
  disableWebhooks?: boolean;
}

let quietModeConfig: QuietModeConfig = {
  enabled: false,
  degradeFeatures: [],
};

export function setQuietMode(config: QuietModeConfig): void {
  quietModeConfig = config;
}

export function isQuietMode(): boolean {
  return quietModeConfig.enabled;
}

export function shouldDegradeFeature(feature: string): boolean {
  if (!quietModeConfig.enabled) {
    return false;
  }
  return quietModeConfig.degradeFeatures.includes(feature);
}

export function getBannerMessage(): string | undefined {
  return quietModeConfig.bannerMessage;
}
