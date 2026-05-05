import { Platform } from 'react-native';
import { toast } from 'sonner-native';
import { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';

// Replace with your real Ad Unit IDs from AdMob console
// Using TestIds for now so you don't get banned during testing
const AD_UNIT_ID = Platform.select({
  ios: TestIds.REWARDED,
  android: "ca-app-pub-5995980776712766/2113805866",
}) || '';

class AdManager {
  private rewardedAd: RewardedAd | null = null;
  private isLoaded = false;
  private isLoading = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['games', 'puzzles', 'brain'],
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('Ad Loaded');
        this.isLoaded = true;
        this.isLoading = false;
      });

      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Ad Error:', error);
        this.isLoaded = false;
        this.isLoading = false;
        // Attempt to reload after a delay
        setTimeout(() => this.load(), 5000);
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward of ', reward);
        this.isLoaded = false;
        this.load(); // Preload next ad
      });

      this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        this.isLoaded = false;
        this.load(); // Preload next ad
      });

      this.load();
    } catch (e) {
      console.error("Ad initialization failed", e);
    }
  }

  private load() {
    if (this.isLoading || this.isLoaded || !this.rewardedAd) return;
    this.isLoading = true;
    try {
      this.rewardedAd.load();
    } catch (e) {
      this.isLoading = false;
    }
  }

  /**
   * Shows the rewarded ad and executes onReward callback only on success.
   */
  public async showRewardedAd(onReward: () => void) {
    if (!this.isLoaded || !this.rewardedAd) {
      this.load();
      toast.info("Ad is still loading. Please try again in 5 seconds.");
      return;
    }

    try {
      // We set up a one-time listener for this specific show call
      const unsubscribe = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          onReward();
          unsubscribe();
        }
      );

      await this.rewardedAd.show();
    } catch (error) {
      console.error("Failed to show ad:", error);
      toast.error("Could not play ad. Please check your connection.");
      this.load();
    }
  }
}

export const adManager = new AdManager();
