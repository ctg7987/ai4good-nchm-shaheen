/**
 * Usage Tracking Service
 * Tracks user activity to enforce free tier limits and show upgrade prompts
 */

interface UsageData {
  comicsGenerated: number;
  breathingExercisesCompleted: number;
  lastResetDate: string;
  isPremium: boolean;
  premiumExpiryDate?: string;
}

const STORAGE_KEY = 'shaheen_usage_data';

// Free tier limits
export const FREE_TIER_LIMITS = {
  comicsPerMonth: 5,
  breathingExercises: 3, // Only 3 types available
  maxJournalEntries: 10,
};

// Premium features
export const PREMIUM_FEATURES = {
  unlimitedComics: true,
  allBreathingExercises: true, // 6 types instead of 3
  unlimitedJournal: true,
  prioritySupport: true,
  offlineMode: true,
  customThemes: true,
  exportData: true,
  aiInsights: true,
  voiceJournaling: true,
  groupSupport: true,
  meditationLibrary: true,
  progressAnalytics: true,
};

class UsageTrackerService {
  private getDefaultData(): UsageData {
    return {
      comicsGenerated: 0,
      breathingExercisesCompleted: 0,
      lastResetDate: new Date().toISOString(),
      isPremium: false,
    };
  }

  private getData(): UsageData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return this.getDefaultData();
      
      const data = JSON.parse(stored) as UsageData;
      
      // Check if we need to reset monthly counters
      const lastReset = new Date(data.lastResetDate);
      const now = new Date();
      
      if (now.getMonth() !== lastReset.getMonth() || 
          now.getFullYear() !== lastReset.getFullYear()) {
        // New month - reset counters
        data.comicsGenerated = 0;
        data.breathingExercisesCompleted = 0;
        data.lastResetDate = now.toISOString();
        this.saveData(data);
      }
      
      return data;
    } catch (error) {
      console.error('Error reading usage data:', error);
      return this.getDefaultData();
    }
  }

  private saveData(data: UsageData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  }

  // Check if user is premium
  isPremium(): boolean {
    const data = this.getData();
    
    // Check if premium expired
    if (data.isPremium && data.premiumExpiryDate) {
      const expiryDate = new Date(data.premiumExpiryDate);
      if (new Date() > expiryDate) {
        data.isPremium = false;
        data.premiumExpiryDate = undefined;
        this.saveData(data);
        return false;
      }
    }
    
    return data.isPremium;
  }

  // Comics
  getComicsRemaining(): number {
    if (this.isPremium()) return Infinity;
    const data = this.getData();
    return Math.max(0, FREE_TIER_LIMITS.comicsPerMonth - data.comicsGenerated);
  }

  canGenerateComic(): boolean {
    if (this.isPremium()) return true;
    return this.getComicsRemaining() > 0;
  }

  trackComicGenerated(): boolean {
    if (this.isPremium()) return true;
    
    const data = this.getData();
    if (data.comicsGenerated >= FREE_TIER_LIMITS.comicsPerMonth) {
      return false; // Hit limit
    }
    
    data.comicsGenerated++;
    this.saveData(data);
    return true;
  }

  getComicsGenerated(): number {
    return this.getData().comicsGenerated;
  }

  // Breathing exercises
  getBreathingExercisesAvailable(): number {
    return this.isPremium() ? 6 : 3;
  }

  // Premium management
  activatePremium(durationMonths: number = 1): void {
    const data = this.getData();
    data.isPremium = true;
    
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
    data.premiumExpiryDate = expiryDate.toISOString();
    
    this.saveData(data);
  }

  // For demo purposes - simulate premium trial
  startFreeTrial(): void {
    this.activatePremium(0.25); // 7-day trial (0.25 months ≈ 7 days)
  }

  // Get usage stats for display
  getUsageStats() {
    const data = this.getData();
    return {
      comicsGenerated: data.comicsGenerated,
      comicsLimit: FREE_TIER_LIMITS.comicsPerMonth,
      comicsRemaining: this.getComicsRemaining(),
      breathingExercisesAvailable: this.getBreathingExercisesAvailable(),
      isPremium: this.isPremium(),
      premiumExpiryDate: data.premiumExpiryDate,
    };
  }

  // Reset everything (for testing)
  resetUsage(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const UsageTracker = new UsageTrackerService();
