import { UserProfile, UserSettings } from '@/types/user';

export const DEFAULT_USER: UserProfile = {
  id: 'demo-user-001',
  name: 'Alex Morgan',
  email: 'alex.morgan@healthwellness.demo',
  avatarUrl: undefined,
  heightCm: 175,
  weightKg: 70,
  fitnessLevel: 'Intermediate',
  primaryGoal: 'General Wellness',
  memberSince: 'October 2026',
};

export const DEFAULT_SETTINGS: UserSettings = {
  stepGoal: 10000,
  activeMinutesGoal: 45,
  weeklyWorkoutsGoal: 4,
  waterGoalMl: 2500,
  unitSystem: 'metric',
  notificationsEnabled: true,
  reminderTime: '08:30',
  reminderDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  hapticFeedback: true,
  isDemoAccount: true,
};

export const DEMO_CREDENTIALS = {
  email: 'alex@healthwellness.demo',
  password: 'Wellness2026!',
};

export const STORAGE_KEYS = {
  USER_PROFILE: '@hw_user_profile',
  USER_SETTINGS: '@hw_user_settings',
  WORKOUT_HISTORY: '@hw_workout_history',
  DAILY_ACTIVITY: '@hw_daily_activity',
  AUTH_TOKEN: '@hw_demo_auth_token',
  HAS_SEEDED_INITIAL_DATA: '@hw_has_seeded_data',
};
