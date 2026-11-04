/**
 * Sleep Architecture & Circadian Recovery Analytics
 * Evaluates ultradian 90-minute sleep cycles, sleep stage proportions
 * (Deep NREM, REM, Light), sleep debt accumulation, and circadian readiness score.
 */

export interface SleepStageBreakdown {
  deepSleepMinutes: number;
  remSleepMinutes: number;
  lightSleepMinutes: number;
  awakeMinutes: number;
}

export interface SleepAnalyticsInputs {
  totalSleepMinutes: number;
  stages?: SleepStageBreakdown;
  targetSleepMinutes?: number; // standard baseline is 480 mins (8 hours)
  wakeUpTimeHour?: number; // 24-hr format (e.g. 7 for 7:00 AM)
  wakeUpTimeMinute?: number;
}

export interface SleepAnalyticsResult {
  totalHours: number;
  totalSleepMinutes: number;
  sleepEfficiencyPercent: number;
  completedCycles: number;
  deepSleepPercent: number;
  remSleepPercent: number;
  lightSleepPercent: number;
  sleepDebtMinutes: number;
  circadianReadinessScore: number;
  readinessRating: "Optimal Restoration" | "Balanced Sleep" | "Insufficient Rest" | "Critical Sleep Deficit";
  optimalBedtime: string;
  recoveryAdvice: string;
}

/**
 * Calculates detailed sleep architecture, efficiency, and circadian readiness score.
 */
export function calculateSleepAnalytics(inputs: SleepAnalyticsInputs): SleepAnalyticsResult {
  const {
    totalSleepMinutes,
    stages,
    targetSleepMinutes = 480,
    wakeUpTimeHour = 7,
    wakeUpTimeMinute = 0,
  } = inputs;

  const validSleep = Math.max(0, totalSleepMinutes);
  const awake = stages?.awakeMinutes ? Math.max(0, stages.awakeMinutes) : 0;
  const timeInBed = validSleep + awake;

  // Sleep Efficiency: (Time Asleep / Total Time in Bed) * 100
  const sleepEfficiencyPercent = timeInBed > 0
    ? Math.min(100, Math.round((validSleep / timeInBed) * 100))
    : 0;

  // 90-minute ultradian sleep cycles
  const completedCycles = Math.round((validSleep / 90) * 10) / 10;

  // Stages analysis
  const deepMinutes = stages?.deepSleepMinutes ?? Math.round(validSleep * 0.20);
  const remMinutes = stages?.remSleepMinutes ?? Math.round(validSleep * 0.22);
  const lightMinutes = stages?.lightSleepMinutes ?? Math.max(0, validSleep - deepMinutes - remMinutes);

  const deepSleepPercent = validSleep > 0 ? Math.round((deepMinutes / validSleep) * 100) : 0;
  const remSleepPercent = validSleep > 0 ? Math.round((remMinutes / validSleep) * 100) : 0;
  const lightSleepPercent = validSleep > 0 ? Math.round((lightMinutes / validSleep) * 100) : 0;

  // Sleep Debt
  const sleepDebtMinutes = Math.max(0, targetSleepMinutes - validSleep);

  // Circadian Readiness Index (0 - 100)
  // 40% duration ratio, 25% deep sleep quality (ideal 20%), 20% REM quality (ideal 20-25%), 15% efficiency
  const durationScore = Math.min(100, (validSleep / targetSleepMinutes) * 100);
  const deepScore = Math.min(100, (deepSleepPercent / 20) * 100);
  const remScore = Math.min(100, (remSleepPercent / 22) * 100);
  const efficiencyScore = sleepEfficiencyPercent;

  const compositeScore = Math.round(
    durationScore * 0.40 +
    deepScore * 0.25 +
    remScore * 0.20 +
    efficiencyScore * 0.15
  );
  const circadianReadinessScore = Math.max(0, Math.min(100, compositeScore));

  let readinessRating: SleepAnalyticsResult["readinessRating"] = "Balanced Sleep";
  let recoveryAdvice = "Good baseline recovery. Maintain consistent wake-up times to anchor circadian rhythm.";

  if (circadianReadinessScore >= 88) {
    readinessRating = "Optimal Restoration";
    recoveryAdvice = "Excellent physical and cognitive restoration. High CNS readiness for intense training.";
  } else if (circadianReadinessScore >= 72) {
    readinessRating = "Balanced Sleep";
    recoveryAdvice = "Adequate cellular repair achieved. Moderate to high athletic workloads are well-tolerated.";
  } else if (circadianReadinessScore >= 50) {
    readinessRating = "Insufficient Rest";
    recoveryAdvice = "Sub-optimal restorative sleep. Prioritize a 20-minute power nap or wind down 45 mins earlier.";
  } else {
    readinessRating = "Critical Sleep Deficit";
    recoveryAdvice = "High sleep debt detected. Restrict caffeine after 12 PM and favor active recovery over strenuous training.";
  }

  // Calculate recommended bedtime to wake up refreshed at the end of a complete 90-min cycle (default 5 cycles = 7.5 hrs + 15 min sleep latency)
  const totalMinsNeeded = 5 * 90 + 15; // 465 mins
  let bedtimeMinute = (wakeUpTimeHour * 60 + wakeUpTimeMinute) - totalMinsNeeded;
  if (bedtimeMinute < 0) {
    bedtimeMinute += 24 * 60;
  }
  const bedHour = Math.floor(bedtimeMinute / 60);
  const bedMin = bedtimeMinute % 60;
  const ampm = bedHour >= 12 ? "PM" : "AM";
  const displayHour = bedHour % 12 === 0 ? 12 : bedHour % 12;
  const optimalBedtime = `${displayHour}:${bedMin.toString().padStart(2, "0")} ${ampm}`;

  return {
    totalHours: Math.round((validSleep / 60) * 10) / 10,
    totalSleepMinutes: validSleep,
    sleepEfficiencyPercent,
    completedCycles,
    deepSleepPercent,
    remSleepPercent,
    lightSleepPercent,
    sleepDebtMinutes,
    circadianReadinessScore,
    readinessRating,
    optimalBedtime,
    recoveryAdvice,
  };
}
