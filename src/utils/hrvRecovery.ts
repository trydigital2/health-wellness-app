/**
 * Heart Rate Variability (HRV) & Autonomic Nervous System (ANS) Engine
 * Implements RMSSD, SDNN, natural logarithm ln(RMSSD), autonomic tone balance,
 * and 7-day rolling baseline readiness scoring for physical recovery.
 */

export type AutonomicState =
  | 'Parasympathetic Dominance'
  | 'Balanced Autonomic Tone'
  | 'Sympathetic Overactivation'
  | 'Systemic Fatigue';

export type TrainingReadinessTier = 'Peak' | 'Ready' | 'Moderate' | 'Rest';

export interface HRVRecoverySummary {
  currentRMSSD: number; // ms
  baseline7DayRMSSD: number; // ms
  deviationPct: number; // percentage change vs baseline
  lnRMSSD: number; // natural log of RMSSD
  readinessScore: number; // 0 - 100
  tier: TrainingReadinessTier;
  autonomicState: AutonomicState;
  sympatheticVsParasympatheticRatio: number; // ~0.8 - 2.5
  breathingPacingCpm: number; // Coherence respiration rate (breaths per min)
  color: string;
  recommendation: string;
}

/**
 * Calculates the Root Mean Square of Successive Differences (RMSSD) from RR intervals.
 * RMSSD reflects vagally mediated parasympathetic cardiovascular control.
 *
 * @param rrIntervalsMs Array of inter-beat intervals in milliseconds (e.g. [820, 850, 810])
 * @returns RMSSD rounded to 1 decimal place (ms)
 */
export function calculateRMSSD(rrIntervalsMs: number[]): number {
  if (!rrIntervalsMs || rrIntervalsMs.length < 2) {
    return 0;
  }

  let sumOfSquares = 0;
  const count = rrIntervalsMs.length - 1;

  for (let i = 0; i < count; i++) {
    const diff = rrIntervalsMs[i + 1] - rrIntervalsMs[i];
    sumOfSquares += diff * diff;
  }

  const rmssd = Math.sqrt(sumOfSquares / count);
  return Math.round(rmssd * 10) / 10;
}

/**
 * Calculates the Standard Deviation of NN intervals (SDNN).
 * SDNN represents total heart rate variability across autonomic inputs.
 *
 * @param rrIntervalsMs Array of inter-beat intervals in milliseconds
 * @returns SDNN rounded to 1 decimal place (ms)
 */
export function calculateSDNN(rrIntervalsMs: number[]): number {
  if (!rrIntervalsMs || rrIntervalsMs.length < 2) {
    return 0;
  }

  const mean = rrIntervalsMs.reduce((acc, v) => acc + v, 0) / rrIntervalsMs.length;
  const variance =
    rrIntervalsMs.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
    (rrIntervalsMs.length - 1);

  const sdnn = Math.sqrt(variance);
  return Math.round(sdnn * 10) / 10;
}

/**
 * Computes natural logarithm of RMSSD (lnRMSSD).
 * Commonly preferred in sports science because raw RMSSD is positively skewed.
 */
export function calculateNaturalLogRMSSD(rmssd: number): number {
  if (rmssd <= 0) return 0;
  return Math.round(Math.log(rmssd) * 100) / 100;
}

/**
 * Evaluates Autonomic Nervous System state based on HRV deviation from baseline.
 */
export function classifyAutonomicTone(deviationPct: number): {
  tier: TrainingReadinessTier;
  autonomicState: AutonomicState;
  color: string;
} {
  if (deviationPct >= 10) {
    return {
      tier: 'Peak',
      autonomicState: 'Parasympathetic Dominance',
      color: '#10B981', // Emerald
    };
  }
  if (deviationPct >= -8) {
    return {
      tier: 'Ready',
      autonomicState: 'Balanced Autonomic Tone',
      color: '#0284C7', // Sky Blue
    };
  }
  if (deviationPct >= -22) {
    return {
      tier: 'Moderate',
      autonomicState: 'Sympathetic Overactivation',
      color: '#F59E0B', // Amber
    };
  }
  return {
    tier: 'Rest',
    autonomicState: 'Systemic Fatigue',
    color: '#EF4444', // Rose / Red
  };
}

