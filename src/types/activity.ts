export interface DailyActivity {
  date: string; // YYYY-MM-DD
  steps: number;
  stepGoal: number;
  activeMinutes: number;
  activeMinutesGoal: number;
  caloriesBurned: number;
  distanceKm: number;
  workoutsCompleted: number;
  waterIntakeMl: number;
}

export interface DayMetricPoint {
  date: string;
  shortDay: string; // "Mon", "Tue"
  dayNumber: number; // 20
  steps: number;
  activeMinutes: number;
  calories: number;
  isToday: boolean;
  goalMet: boolean;
}

export type ProgressPeriod = 'Day' | 'Week' | 'Month';
export type ProgressMetric = 'steps' | 'activeMinutes' | 'calories';

export interface ProgressSummary {
  period: ProgressPeriod;
  totalSteps: number;
  averageDailySteps: number;
  totalActiveMinutes: number;
  totalCalories: number;
  workoutsCompleted: number;
  currentStreakDays: number;
  completionRatePercentage: number;
  dailyPoints: DayMetricPoint[];
}
