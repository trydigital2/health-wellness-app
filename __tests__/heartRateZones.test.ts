import {
  calculateMaxHeartRateTanaka,
  calculateKarvonenZones,
  identifyCurrentZone,
  calculateCardioLoad,
} from "../src/utils/heartRateZones";

describe("Heart Rate Zones & Cardio Load Engine", () => {
  describe("calculateMaxHeartRateTanaka", () => {
    it("calculates accurate HRmax for a 20-year-old athlete", () => {
      // 208 - 0.7 * 20 = 208 - 14 = 194
      expect(calculateMaxHeartRateTanaka(20)).toBe(194);
    });

    it("calculates accurate HRmax for a 40-year-old adult", () => {
      // 208 - 0.7 * 40 = 208 - 28 = 180
      expect(calculateMaxHeartRateTanaka(40)).toBe(180);
    });

    it("clamps extreme low age and extreme high age within safe physiological boundaries", () => {
      expect(calculateMaxHeartRateTanaka(5)).toBe(201); // age clamped to 10: 208 - 7 = 201
      expect(calculateMaxHeartRateTanaka(120)).toBe(138); // age clamped to 100: 208 - 70 = 138
    });
  });

  describe("calculateKarvonenZones", () => {
    it("generates exactly 5 zones with progressive intensity ranges", () => {
      const zones = calculateKarvonenZones(30, 60);
      expect(zones).toHaveLength(5);
      expect(zones.map((z) => z.zone)).toEqual([1, 2, 3, 4, 5]);

      // Check monotonicity
      for (let i = 0; i < zones.length - 1; i++) {
        expect(zones[i].maxBpm).toBeLessThanOrEqual(zones[i + 1].minBpm);
      }
    });

    it("applies resting heart rate reserve correctly", () => {
      // Age 30: Max HR = 208 - 21 = 187. Rest = 60. HRR = 127.
      // Zone 1 min: 60 + 127 * 0.5 = 60 + 63.5 = 124
      const zones = calculateKarvonenZones(30, 60);
      expect(zones[0].minBpm).toBe(124);
      expect(zones[4].maxBpm).toBe(187);
    });
  });

  describe("identifyCurrentZone", () => {
    const zones = calculateKarvonenZones(30, 60);

    it("identifies Zone 1 for lower aerobic heart rate", () => {
      const match = identifyCurrentZone(125, zones);
      expect(match?.zone).toBe(1);
    });

    it("identifies Zone 3 for tempo pace", () => {
      // Zone 3 is 70%-80%: 60 + 127*0.7 = 149 to 60 + 127*0.8 = 162
      const match = identifyCurrentZone(155, zones);
      expect(match?.zone).toBe(3);
    });

    it("returns null for non-positive heart rate values", () => {
      expect(identifyCurrentZone(0, zones)).toBeNull();
      expect(identifyCurrentZone(-10, zones)).toBeNull();
    });
  });

  describe("calculateCardioLoad & TRIMP", () => {
    it("classifies light recovery workout when TRIMP is under 50", () => {
      const result = calculateCardioLoad(30, 60, {
        zone1Minutes: 20,
        zone2Minutes: 10,
        zone3Minutes: 0,
        zone4Minutes: 0,
        zone5Minutes: 0,
      });
      // 20*1 + 10*2 = 40 TRIMP
      expect(result.trimpScore).toBe(40);
      expect(result.loadClassification).toBe("Light Recovery");
    });

    it("classifies productive strain for high-intensity training session", () => {
      const result = calculateCardioLoad(30, 60, {
        zone1Minutes: 10, // 10
        zone2Minutes: 20, // 40
        zone3Minutes: 20, // 64
        zone4Minutes: 15, // 69
        zone5Minutes: 0,
      });
      // 10 + 40 + 64 + 69 = 183
      expect(result.trimpScore).toBe(183);
      expect(result.loadClassification).toBe("Productive Strain");
      expect(result.totalActiveMinutes).toBe(65);
    });
  });
});
