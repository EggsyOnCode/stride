import type { ExpoConfig } from 'expo/config';

// Single source of truth: the version in package.json drives both the
// user-facing version name and the Android versionCode (monotonic integer).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json') as { version: string };
const [major, minor, patch] = pkg.version.split('.').map((n) => parseInt(n, 10) || 0);
const androidVersionCode = major * 10000 + minor * 100 + patch;

const config: ExpoConfig = {
  name: 'Stride',
  slug: 'stride',
  version: pkg.version,
  orientation: 'portrait',
  icon: './assets/icon_manzil.png',
  userInterfaceStyle: 'automatic',
  scheme: 'stride',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.stride.stride',
  },
  android: {
    package: 'com.stride.stride',
    versionCode: androidVersionCode,
    predictiveBackGestureEnabled: true,
    softwareKeyboardLayoutMode: 'resize',
    permissions: [
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.SCHEDULE_EXACT_ALARM',
    ],
    adaptiveIcon: {
      backgroundColor: '#1a1f3c',
      foregroundImage: './assets/icon-foreground.png',
      monochromeImage: './assets/icon-monochrome.png',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    './plugins/withNotifeeMaven.js',
    './plugins/withReleaseSigning.js',
    '@lovesworking/watermelondb-expo-plugin-sdk-52-plus',
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 24,
          packagingOptions: {
            pickFirst: ['**/libc++_shared.so'],
          },
        },
      },
    ],
    'expo-document-picker',
  ],
};

export default config;
