import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserSettings } from '@/types/user';
import { CompletedWorkoutSession } from '@/types/workout';
import { DailyActivity } from '@/types/activity';
import { DEFAULT_SETTINGS, DEFAULT_USER, STORAGE_KEYS } from '@/constants/defaults';
import { MOCK_TODAY_ACTIVITY, MOCK_WORKOUT_HISTORY } from '@/data/mockActivities';

class StorageService {
  /**
   * Generic get method with JSON parsing and fallback
   */
  async getItem<T>(key: string, fallback: T): Promise<T> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to read key: ${key}`, error);
      return fallback;
    }
  }

  /**
   * Generic set method with JSON serialization
   */
  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[StorageService] Failed to write key: ${key}`, error);
      return false;
    }
  }

  /**
   * Generic remove method
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[StorageService] Failed to remove key: ${key}`, error);
      return false;
    }
  }

  // --- User Profile ---
  async getUserProfile(): Promise<UserProfile> {
    return this.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER);
  }

  async saveUserProfile(profile: UserProfile): Promise<boolean> {
    return this.setItem(STORAGE_KEYS.USER_PROFILE, profile);
  }

  // --- User Settings ---
  async getUserSettings(): Promise<UserSettings> {
    return this.getItem<UserSettings>(STORAGE_KEYS.USER_SETTINGS, DEFAULT_SETTINGS);
  }

  async saveUserSettings(settings: UserSettings): Promise<boolean> {
    return this.setItem(STORAGE_KEYS.USER_SETTINGS, settings);
  }

  // --- Completed Workout History ---
  async getWorkoutHistory(): Promise<CompletedWorkoutSession[]> {
    return this.getItem<CompletedWorkoutSession[]>(STORAGE_KEYS.WORKOUT_HISTORY, MOCK_WORKOUT_HISTORY);
  }

  async addCompletedWorkout(session: CompletedWorkoutSession): Promise<CompletedWorkoutSession[]> {
    const current = await this.getWorkoutHistory();
    const updated = [session, ...current];
    await this.setItem(STORAGE_KEYS.WORKOUT_HISTORY, updated);
    return updated;
  }

  // --- Daily Activity ---
  async getDailyActivity(): Promise<DailyActivity> {
    return this.getItem<DailyActivity>(STORAGE_KEYS.DAILY_ACTIVITY, MOCK_TODAY_ACTIVITY);
  }

  async saveDailyActivity(activity: DailyActivity): Promise<boolean> {
    return this.setItem(STORAGE_KEYS.DAILY_ACTIVITY, activity);
  }

  async recordWorkoutActivity(durationSeconds: number, caloriesBurned: number): Promise<DailyActivity> {
    const current = await this.getDailyActivity();
    const updated: DailyActivity = {
      ...current,
      activeMinutes: current.activeMinutes + Math.round(durationSeconds / 60),
      caloriesBurned: current.caloriesBurned + caloriesBurned,
      workoutsCompleted: current.workoutsCompleted + 1,
    };
    await this.saveDailyActivity(updated);
    return updated;
  }

  // --- Auth Session ---
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  }

  async saveAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async clearAuthSession(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // --- Seed / Reset Mock Data ---
  async seedInitialDataIfFirstTime(): Promise<void> {
    const hasSeeded = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEDED_INITIAL_DATA);
    if (!hasSeeded) {
      await this.saveUserProfile(DEFAULT_USER);
      await this.saveUserSettings(DEFAULT_SETTINGS);
      await this.setItem(STORAGE_KEYS.WORKOUT_HISTORY, MOCK_WORKOUT_HISTORY);
      await this.saveDailyActivity(MOCK_TODAY_ACTIVITY);
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEDED_INITIAL_DATA, 'true');
    }
  }

  async resetToDefaultMockData(): Promise<void> {
    await this.saveUserProfile(DEFAULT_USER);
    await this.saveUserSettings(DEFAULT_SETTINGS);
    await this.setItem(STORAGE_KEYS.WORKOUT_HISTORY, MOCK_WORKOUT_HISTORY);
    await this.saveDailyActivity(MOCK_TODAY_ACTIVITY);
  }
}

export const storageService = new StorageService();
