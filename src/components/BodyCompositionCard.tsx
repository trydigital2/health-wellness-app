import React from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Card } from "./Card";
import { COLORS } from "@/constants/COLORS";
import { BMIResult, MetabolicResult } from "@/utils/bodyComposition";

export interface BodyCompositionCardProps {
  bmiResult: BMIResult;
  metabolicResult: MetabolicResult;
  weightKg: number;
  heightCm: number;
  style?: StyleProp<ViewStyle>;
}

export const BodyCompositionCard: React.FC<BodyCompositionCardProps> = ({
  bmiResult,
  metabolicResult,
  weightKg,
  heightCm,
  style,
}) => {
  const getCategoryColor = () => {
    switch (bmiResult.category) {
      case "Normal":
        return COLORS.success;
      case "Overweight":
        return COLORS.warning;
      case "Obese":
        return COLORS.danger;
      default:
        return COLORS.info;
    }
  };

  return (
    <Card style={[styles.card, style]} variant="elevated">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Body Composition & BMR</Text>
          <Text style={styles.subtitle}>
            {weightKg} kg · {heightCm} cm
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getCategoryColor() + "20" }]}>
          <Text style={[styles.badgeText, { color: getCategoryColor() }]}>
            {bmiResult.category}
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{bmiResult.bmi}</Text>
          <Text style={styles.metricLabel}>BMI Index</Text>
          <Text style={styles.metricSub}>Normal: 18.5 - 24.9</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{metabolicResult.bmr}</Text>
          <Text style={styles.metricLabel}>Base BMR</Text>
          <Text style={styles.metricSub}>kcal / day</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{metabolicResult.tdee}</Text>
          <Text style={styles.metricLabel}>Daily Burn</Text>
          <Text style={styles.metricSub}>TDEE Target</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.rangeRow}>
          <Text style={styles.rangeLabel}>Ideal Weight for Height:</Text>
          <Text style={styles.rangeValue}>
            {bmiResult.healthyWeightRange.minKg} - {bmiResult.healthyWeightRange.maxKg} kg
          </Text>
        </View>
        <Text style={styles.recommendationText}>{bmiResult.recommendation}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.surfaceSecondary,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  metricSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  infoBox: {
    backgroundColor: COLORS.surfaceSecondary,
    padding: 12,
    borderRadius: 8,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rangeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  rangeValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  recommendationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

export default BodyCompositionCard;
