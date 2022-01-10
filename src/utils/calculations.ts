import { WorkoutCategory } from '@/types/workout';
import { DayMetricPoint } from '@/types/activity';

/**
 * Metabolic Equivalent of Task (MET) estimates for workout categories
 */
const MET_VALUES: Record<string, number> = {
  Cardio: 8.0,
  Strength: 5.5,
  HIIT: 9.5,
  Flexibility: 3.0,
  Mindfulness: 1.5,
  default: 5.0,
};

/**
 * Calculates estimated calories burned using MET formula:
 * Calories = (MET * 3.5 * weightKg / 200) * durationMinutes
 */
export function calculateCaloriesBurned(
  durationSeconds: number,
  category: WorkoutCategory | string,
  weightKg: number = 70
): number {
  if (durationSeconds <= 0 || weightKg <= 0) return 0;
  const durationMinutes = durationSeconds / 60;
  const met = MET_VALUES[category] ?? MET_VALUES.default;
  const calories = (met * 3.5 * weightKg * durationMinutes) / 200;
  return Math.round(calories);
}

/**
 * Estimates distance in kilometers or miles from step count
 * Average step length is roughly 0.762 meters (0.000762 km)
 */
export function calculateStepDistance(
  steps: number,
  unitSystem: 'metric' | 'imperial' = 'metric'
): { distance: number; unit: string } {
  if (steps <= 0) {
    return { distance: 0, unit: unitSystem === 'metric' ? 'km' : 'mi' };
  }
  const km = (steps * 0.762) / 1000;
  if (unitSystem === 'imperial') {
    const miles = km * 0.621371;
    return { distance: Number(miles.toFixed(2)), unit: 'mi' };
  }
  return { distance: Number(km.toFixed(2)), unit: 'km' };
}

/**
 * Estimates active calories burned from daily steps
 * Standard approximation: ~0.04 calories per step for a 70kg individual
 */
export function calculateStepCalories(steps: number, weightKg: number = 70): number {
  if (steps <= 0 || weightKg <= 0) return 0;
  const baseRatePerStep = 0.04;
  const weightAdjustedRate = baseRatePerStep * (weightKg / 70);
  return Math.round(steps * weightAdjustedRate);
}

/**
 * Calculates percentage completion toward a target goal (0 to 100)
 */
export function calculateProgressPercentage(current: number, target: number): number {
  if (target <= 0) return 0;
  if (current <= 0) return 0;
  const pct = Math.round((current / target) * 100);
  return Math.min(100, Math.max(0, pct));
}

/**
 * Calculates unconstrained percentage for overflow display (e.g. 115%)
 */
export function calculateRawProgressPercentage(current: number, target: number): number {
  if (target <= 0) return 0;
  if (current <= 0) return 0;
  return Math.round((current / target) * 100);
}

/**
 * Calculates current consecutive streak days from metric points
 */
export function calculateStreak(points: DayMetricPoint[]): number {
  if (!points || points.length === 0) return 0;
  let streak = 0;
  // Iterate from most recent day backwards
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].goalMet || points[i].steps >= 8000) {
      streak += 1;
    } else {
      // If today is in progress, don't break streak if yesterday met goal
      if (points[i].isToday) {
        continue;
      }
      break;
    }
  }
  return streak;
}
