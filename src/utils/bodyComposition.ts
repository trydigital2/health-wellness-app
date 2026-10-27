/**
 * Body Composition & Metabolic Calculation Utilities
 * Calculates Body Mass Index (BMI), Basal Metabolic Rate (BMR),
 * Total Daily Energy Expenditure (TDEE), and estimated body fat percentage.
 */

export type BMICategory = "Underweight" | "Normal" | "Overweight" | "Obese";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  healthyWeightRange: { minKg: number; maxKg: number };
  primeRatio: number; // Ratio of actual BMI to upper normal limit (25)
  recommendation: string;
}

export interface MetabolicResult {
  bmr: number; // Basal Metabolic Rate (calories/day)
  tdee: number; // Total Daily Energy Expenditure (calories/day)
  estimatedBodyFatPercent: number; // Percentage
  calorieDeficitTarget: number; // Calorie target for steady weight loss (-500 kcal)
  calorieSurplusTarget: number; // Calorie target for muscle gain (+300 kcal)
}

/**
 * Calculates BMI (Body Mass Index) and healthy weight boundaries.
 * BMI = weight (kg) / (height (m))^2
 */
export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
  if (weightKg <= 0 || heightCm <= 0) {
    return {
      bmi: 0,
      category: "Normal",
      healthyWeightRange: { minKg: 0, maxKg: 0 },
      primeRatio: 0,
      recommendation: "Please enter valid height and weight measurements.",
    };
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  // Healthy weight range (BMI 18.5 to 24.9)
  const minKg = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxKg = Math.round(24.9 * heightM * heightM * 10) / 10;

  let category: BMICategory = "Normal";
  let recommendation = "Your weight is within the healthy recommended range. Keep up your regular activity!";

  if (bmi < 18.5) {
    category = "Underweight";
    recommendation = "You are currently below the standard weight range. Consider nutrient-dense strength nutrition.";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
    recommendation = "Slightly above the recommended range. Daily cardio and calorie balance can help normalize weight.";
  } else if (bmi >= 30) {
    category = "Obese";
    recommendation = "Elevated metabolic risk range. Consult with a fitness professional for guided activity.";
  }

  const primeRatio = Math.round((bmi / 25) * 100) / 100;

  return {
    bmi,
    category,
    healthyWeightRange: { minKg, maxKg },
    primeRatio,
    recommendation,
  };
}

/**
 * Calculates BMR using the Mifflin-St Jeor equation:
 * Men: BMR = (10 * weight) + (6.25 * height) - (5 * age) + 5
 * Women: BMR = (10 * weight) + (6.25 * height) - (5 * age) - 161
 * Also estimates Body Fat % using the Deurenberg formula.
 */
export function calculateMetabolism(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: "male" | "female",
  activityLevel: ActivityLevel = "moderate"
): MetabolicResult {
  const genderOffset = gender === "male" ? 5 : -161;
  const rawBmr = 10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset;
  const bmr = Math.max(800, Math.round(rawBmr));

  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] ?? 1.55;
  const tdee = Math.round(bmr * multiplier);

  // Deurenberg body fat formula:
  // BF% = (1.20 * BMI) + (0.23 * Age) - (10.8 * genderNumeric) - 5.4
  // where genderNumeric = 1 for male, 0 for female
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 22;
  const genderFactor = gender === "male" ? 1 : 0;
  const rawBf = 1.2 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4;
  const estimatedBodyFatPercent = Math.max(5, Math.min(50, Math.round(rawBf * 10) / 10));

  return {
    bmr,
    tdee,
    estimatedBodyFatPercent,
    calorieDeficitTarget: Math.max(1200, tdee - 500),
    calorieSurplusTarget: tdee + 300,
  };
}
