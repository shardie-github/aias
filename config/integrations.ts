// Type-safe access to integration flags
import integrationConfig from "@/config/integrations.json";

const integrations = integrationConfig.integrations;

export const flags = {
  vercelAnalytics: integrations.vercelAnalytics.enabled,
  plausible: integrations.plausible.enabled,
  posthog: integrations.posthog.enabled,
  clarity: integrations.clarity.enabled,
  sentry: integrations.sentry.enabled,
  cloudinary: integrations.cloudinary.enabled,
  uploadcare: integrations.uploadcare.enabled,
  lottie: integrations.lottie.enabled,
  lenis: integrations.lenis.enabled,
  framerMotion: integrations.framerMotion.enabled,
  tidio: integrations.tidio.enabled,
  crisp: integrations.crisp.enabled,
  hcaptcha: integrations.hcaptcha.enabled,
  recaptcha: integrations.recaptcha.enabled,
  pusher: integrations.pusher.enabled,
  ably: integrations.ably.enabled,
  algolia: integrations.algolia.enabled,
  meili: integrations.meili.enabled,
  trustpilot: integrations.trustpilot.enabled,
  lemonSqueezy: integrations.lemonSqueezy.enabled,
};

export default flags;