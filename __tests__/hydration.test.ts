import { calculateDailyHydrationTarget, calculateHydrationStatus } from "../src/utils/hydration";

describe("Hydration & Fluid Balance Utilities", () => {
  describe("calculateDailyHydrationTarget", () => {
    it("computes accurate target for 70kg adult without workout", () => {
      // 70 * 35 = 2450 mL
      const target = calculateDailyHydrationTarget({ weightKg: 70 });
      expect(target).toBe(2450);
    });

    it("adds extra fluid for 45 min workout and warm climate", () => {
      // 70 * 35 (2450) + 45 * 12 (540) + 350 = 3340 -> rounds to 3350
      const target = calculateDailyHydrationTarget({
        weightKg: 70,
        workoutDurationMinutes: 45,
        isWarmClimate: true,
      });
      expect(target).toBe(3350);
    });

    it("falls back to standard 2000mL if invalid weight provided", () => {
      const target = calculateDailyHydrationTarget({ weightKg: 0 });
      expect(target).toBe(2000);
    });
  });

  describe("calculateHydrationStatus", () => {
    it("evaluates Optimal status when 100% of target is met", () => {
      const status = calculateHydrationStatus(2500, 2500);
      expect(status.level).toBe("Optimal");
      expect(status.percentage).toBe(100);
      expect(status.remainingMl).toBe(0);
      expect(status.glassesCount).toBe(10);
    });

    it("evaluates Good status when 75% consumed", () => {
      const status = calculateHydrationStatus(1875, 2500);
      expect(status.level).toBe("Good");
      expect(status.percentage).toBe(75);
      expect(status.remainingMl).toBe(625);
    });

    it("evaluates Dehydrated status when consumption is under 40%", () => {
      const status = calculateHydrationStatus(500, 2500);
      expect(status.level).toBe("Dehydrated");
      expect(status.percentage).toBe(20);
    });
  });
});
