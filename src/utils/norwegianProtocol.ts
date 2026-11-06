/**
 * 4x4 Norwegian Aerobic Protocol & Cardio Interval Engine
 * Clinically demonstrated protocol (Helgerud et al.) for maximizing VO2 Max:
 * 4 intervals of 4 minutes at 90-95% HRmax, separated by 3 minutes active recovery at 70% HRmax.
 */

export interface NorwegianProtocolSummary {
  maxHeartRate: number;
  workHeartRateRange: { min: number; max: number }; // 90-95% HRmax
  recoveryHeartRateRange: { min: number; max: number }; // ~70% HRmax
  totalDurationMinutes: number; // 40 minutes (10m warmup + 4x4m work + 3x3m recovery + 5m cooldown)
  estimatedVO2MaxGainPerBlockPct: number; // 0.5% VO2 Max increase per session block
  recommendedWeeklyFrequency: number;
  color: string;
}

export function calculateNorwegianProtocolTargets(
  age: number,
  restingHR: number = 60
): NorwegianProtocolSummary {
  const safeAge = Math.max(18, Math.min(85, age));
  // Tanaka formula for Max HR
  const maxHeartRate = Math.round(208 - 0.7 * safeAge);

  const workMin = Math.round(maxHeartRate * 0.90);
  const workMax = Math.round(maxHeartRate * 0.95);
  const recoveryMin = Math.round(maxHeartRate * 0.65);
  const recoveryMax = Math.round(maxHeartRate * 0.72);

  return {
    maxHeartRate,
    workHeartRateRange: { min: workMin, max: workMax },
    recoveryHeartRateRange: { min: recoveryMin, max: recoveryMax },
    totalDurationMinutes: 40,
    estimatedVO2MaxGainPerBlockPct: 0.5,
    recommendedWeeklyFrequency: 2,
    color: '#E11D48',
  };
}
