/**
 * VO2 Max & Cardiorespiratory Fitness Engine
 * Implements Uth-Sørensen-Overgaard-Pedersen & Cooper protocols,
 * Cooper Institute norm tables, and biological fitness age estimation.
 */

export type FitnessGender = 'male' | 'female';
export type VO2MaxTier = 'Poor' | 'Fair' | 'Good' | 'Excellent' | 'Superior';

export interface VO2MaxResult {
  vo2MaxScore: number; // mL/kg/min
  tier: VO2MaxTier;
  biologicalFitnessAge: number;
  fitnessAgeDelta: number; // chronological - fitness age (positive is younger/better)
  allCauseMortalityReductionPct: number;
  color: string;
  recommendation: string;
}

/**
 * Calculates VO2 Max using the resting heart rate ratio method:
 * VO2 Max = 15.3 * (HRmax / HRrest)
 */
export function calculateVO2MaxHeartRateRatio(
  maxHeartRate: number,
  restingHeartRate: number
): number {
  const safeMax = Math.max(120, Math.min(220, maxHeartRate));
  const safeRest = Math.max(38, Math.min(100, restingHeartRate));
  const vo2 = 15.3 * (safeMax / safeRest);
  return Math.round(vo2 * 10) / 10;
}

/**
 * Calculates VO2 Max using the Cooper 12-minute run test:
 * VO2 Max = (Distance in meters - 504.9) / 44.73
 */
export function calculateVO2MaxCooperRun(distanceMeters: number): number {
  const safeDistance = Math.max(800, Math.min(5000, distanceMeters));
  const vo2 = (safeDistance - 504.9) / 44.73;
  return Math.round(vo2 * 10) / 10;
}

/**
 * Classifies VO2 Max score based on Cooper Institute age and gender benchmarks.
 */
export function classifyVO2MaxTier(
  vo2Max: number,
  age: number,
  gender: FitnessGender
): { tier: VO2MaxTier; color: string } {
  // Male benchmark thresholds for (Good / Excellent / Superior)
  const isMale = gender === 'male';

  let thresholds: [number, number, number, number]; // [Fair, Good, Excellent, Superior]

  if (age < 30) {
    thresholds = isMale ? [35, 42, 51, 56] : [31, 37, 45, 50];
  } else if (age < 40) {
    thresholds = isMale ? [33, 40, 48, 54] : [29, 35, 42, 47];
  } else if (age < 50) {
    thresholds = isMale ? [31, 37, 45, 51] : [27, 33, 39, 44];
  } else if (age < 60) {
    thresholds = isMale ? [29, 35, 42, 48] : [25, 30, 36, 41];
  } else {
    thresholds = isMale ? [26, 31, 38, 44] : [22, 27, 32, 37];
  }

  if (vo2Max >= thresholds[3]) return { tier: 'Superior', color: '#8B5CF6' };
  if (vo2Max >= thresholds[2]) return { tier: 'Excellent', color: '#10B981' };
  if (vo2Max >= thresholds[1]) return { tier: 'Good', color: '#0284C7' };
  if (vo2Max >= thresholds[0]) return { tier: 'Fair', color: '#F59E0B' };
  return { tier: 'Poor', color: '#EF4444' };
}

/**
 * Estimates biological cardiorespiratory fitness age based on VO2 Max score.
 */
export function estimateFitnessAge(vo2Max: number, chronologicalAge: number, gender: FitnessGender): number {
  // Approximate standard VO2 decline of ~0.45 mL/kg/min per year after age 20
  const baselineYoungVO2 = gender === 'male' ? 48 : 42;
  const estimatedYearsAbove20 = (baselineYoungVO2 - vo2Max) / 0.45;
  const rawFitnessAge = Math.round(20 + estimatedYearsAbove20);
  return Math.max(18, Math.min(80, rawFitnessAge));
}

/**
 * Evaluates comprehensive cardiorespiratory health summary.
 */
export function evaluateCardiorespiratoryFitness(
  vo2MaxScore: number,
  chronologicalAge: number,
  gender: FitnessGender
): VO2MaxResult {
  const { tier, color } = classifyVO2MaxTier(vo2MaxScore, chronologicalAge, gender);
  const biologicalFitnessAge = estimateFitnessAge(vo2MaxScore, chronologicalAge, gender);
  const fitnessAgeDelta = chronologicalAge - biologicalFitnessAge;

  // Each 1-MET (3.5 mL/kg/min) increase is clinically associated with 11-13% lower all-cause mortality
  const mortalityReduction = Math.min(45, Math.max(0, Math.round((vo2MaxScore - 25) * 1.5)));

  let recommendation = '';
  switch (tier) {
    case 'Superior':
      recommendation = 'Elite cardiovascular conditioning. Maintain VO2 peak with polarized Zone 2 and threshold intervals.';
      break;
    case 'Excellent':
      recommendation = 'Top-tier aerobic capacity. Associated with significant longevity benefit and fast metabolic recovery.';
      break;
    case 'Good':
      recommendation = 'Optimal cardiorespiratory baseline. Incorporate 1 weekly 4x4 HIIT protocol to push into Excellent.';
      break;
    case 'Fair':
      recommendation = 'Moderate capacity. Increasing Zone 2 aerobic volume (150 min/wk) will steadily improve mitochondrial density.';
      break;
    default:
      recommendation = 'Sub-optimal aerobic reserve. Gradual progressive walking and low-impact cycling will safely raise stroke volume.';
  }

  return {
    vo2MaxScore,
    tier,
    biologicalFitnessAge,
    fitnessAgeDelta,
    allCauseMortalityReductionPct: mortalityReduction,
    color,
    recommendation,
  };
}

