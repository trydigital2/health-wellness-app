export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type PrimaryGoal = 
  | 'Weight Loss' 
  | 'Muscle Gain' 
  | 'Cardio Endurance' 
  | 'General Wellness';

export type UnitSystem = 'metric' | 'imperial';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  heightCm: number;
  weightKg: number;
  fitnessLevel: FitnessLevel;
  primaryGoal: PrimaryGoal;
  memberSince: string;
}

export interface UserSettings {
  stepGoal: number;
  activeMinutesGoal: number;
  weeklyWorkoutsGoal: number;
  waterGoalMl: number;
  unitSystem: UnitSystem;
  notificationsEnabled: boolean;
  reminderTime: string; // HH:mm format, e.g., "08:30"
  reminderDays: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  hapticFeedback: boolean;
  isDemoAccount: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
