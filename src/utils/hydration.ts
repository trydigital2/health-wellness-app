/**
 * Daily Hydration & Fluid Balance Utilities
 * Computes customized fluid targets based on body weight, workout sweat loss,
 * climate adjustments, and monitors hourly hydration pacing.
 */

export type HydrationLevel = "Optimal" | "Good" | "Needs Water" | "Dehydrated";

export interface HydrationTargetInputs {
  weightKg: number;
  workoutDurationMinutes?: number;
  isWarmClimate?: boolean;
}

export interface HydrationStatusResult {
  consumedMl: number;
  targetMl: number;
  percentage: number;
  remainingMl: number;
  glassesCount: number; // based on standard 250ml glass
  targetGlasses: number;
  level: HydrationLevel;
  pacingInsight: string;
}

/**
 * Calculates customized daily hydration target in milliliters.
 * Base: 35 mL per kg of body weight
 * Exercise adjustment: +12 mL per minute of cardiovascular training
 * Warm climate adjustment: +350 mL
 */
export function calculateDailyHydrationTarget(inputs: HydrationTargetInputs): number {
  const { weightKg, workoutDurationMinutes = 0, isWarmClimate = false } = inputs;
  if (weightKg <= 0) return 2000; // standard fallback 2L

  const baseFluidMl = weightKg * 35;
  const exerciseFluidMl = workoutDurationMinutes * 12;
  const climateFluidMl = isWarmClimate ? 350 : 0;

  const total = baseFluidMl + exerciseFluidMl + climateFluidMl;
  // Round to nearest 50 mL
  return Math.round(total / 50) * 50;
}

/**
 * Evaluates current consumption vs daily goal and provides real-time pacing feedback.
 */
export function calculateHydrationStatus(consumedMl: number, targetMl: number): HydrationStatusResult {
  const boundedTarget = Math.max(500, targetMl);
  const boundedConsumed = Math.max(0, consumedMl);

  const percentage = Math.min(150, Math.round((boundedConsumed / boundedTarget) * 100));
  const remainingMl = Math.max(0, boundedTarget - boundedConsumed);

  const glassesCount = Math.round((boundedConsumed / 250) * 10) / 10;
  const targetGlasses = Math.ceil(boundedTarget / 250);

  let level: HydrationLevel = "Needs Water";
  let pacingInsight = "Drink a glass of water to kickstart your cellular hydration.";

  if (percentage >= 100) {
    level = "Optimal";
    pacingInsight = "Daily hydration goal achieved! Keep sipping steadily without overhydrating.";
  } else if (percentage >= 70) {
    level = "Good";
    pacingInsight = "Great progress. You are on track to meet your fluid intake target today.";
  } else if (percentage >= 40) {
    level = "Needs Water";
    pacingInsight = "Moderate deficit. Drink 250-500 mL over the next couple of hours.";
  } else {
    level = "Dehydrated";
    pacingInsight = "Low fluid intake detected. Prioritize water intake to maintain cognitive energy.";
  }

  return {
    consumedMl: boundedConsumed,
    targetMl: boundedTarget,
    percentage,
    remainingMl,
    glassesCount,
    targetGlasses,
    level,
    pacingInsight,
  };
}
