import {
  calculateRMSSD,
  calculateSDNN,
  calculateNaturalLogRMSSD,
  classifyAutonomicTone,
  calculateReadinessScore,
  evaluateHRVRecovery,
} from '../src/utils/hrvRecovery';

describe('HealthProject HRV & Autonomic Recovery Engine', () => {
  describe('calculateRMSSD', () => {
    it('returns 0 when given fewer than 2 RR intervals', () => {
      expect(calculateRMSSD([])).toBe(0);
      expect(calculateRMSSD([850])).toBe(0);
    });

    it('accurately calculates RMSSD for known inter-beat intervals', () => {
      // Intervals: [800, 840, 810, 860]
      // Successive diffs: [40, -30, 50]
      // Squares: [1600, 900, 2500] -> sum = 5000 -> mean = 1666.67
      // sqrt(1666.67) = 40.8248... -> 40.8 ms
      const rr = [800, 840, 810, 860];
      const rmssd = calculateRMSSD(rr);
      expect(rmssd).toBe(40.8);
    });
  });

  describe('calculateSDNN', () => {
    it('returns 0 when given fewer than 2 RR intervals', () => {
      expect(calculateSDNN([])).toBe(0);
      expect(calculateSDNN([800])).toBe(0);
    });

    it('calculates the sample standard deviation of intervals', () => {
      const rr = [800, 820, 840, 860];
      // mean = 830, diffs = [-30, -10, 10, 30] -> sq = [900, 100, 100, 900] = 2000 / 3 = 666.67
      // sqrt(666.67) = 25.819... -> 25.8 ms
      const sdnn = calculateSDNN(rr);
      expect(sdnn).toBe(25.8);
    });
  });

  describe('calculateNaturalLogRMSSD', () => {
    it('computes natural logarithm ln(RMSSD) correctly', () => {
      // ln(55) = 4.0073... -> 4.01
      expect(calculateNaturalLogRMSSD(55)).toBe(4.01);
    });

    it('safely handles non-positive numbers without error', () => {
      expect(calculateNaturalLogRMSSD(0)).toBe(0);
      expect(calculateNaturalLogRMSSD(-10)).toBe(0);
    });
  });

  describe('classifyAutonomicTone', () => {
    it('identifies Parasympathetic Dominance for >= +10% deviation', () => {
      const res = classifyAutonomicTone(15);
      expect(res.tier).toBe('Peak');
      expect(res.autonomicState).toBe('Parasympathetic Dominance');
      expect(res.color).toBe('#10B981');
    });

    it('identifies Balanced Autonomic Tone for normal range', () => {
      const res = classifyAutonomicTone(2);
      expect(res.tier).toBe('Ready');
      expect(res.autonomicState).toBe('Balanced Autonomic Tone');
      expect(res.color).toBe('#0284C7');
    });

    it('identifies Sympathetic Overactivation for moderate negative deviation', () => {
      const res = classifyAutonomicTone(-15);
      expect(res.tier).toBe('Moderate');
      expect(res.autonomicState).toBe('Sympathetic Overactivation');
      expect(res.color).toBe('#F59E0B');
    });

    it('identifies Systemic Fatigue for severe suppression', () => {
      const res = classifyAutonomicTone(-30);
      expect(res.tier).toBe('Rest');
      expect(res.autonomicState).toBe('Systemic Fatigue');
      expect(res.color).toBe('#EF4444');
    });
  });

  describe('calculateReadinessScore', () => {
    it('generates high readiness score when HRV is elevated and resting HR is low', () => {
      // RMSSD 65 vs base 50 (+30%), HR 52 vs base 58 (-6 bpm)
      const score = calculateReadinessScore(65, 50, 52, 58);
      expect(score).toBeGreaterThanOrEqual(80);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('generates lower readiness score when HRV is depressed and resting HR is elevated', () => {
      // RMSSD 30 vs base 55 (-45%), HR 68 vs base 56 (+12 bpm)
      const score = calculateReadinessScore(30, 55, 68, 56);
      expect(score).toBeLessThan(60);
      expect(score).toBeGreaterThan(0);
    });

    it('clamps scores safely between 1 and 100', () => {
      const extremeLow = calculateReadinessScore(5, 80, 110, 50);
      expect(extremeLow).toBeGreaterThanOrEqual(1);

      const extremeHigh = calculateReadinessScore(150, 40, 40, 65);
      expect(extremeHigh).toBeLessThanOrEqual(100);
    });
  });

  describe('evaluateHRVRecovery', () => {
    it('builds a comprehensive recovery assessment object', () => {
      const assessment = evaluateHRVRecovery(62, 54, 52, 56);

      expect(assessment.currentRMSSD).toBe(62);
      expect(assessment.baseline7DayRMSSD).toBe(54);
      expect(assessment.deviationPct).toBe(14.8);
      expect(assessment.lnRMSSD).toBe(4.13);
      expect(assessment.tier).toBe('Peak');
      expect(assessment.autonomicState).toBe('Parasympathetic Dominance');
      expect(assessment.readinessScore).toBeGreaterThan(75);
      expect(assessment.breathingPacingCpm).toBe(6.0);
      expect(assessment.recommendation).toContain('parasympathetic recovery');
    });
  });
});
