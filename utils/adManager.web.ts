import { toast } from 'sonner-native';

class AdManager {
  private isLoading = false;

  public async showRewardedAd(onReward: () => void) {
    if (this.isLoading) return;
    this.isLoading = true;

    toast.info("🎬 [Simulation] Playing Web Ad...", { duration: 2000 });
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.isLoading = false;
        toast.success("✅ Reward granted!");
        onReward();
        resolve();
      }, 2500);
    });
  }
}

export const adManager = new AdManager();
