import React from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Card } from "./Card";
import { COLORS } from "@/constants/COLORS";
import { VO2MaxResult } from "@/utils/vo2MaxFitness";

export interface VO2MaxFitnessCardProps {
  data: VO2MaxResult;
  chronologicalAge?: number;
  style?: StyleProp<ViewStyle>;
}

export const VO2MaxFitnessCard: React.FC<VO2MaxFitnessCardProps> = ({
  data,
  chronologicalAge = 32,
  style,
}) => {
  return (
    <Card style={[styles.card, style]} variant="elevated">
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Cardiorespiratory Fitness</Text>
          <Text style={styles.subtitle}>
            Aerobic Capacity & Biological Fitness Age
          </Text>
        </View>
        <View style={[styles.tierBadge, { backgroundColor: data.color + "20", borderColor: data.color }]}>
          <Text style={[styles.tierText, { color: data.color }]}>
            {data.tier.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Main Score & Fitness Age */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>VO2 Max Peak</Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreNumber, { color: data.color }]}>
              {data.vo2MaxScore}
            </Text>
            <Text style={styles.scoreUnit}>mL/kg/min</Text>
          </View>
          <Text style={styles.metricSub}>Max oxygen consumption</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Fitness Age</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.fitnessAgeNumber}>
              {data.biologicalFitnessAge}
            </Text>
            <Text style={styles.fitnessAgeUnit}>yrs</Text>
          </View>
          <Text style={[styles.metricSub, { color: COLORS.primaryDark }]}>
            {data.fitnessAgeDelta >= 0
              ? `⚡ ${data.fitnessAgeDelta} yrs younger than actual (${chronologicalAge})`
              : `⚠️ ${Math.abs(data.fitnessAgeDelta)} yrs above chronological`}
          </Text>
        </View>
      </View>

      {/* Longevity Benefit Banner */}
      <View style={styles.longevityBanner}>
        <Text style={styles.longevityIcon}>🛡️</Text>
        <View style={styles.longevityContent}>
          <Text style={styles.longevityTitle}>
            {data.allCauseMortalityReductionPct}% Cardiovascular Protection
          </Text>
          <Text style={styles.longevitySub}>
            Clinical correlation with extended healthspan & metabolic reserve
          </Text>
        </View>
      </View>

      {/* Guidance Advice */}
      <View style={styles.adviceContainer}>
        <Text style={styles.adviceLabel}>Physiological Insight</Text>
        <Text style={styles.adviceText}>{data.recommendation}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  tierText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginVertical: 4,
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: "800",
  },
  scoreUnit: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  fitnessAgeNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  fitnessAgeUnit: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  metricSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  longevityBanner: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryMuted,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
  },
  longevityIcon: {
    fontSize: 20,
  },
  longevityContent: {
    flex: 1,
  },
  longevityTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  longevitySub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  adviceContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
  },
  adviceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  adviceText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
});
