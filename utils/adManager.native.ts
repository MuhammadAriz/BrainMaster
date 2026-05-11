import { Platform, Alert } from 'react-native';
import { toast } from 'sonner-native';
import mobileAds, { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';

// Force Test ID so we can verify the ad works and gives the 1 bulb reward!
const AD_UNIT_ID = TestIds.REWARDED;

class AdManager {
  private rewardedAd: any = null;
  private isLoaded = false;
  private isLoading = false;
  private isInitialized = false;

  constructor() {
    this.initMobileAds();
  }

  private async initMobileAds() {
    try {
      await mobileAds().initialize();
      this.isInitialized = true;
      this.loadAd();
    } catch (e: any) {
      console.error("Failed to initialize Google Mobile Ads SDK", e);
    }
  }

  private loadAd() {
    if (this.isLoading || this.isLoaded || !this.isInitialized) return;
    this.isLoading = true;

    try {
      // Ads MUST be recreated from scratch after being shown or if they fail.
      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.isLoaded = true;
        this.isLoading = false;
        console.log('Ad Loaded and Ready!');
      });

      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
        this.isLoaded = false;
        this.isLoading = false;
        console.warn('Ad Failed to Load:', error);
        
        // Clean up and retry in 10 seconds
        this.rewardedAd = null;
        setTimeout(() => this.loadAd(), 10000);
      });

      this.rewardedAd.load();
    } catch (e: any) {
      console.error("AdMob Initialization Failed:", e);
      this.isLoading = false;
    }
  }

  public async showRewardedAd(onReward: () => void) {
    if (!this.isLoaded || !this.rewardedAd) {
      this.loadAd();
      toast.info("Ad is still loading... please try again in a few seconds.");
      return;
    }

    try {
      // Listen for the reward
      const unsubscribeReward = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          onReward();
        }
      );

      // Listen for the ad being closed so we can destroy it and load the next one
      const unsubscribeClosed = this.rewardedAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          this.isLoaded = false;
          this.rewardedAd = null; // Destroy the old ticket
          unsubscribeReward();
          unsubscribeClosed();
          this.loadAd(); // Pre-load the next ticket
        }
      );

      await this.rewardedAd.show();
    } catch (error) {
      console.error("Failed to show ad:", error);
      this.isLoaded = false;
      this.rewardedAd = null;
      this.loadAd();
    }
  }
}

export const adManager = new AdManager();
