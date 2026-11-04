import { calculateSleepAnalytics } from "../src/utils/sleepAnalytics";

describe("Sleep Architecture & Circadian Recovery Analytics", () => {
  it("calculates optimal readiness and complete 90-min cycles for 8 hours of sleep", () => {
    const result = calculateSleepAnalytics({
      totalSleepMinutes: 480, // 8 hours
      stages: {
        deepSleepMinutes: 100, // ~21%
        remSleepMinutes: 110, // ~23%
        lightSleepMinutes: 270,
        awakeMinutes: 20,
      },
      targetSleepMinutes: 480,
      wakeUpTimeHour: 7,
      wakeUpTimeMinute: 0,
    });

    expect(result.totalHours).toBe(8);
    expect(result.completedCycles).toBe(5.3); // 480 / 90
    expect(result.sleepDebtMinutes).toBe(0);
    expect(result.circadianReadinessScore).toBeGreaterThanOrEqual(85);
    expect(result.readinessRating).toBe("Optimal Restoration");
    expect(result.sleepEfficiencyPercent).toBe(96); // 480 / 500 = 96%
  });

  it("calculates sleep debt and insufficient rest rating for curtailed sleep", () => {
    const result = calculateSleepAnalytics({
      totalSleepMinutes: 300, // 5 hours
      stages: {
        deepSleepMinutes: 40,
        remSleepMinutes: 50,
        lightSleepMinutes: 210,
        awakeMinutes: 40,
      },
      targetSleepMinutes: 480,
    });

    expect(result.totalHours).toBe(5);
    expect(result.sleepDebtMinutes).toBe(180); // 480 - 300 = 180 min
    expect(result.circadianReadinessScore).toBeLessThanOrEqual(70);
    expect(["Insufficient Rest", "Critical Sleep Deficit"]).toContain(result.readinessRating);
  });

  it("calculates optimal bedtime aligned with ultradian cycles for 6:30 AM wake-up", () => {
    const result = calculateSleepAnalytics({
      totalSleepMinutes: 450,
      wakeUpTimeHour: 6,
      wakeUpTimeMinute: 30,
    });

    // 6:30 AM = 390 mins past midnight.
    // Needed: 5 * 90 + 15 = 465 mins before 6:30 AM.
    // 390 - 465 = -75 -> 24*60 - 75 = 1365 mins = 22:45 (10:45 PM).
    expect(result.optimalBedtime).toBe("10:45 PM");
  });

  it("handles zero sleep safely without NaN or division by zero", () => {
    const result = calculateSleepAnalytics({
      totalSleepMinutes: 0,
    });

    expect(result.totalHours).toBe(0);
    expect(result.completedCycles).toBe(0);
    expect(result.sleepEfficiencyPercent).toBe(0);
    expect(result.circadianReadinessScore).toBe(0);
    expect(result.readinessRating).toBe("Critical Sleep Deficit");
  });
});
