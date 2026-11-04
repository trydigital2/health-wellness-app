import {
  calculateVO2MaxHeartRateRatio,
  calculateVO2MaxCooperRun,
  classifyVO2MaxTier,
  estimateFitnessAge,
  evaluateCardiorespiratoryFitness,
} from '../src/utils/vo2MaxFitness';

describe('HealthProject VO2 Max & Cardiorespiratory Engine', () => {
  describe('calculateVO2MaxHeartRateRatio', () => {
    it('computes VO2 max correctly using Uth-Sorensen formula', () => {
      // 15.3 * (185 / 60) = 47.175 -> ~47.2 mL/kg/min
      const vo2 = calculateVO2MaxHeartRateRatio(185, 60);
      expect(vo2).toBe(47.2);
    });

    it('clamps extreme heart rate values within safe physiological bounds', () => {
      const vo2 = calculateVO2MaxHeartRateRatio(300, 20);
      expect(vo2).toBeGreaterThan(0);
      expect(vo2).toBeLessThan(100);
    });
  });

  describe('calculateVO2MaxCooperRun', () => {
    it('estimates VO2 Max based on 12-minute run distance', () => {
      // 2800 meters: (2800 - 504.9) / 44.73 = 51.3
      const vo2 = calculateVO2MaxCooperRun(2800);
      expect(vo2).toBe(51.3);
    });
  });

  describe('classifyVO2MaxTier', () => {
    it('classifies a 28 year old male with 52 mL/kg/min as Excellent', () => {
      const result = classifyVO2MaxTier(52, 28, 'male');
      expect(result.tier).toBe('Excellent');
      expect(result.color).toBe('#10B981');
    });

    it('classifies a 45 year old female with 42 mL/kg/min as Excellent', () => {
      const result = classifyVO2MaxTier(42, 45, 'female');
      expect(result.tier).toBe('Excellent');
    });

    it('identifies Superior tier for elite athletes', () => {
      const result = classifyVO2MaxTier(62, 25, 'male');
      expect(result.tier).toBe('Superior');
    });
  });

  describe('evaluateCardiorespiratoryFitness', () => {
    it('assembles complete profile with biological fitness age and longevity reduction', () => {
      const evaluation = evaluateCardiorespiratoryFitness(50.5, 38, 'male');

      expect(evaluation.vo2MaxScore).toBe(50.5);
      expect(evaluation.tier).toBe('Excellent');
      expect(evaluation.biologicalFitnessAge).toBeLessThan(38); // Younger than chronological age
      expect(evaluation.fitnessAgeDelta).toBeGreaterThan(0);
      expect(evaluation.allCauseMortalityReductionPct).toBeGreaterThan(20);
      expect(evaluation.recommendation).toContain('aerobic capacity');
    });
  });
});

