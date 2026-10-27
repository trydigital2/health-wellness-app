import { calculateBMI, calculateMetabolism } from "../src/utils/bodyComposition";

describe("Body Composition Utilities", () => {
  describe("calculateBMI", () => {
    it("correctly identifies normal weight for 70kg and 175cm", () => {
      const result = calculateBMI(70, 175);
      expect(result.bmi).toBe(22.9);
      expect(result.category).toBe("Normal");
      expect(result.healthyWeightRange.minKg).toBeCloseTo(56.7, 1);
      expect(result.healthyWeightRange.maxKg).toBeCloseTo(76.3, 1);
    });

    it("identifies overweight category for 85kg and 175cm", () => {
      const result = calculateBMI(85, 175);
      expect(result.bmi).toBe(27.8);
      expect(result.category).toBe("Overweight");
    });

    it("identifies underweight category for 48kg and 170cm", () => {
      const result = calculateBMI(48, 170);
      expect(result.bmi).toBe(16.6);
      expect(result.category).toBe("Underweight");
    });

    it("handles zero values safely without throwing", () => {
      const result = calculateBMI(0, 0);
      expect(result.bmi).toBe(0);
      expect(result.healthyWeightRange.minKg).toBe(0);
    });
  });

  describe("calculateMetabolism", () => {
    it("computes accurate BMR and TDEE for male active adult", () => {
      const result = calculateMetabolism(75, 180, 28, "male", "active");
      // Men: 10*75 + 6.25*180 - 5*28 + 5 = 750 + 1125 - 140 + 5 = 1740
      expect(result.bmr).toBe(1740);
      // Active multiplier = 1.725 -> 1740 * 1.725 = 3001.5 -> 3002
      expect(result.tdee).toBe(3002);
      expect(result.calorieDeficitTarget).toBe(2502);
      expect(result.estimatedBodyFatPercent).toBeGreaterThan(10);
      expect(result.estimatedBodyFatPercent).toBeLessThan(25);
    });

    it("computes accurate BMR for female moderate adult", () => {
      const result = calculateMetabolism(60, 165, 30, "female", "moderate");
      // Women: 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320
      expect(result.bmr).toBe(1320);
      expect(result.tdee).toBe(Math.round(1320 * 1.55));
    });
  });
});
