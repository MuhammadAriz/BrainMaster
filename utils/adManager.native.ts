import { Platform } from 'react-native';
import { toast } from 'sonner-native';
import { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';

// Real Ad Unit IDs
const AD_UNIT_ID = Platform.select({
  ios: TestIds.REWARDED, // Keep test ID for iOS for now
  android: "ca-app-pub-5995980776712766/2113805866", // YOUR REAL ANDROID ID
}) || '';

class AdManager {
  private rewardedAd: any = null;
  private isLoaded = false;
  private isLoading = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.isLoaded = true;
        this.isLoading = false;
        console.log('Real Ad Loaded');
      });

      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
        this.isLoaded = false;
        this.isLoading = false;
        console.warn('Ad Error:', error);
        // Retry loading after 10 seconds
        setTimeout(() => this.loadAd(), 10000);
      });

      this.loadAd();
    } catch (e) {
      console.error("AdMob Initialization Failed:", e);
    }
  }

  private loadAd() {
    if (this.isLoading || this.isLoaded || !this.rewardedAd) return;
    this.isLoading = true;
    this.rewardedAd.load();
  }

  public async showRewardedAd(onReward: () => void) {
    if (!this.isLoaded || !this.rewardedAd) {
      this.loadAd();
      toast.info("Ad is still loading... please try again in a few seconds.");
      return;
    }

    try {
      const unsubscribe = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          onReward();
          unsubscribe();
        }
      );
      
      await this.rewardedAd.show();
      
      // Pre-load the next ad immediately after showing
      this.isLoaded = false;
      this.loadAd();
    } catch (error) {
      console.error("Failed to show ad:", error);
      this.loadAd();
    }
  }
}

export const adManager = new AdManager();
