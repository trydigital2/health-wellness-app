export interface HeartRateStep {
  workloadWatts: number;
  heartRateBpm: number;
}

export interface LactateThresholdResult {
  maxHeartRate: number;
  aerobicThresholdHr: number; // LT1 (~70-75% max HR, ~2 mmol/L)
  anaerobicThresholdHr: number; // LT2 / LTHR (~85-90% max HR, ~4 mmol/L)
  currentZone: 'Recovery' | 'Aerobic Base' | 'Tempo' | 'Lactate Threshold' | 'Anaerobic / VO2';
  paceGuidance: string;
  recommendedDurationMins: number;
  deflectionDetected: boolean;
}

/**
 * Calculates Lactate Threshold (LT1 & LT2) and deflection point estimates based on user profile and ramp tests.
 */
export function calculateLactateThreshold(
  age: number,
  restingHr: number = 60,
  rampSteps?: HeartRateStep[]
): LactateThresholdResult {
  // Tanaka formula for max HR: 208 - 0.7 * age
  const maxHr = Math.round(208 - 0.7 * age);
  const heartRateReserve = maxHr - restingHr;

  // LT1 (Aerobic threshold): ~65% HRR + restingHr
  const lt1 = Math.round(restingHr + 0.65 * heartRateReserve);

  // LT2 (Anaerobic threshold / LTHR): ~85% HRR + restingHr
  let lt2 = Math.round(restingHr + 0.85 * heartRateReserve);
  let deflectionDetected = false;

  // Conconi deflection analysis if ramp steps are provided
  if (rampSteps && rampSteps.length >= 4) {
    // Look for slope flattening / deflection point in HR vs Power curve
    const slopes: number[] = [];
    for (let i = 1; i < rampSteps.length; i++) {
      const dHr = rampSteps[i].heartRateBpm - rampSteps[i - 1].heartRateBpm;
      const dWatts = rampSteps[i].workloadWatts - rampSteps[i - 1].workloadWatts;
      if (dWatts > 0) {
        slopes.push(dHr / dWatts);
      }
    }

    // Find point where slope flattens significantly
    for (let i = 1; i < slopes.length; i++) {
      if (slopes[i] < slopes[i - 1] * 0.7) {
        lt2 = rampSteps[i].heartRateBpm;
        deflectionDetected = true;
        break;
      }
    }
  }

  const currentZone = 'Lactate Threshold';
  const paceGuidance =
    'Sustain a strong, controlled effort (Zone 4) right at the edge of burning sensation. Breathing is rhythmic and heavy.';
  const recommendedDurationMins = 30;

  return {
    maxHeartRate: maxHr,
    aerobicThresholdHr: lt1,
    anaerobicThresholdHr: lt2,
    currentZone,
    paceGuidance,
    recommendedDurationMins,
    deflectionDetected,
  };
}
