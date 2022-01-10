import {
  calculateCaloriesBurned,
  calculateStepDistance,
  calculateStepCalories,
  calculateProgressPercentage,
  calculateStreak,
} from '../src/utils/calculations';
import { DayMetricPoint } from '../src/types/activity';

describe('Health & Wellness Calculations', () => {
  describe('calculateCaloriesBurned', () => {
    it('should return 0 calories when duration is 0 or negative', () => {
      expect(calculateCaloriesBurned(0, 'Cardio', 70)).toBe(0);
      expect(calculateCaloriesBurned(-60, 'Cardio', 70)).toBe(0);
    });

    it('should calculate accurate calories for Cardio workout', () => {
      // 30 min (1800s), 70kg, MET 8.0 -> (8 * 3.5 * 70 / 200) * 30 = 294 kcal
      const calories = calculateCaloriesBurned(1800, 'Cardio', 70);
      expect(calories).toBe(294);
    });

    it('should calculate accurate calories for HIIT workout', () => {
      // 20 min (1200s), 70kg, MET 9.5 -> (9.5 * 3.5 * 70 / 200) * 20 = 233 kcal
      const calories = calculateCaloriesBurned(1200, 'HIIT', 70);
      expect(calories).toBe(233);
    });

    it('should calculate accurate calories for Flexibility/Yoga', () => {
      // 15 min (900s), 70kg, MET 3.0 -> (3 * 3.5 * 70 / 200) * 15 = 55.125 -> 55 kcal
      const calories = calculateCaloriesBurned(900, 'Flexibility', 70);
      expect(calories).toBe(55);
    });
  });

  describe('calculateStepDistance', () => {
    it('should calculate distance in kilometers for metric system', () => {
      // 10,000 steps * 0.762m = 7620m = 7.62km
      const result = calculateStepDistance(10000, 'metric');
      expect(result.distance).toBe(7.62);
      expect(result.unit).toBe('km');
    });

    it('should calculate distance in miles for imperial system', () => {
      const result = calculateStepDistance(10000, 'imperial');
      expect(result.distance).toBe(4.73);
      expect(result.unit).toBe('mi');
    });

    it('should handle zero steps gracefully', () => {
      const result = calculateStepDistance(0, 'metric');
      expect(result.distance).toBe(0);
      expect(result.unit).toBe('km');
    });
  });

  describe('calculateStepCalories', () => {
    it('should estimate calories based on step count', () => {
      // 10,000 steps * 0.04 = 400 kcal for 70kg person
      const calories = calculateStepCalories(10000, 70);
      expect(calories).toBe(400);
    });

    it('should scale calories with user weight', () => {
      const calories80kg = calculateStepCalories(10000, 84);
      expect(calories80kg).toBe(480);
    });
  });

  describe('calculateProgressPercentage', () => {
    it('should calculate completion percentage accurately', () => {
      expect(calculateProgressPercentage(5000, 10000)).toBe(50);
      expect(calculateProgressPercentage(7500, 10000)).toBe(75);
    });

    it('should clamp values between 0 and 100', () => {
      expect(calculateProgressPercentage(15000, 10000)).toBe(100);
      expect(calculateProgressPercentage(-100, 10000)).toBe(0);
    });

    it('should handle zero goal safely without dividing by zero', () => {
      expect(calculateProgressPercentage(5000, 0)).toBe(0);
    });
  });

  describe('calculateStreak', () => {
    it('should count consecutive goal-met days backwards', () => {
      const mockPoints: DayMetricPoint[] = [
        { date: '1', shortDay: 'Wed', dayNumber: 1, steps: 10000, activeMinutes: 40, calories: 500, isToday: false, goalMet: true },
        { date: '2', shortDay: 'Thu', dayNumber: 2, steps: 11000, activeMinutes: 50, calories: 600, isToday: false, goalMet: true },
        { date: '3', shortDay: 'Fri', dayNumber: 3, steps: 7000, activeMinutes: 20, calories: 300, isToday: false, goalMet: false },
        { date: '4', shortDay: 'Sat', dayNumber: 4, steps: 10500, activeMinutes: 45, calories: 550, isToday: false, goalMet: true },
        { date: '5', shortDay: 'Sun', dayNumber: 5, steps: 12000, activeMinutes: 60, calories: 650, isToday: true, goalMet: true },
      ];

      expect(calculateStreak(mockPoints)).toBe(2);
    });
  });
});
