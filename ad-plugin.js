const { withAndroidManifest, withAppStoreConfirmation } = require('@expo/config-plugins');

/**
 * A local config plugin to fix the AdMob crash in Expo 51.
 * This plugin avoids importing the library itself, which prevents the 'typeof' SyntaxError.
 */
module.exports = function withAdMobFixed(config, props) {
  const androidAppId = props?.androidAppId || config.android?.config?.googleMobileAdsAppId;
  const iosAppId = props?.iosAppId || config.ios?.config?.googleMobileAdsAppId;

  // 1. Android Configuration
  config = withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    
    // Ensure the meta-data exists
    if (!mainApplication['meta-data']) {
      mainApplication['meta-data'] = [];
    }

    // Remove existing if any
    mainApplication['meta-data'] = mainApplication['meta-data'].filter(
      (item) => item.$['android:name'] !== 'com.google.android.gms.ads.APPLICATION_ID'
    );

    // Add new one
    if (androidAppId) {
      mainApplication['meta-data'].push({
        $: {
          'android:name': 'com.google.android.gms.ads.APPLICATION_ID',
          'android:value': androidAppId,
        },
      });
    }

    return config;
  });

  return config;
};
