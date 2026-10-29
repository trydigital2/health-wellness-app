/**
 * Heart Rate Zones & Cardiovascular Training Analytics
 * Implements Tanaka & Karvonen formulas for Heart Rate Reserve (HRR),
 * 5-tier physiological intensity zones, and Banister's TRIMP load index.
 */

export type HeartRateZoneId = 1 | 2 | 3 | 4 | 5;

export interface HeartRateZoneInfo {
  zone: HeartRateZoneId;
  name: string;
  label: string;
  minBpm: number;
  maxBpm: number;
  intensityPercentMin: number;
  intensityPercentMax: number;
  primaryBenefit: string;
  color: string;
}

export interface ZoneDistributionInput {
  zone1Minutes: number;
  zone2Minutes: number;
  zone3Minutes: number;
  zone4Minutes: number;
  zone5Minutes: number;
}

export interface CardioLoadAnalysis {
  maxHeartRate: number;
  restingHeartRate: number;
  heartRateReserve: number;
  zones: HeartRateZoneInfo[];
  totalActiveMinutes: number;
  trimpScore: number;
  loadClassification: "Light Recovery" | "Moderate Aerobic" | "Productive Strain" | "Overreaching Warning";
  trainingAdvice: string;
}

/**
 * Calculates estimated Maximum Heart Rate using the clinically validated Tanaka formula:
 * HRmax = 208 - (0.7 * age)
 * Bounded between 120 and 220 bpm.
 */
export function calculateMaxHeartRateTanaka(age: number): number {
  const safeAge = Math.max(10, Math.min(100, age));
  const estimated = Math.round(208 - 0.7 * safeAge);
  return Math.max(120, Math.min(220, estimated));
}

/**
 * Generates the 5 Karvonen Heart Rate Zones using Heart Rate Reserve (HRR):
 * Target HR = ((HRmax - HRrest) * %Intensity) + HRrest
 */
export function calculateKarvonenZones(
  age: number,
  restingHeartRate: number = 60
): HeartRateZoneInfo[] {
  const maxHr = calculateMaxHeartRateTanaka(age);
  const safeRestingHr = Math.max(35, Math.min(110, restingHeartRate));
  const hrr = Math.max(20, maxHr - safeRestingHr);

  const zoneConfigs: Array<{
    zone: HeartRateZoneId;
    name: string;
    label: string;
    minPct: number;
    maxPct: number;
    benefit: string;
    color: string;
  }> = [
    {
      zone: 1,
      name: "Active Recovery",
      label: "Zone 1",
      minPct: 0.5,
      maxPct: 0.6,
      benefit: "Accelerates metabolic waste clearance and stimulates capillary recovery.",
      color: "#0D9488", // Emerald Teal
    },
    {
      zone: 2,
      name: "Aerobic Base / Fat Burn",
      label: "Zone 2",
      minPct: 0.6,
      maxPct: 0.7,
      benefit: "Maximizes mitochondrial biogenesis, lipid oxidation, and endurance foundation.",
      color: "#0284C7", // Cardio Blue
    },
    {
      zone: 3,
      name: "Tempo / Aerobic Power",
      label: "Zone 3",
      minPct: 0.7,
      maxPct: 0.8,
      benefit: "Enhances cardiac stroke volume and sustained muscular pace economy.",
      color: "#F59E0B", // Amber Warning
    },
    {
      zone: 4,
      name: "Lactate Threshold",
      label: "Zone 4",
      minPct: 0.8,
      maxPct: 0.9,
      benefit: "Raises lactate clearance threshold and anaerobic metabolic tolerance.",
      color: "#F97316", // Orange Strain
    },
    {
      zone: 5,
      name: "VO2 Max / Neuromuscular",
      label: "Zone 5",
      minPct: 0.9,
      maxPct: 1.0,
      benefit: "Peaks peak oxygen uptake, neuromuscular recruitment, and maximum sprint power.",
      color: "#EF4444", // High-Intensity Red
    },
  ];

  return zoneConfigs.map((cfg) => {
    const minBpm = Math.round(safeRestingHr + hrr * cfg.minPct);
    const maxBpm = Math.round(safeRestingHr + hrr * cfg.maxPct);

    return {
      zone: cfg.zone,
      name: cfg.name,
      label: cfg.label,
      minBpm,
      maxBpm,
      intensityPercentMin: Math.round(cfg.minPct * 100),
      intensityPercentMax: Math.round(cfg.maxPct * 100),
      primaryBenefit: cfg.benefit,
      color: cfg.color,
    };
  });
}

/**
 * Identifies which Zone a given current heart rate belongs to.
 */
export function identifyCurrentZone(currentBpm: number, zones: HeartRateZoneInfo[]): HeartRateZoneInfo | null {
  if (currentBpm <= 0 || zones.length === 0) return null;
  if (currentBpm < zones[0].minBpm) return zones[0];
  if (currentBpm >= zones[zones.length - 1].maxBpm) return zones[zones.length - 1];

  const matched = zones.find((z) => currentBpm >= z.minBpm && currentBpm <= z.maxBpm);
  return matched || zones[0];
}

/**
 * Calculates Cardiovascular Training Impulse (TRIMP) & workout strain classification.
 * Uses weighted zone duration multiplier: (Z1*1 + Z2*2 + Z3*3 + Z4*4.5 + Z5*6)
 */
export function calculateCardioLoad(
  age: number,
  restingHeartRate: number,
  distribution: ZoneDistributionInput
): CardioLoadAnalysis {
  const maxHr = calculateMaxHeartRateTanaka(age);
  const safeRestingHr = Math.max(35, Math.min(110, restingHeartRate));
  const hrr = Math.max(20, maxHr - safeRestingHr);
  const zones = calculateKarvonenZones(age, restingHeartRate);

  const z1 = Math.max(0, distribution.zone1Minutes);
  const z2 = Math.max(0, distribution.zone2Minutes);
  const z3 = Math.max(0, distribution.zone3Minutes);
  const z4 = Math.max(0, distribution.zone4Minutes);
  const z5 = Math.max(0, distribution.zone5Minutes);

  const totalActiveMinutes = z1 + z2 + z3 + z4 + z5;

  // Weighted TRIMP calculation
  const rawTrimp = z1 * 1.0 + z2 * 2.0 + z3 * 3.2 + z4 * 4.6 + z5 * 6.5;
  const trimpScore = Math.round(rawTrimp);

  let loadClassification: CardioLoadAnalysis["loadClassification"] = "Moderate Aerobic";
  let trainingAdvice = "Balanced cardio stimulation. Great for building aerobic base capacity.";

  if (trimpScore < 50) {
    loadClassification = "Light Recovery";
    trainingAdvice = "Low cardiovascular fatigue. Ideal active recovery day or restorative session.";
  } else if (trimpScore <= 130) {
    loadClassification = "Moderate Aerobic";
    trainingAdvice = "Optimal cardiovascular conditioning. Sustains endurance adaptation without excessive CNS strain.";
  } else if (trimpScore <= 220) {
    loadClassification = "Productive Strain";
    trainingAdvice = "High aerobic stimulus achieved. Ensure 7-9 hours of restorative sleep and proper hydration.";
  } else {
    loadClassification = "Overreaching Warning";
    trainingAdvice = "Substantial training fatigue accumulated. Consider an active recovery or rest day tomorrow.";
  }

  return {
    maxHeartRate: maxHr,
    restingHeartRate: safeRestingHr,
    heartRateReserve: hrr,
    zones,
    totalActiveMinutes,
    trimpScore,
    loadClassification,
    trainingAdvice,
  };
}
