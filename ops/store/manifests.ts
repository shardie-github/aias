/**
 * Store Pack - App store manifests
 */

export interface AppStoreManifest {
  name: string;
  description: string;
  version: string;
  bundleId: string;
  privacyPolicyUrl: string;
  supportUrl: string;
  icon: string;
  screenshots: string[];
  categories: string[];
  ageRating: string;
}

export function generateAppStoreManifest(): AppStoreManifest {
  return {
    name: 'AIAS Platform',
    description: 'Enterprise AI consultancy platform',
    version: '1.0.0',
    bundleId: 'com.aias.platform',
    privacyPolicyUrl: 'https://aias-platform.com/privacy',
    supportUrl: 'https://aias-platform.com/support',
    icon: '/assets/app-icon.png',
    screenshots: [
      '/assets/screenshot1.png',
      '/assets/screenshot2.png',
    ],
    categories: ['Business', 'Productivity'],
    ageRating: '4+',
  };
}

export function generateGooglePlayManifest(): any {
  return {
    applicationId: 'com.aias.platform',
    versionCode: 1,
    versionName: '1.0.0',
    minSdkVersion: 21,
    targetSdkVersion: 33,
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
    ],
    features: {
      usesInternet: true,
    },
  };
}

export function generatePrivacyLabels(): any {
  return {
    dataTypes: [
      {
        type: 'Contact Info',
        purpose: 'Analytics',
        collected: true,
      },
      {
        type: 'Usage Data',
        purpose: 'Analytics',
        collected: true,
      },
      {
        type: 'Financial Info',
        purpose: 'App Functionality',
        collected: true,
      },
    ],
    tracking: [
      {
        purpose: 'Analytics',
        linked: true,
        usedForTracking: true,
      },
    ],
  };
}
