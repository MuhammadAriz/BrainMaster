import mobileAds from 'react-native-google-mobile-ads';

export async function initializeAds() {
  try {
    await mobileAds().initialize();
    console.log('AdMob Initialized');
  } catch (e) {
    console.warn('AdMob Init Error:', e);
  }
}