/**
 * Calculates holistic Recovery Readiness Score (0 - 100).
 * Combines 65% HRV deviation + 35% resting heart rate delta.
 */
export function calculateReadinessScore(
  currentRMSSD: number,
  baselineRMSSD: number,
  restingHR: number,
  baselineHR: number
): number {
  const safeBaselineRMSSD = Math.max(15, baselineRMSSD);
  const safeBaselineHR = Math.max(40, baselineHR);

  // HRV component (Base 55 pts; ±15% deviation translates to ±25 pts)
  const hrvRatio = currentRMSSD / safeBaselineRMSSD;
  const hrvComponent = Math.max(10, Math.min(65, 55 + (hrvRatio - 1) * 70));

  // Resting HR component (Base 30 pts; lower resting HR adds points, elevated reduces)
  const hrDelta = safeBaselineHR - restingHR;
  const hrComponent = Math.max(5, Math.min(35, 30 + hrDelta * 1.8));

  const total = Math.round(hrvComponent + hrComponent);
  return Math.max(1, Math.min(100, total));
}

/**
 * Evaluates comprehensive Heart Rate Variability recovery status.
 *
 * @param currentRMSSD Today's morning waking RMSSD in ms
 * @param baseline7DayRMSSD 7-day rolling average RMSSD in ms
 * @param restingHR Today's morning resting heart rate (bpm)
 * @param baselineHR 7-day rolling baseline resting heart rate (bpm)
 */
export function evaluateHRVRecovery(
  currentRMSSD: number,
  baseline7DayRMSSD: number,
  restingHR: number,
  baselineHR: number
): HRVRecoverySummary {
  const safeBaseRMSSD = Math.max(10, baseline7DayRMSSD);
  const rawDiff = currentRMSSD - safeBaseRMSSD;
  const deviationPct = Math.round((rawDiff / safeBaseRMSSD) * 1000) / 10;
  const lnRMSSD = calculateNaturalLogRMSSD(currentRMSSD);
  const readinessScore = calculateReadinessScore(currentRMSSD, safeBaseRMSSD, restingHR, baselineHR);

  const { tier, autonomicState, color } = classifyAutonomicTone(deviationPct);

  // Approximate sympathetic/parasympathetic ratio based on inverted deviation
  const rawRatio = 1.0 - (deviationPct / 100) * 0.7;
  const sympatheticVsParasympatheticRatio = Math.round(Math.max(0.4, Math.min(2.5, rawRatio)) * 100) / 100;

  // Resonance frequency breathing (0.1 Hz = ~6.0 breaths/min for vagal stimulation)
  const breathingPacingCpm = 6.0;

  let recommendation = '';
  switch (tier) {
    case 'Peak':
      recommendation =
        'Superb parasympathetic recovery. Your nervous system is primed for high neuromuscular load, PR attempts, or intense interval training.';
      break;
    case 'Ready':
      recommendation =
        'Stable autonomic equilibrium. Normal cardiovascular responsiveness; ideal for scheduled volume and moderate endurance work.';
      break;
    case 'Moderate':
      recommendation =
        'Elevated sympathetic stress detected. Consider keeping intensity below lactate threshold (Zone 2) or prioritize active mobility.';
      break;
    default:
      recommendation =
        'High autonomic strain and suppressed vagal tone. Full recovery day advised with hydration, sleep optimization, and resonance breathing.';
  }

  return {
    currentRMSSD,
    baseline7DayRMSSD,
    deviationPct,
    lnRMSSD,
    readinessScore,
    tier,
    autonomicState,
    sympatheticVsParasympatheticRatio,
    breathingPacingCpm,
    color,
    recommendation,
  };
}

