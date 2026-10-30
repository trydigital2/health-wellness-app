import React from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Card } from "./Card";
import { COLORS } from "@/constants/COLORS";
import { SleepAnalyticsResult } from "@/utils/sleepAnalytics";

export interface SleepAnalyticsCardProps {
  sleepData: SleepAnalyticsResult;
  style?: StyleProp<ViewStyle>;
}

export const SleepAnalyticsCard: React.FC<SleepAnalyticsCardProps> = ({
  sleepData,
  style,
}) => {
  const getReadinessColor = () => {
    switch (sleepData.readinessRating) {
      case "Optimal Restoration":
        return COLORS.primary; // Emerald Teal
      case "Balanced Sleep":
        return COLORS.cardio; // Sky Blue
      case "Insufficient Rest":
        return COLORS.warning; // Amber
      case "Critical Sleep Deficit":
        return COLORS.danger; // Red
      default:
        return COLORS.primary;
    }
  };

  return (
    <Card style={[styles.card, style]} variant="elevated">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Sleep Architecture & Circadian</Text>
          <Text style={styles.subtitle}>
            {sleepData.totalHours} hrs slept · {sleepData.completedCycles} cycles
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getReadinessColor() + "20" }]}>
          <Text style={[styles.badgeText, { color: getReadinessColor() }]}>
            {sleepData.readinessRating}
          </Text>
        </View>
      </View>

      {/* Primary KPI Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: getReadinessColor() }]}>
            {sleepData.circadianReadinessScore}
          </Text>
          <Text style={styles.metricLabel}>Readiness Score</Text>
          <Text style={styles.metricSub}>out of 100</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{sleepData.sleepEfficiencyPercent}%</Text>
          <Text style={styles.metricLabel}>Efficiency</Text>
          <Text style={styles.metricSub}>in bed</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {sleepData.sleepDebtMinutes > 0 ? `${Math.round(sleepData.sleepDebtMinutes / 60 * 10) / 10}h` : "0h"}
          </Text>
          <Text style={styles.metricLabel}>Sleep Debt</Text>
          <Text style={styles.metricSub}>{sleepData.sleepDebtMinutes > 0 ? "deficit" : "cleared"}</Text>
        </View>
      </View>

      {/* Sleep Stages Proportions */}
      <View style={styles.stagesContainer}>
        <Text style={styles.stagesTitle}>Sleep Stages Breakdown</Text>
        <View style={styles.stagesMultiBar}>
          <View style={[styles.stageSegment, { flex: sleepData.deepSleepPercent, backgroundColor: "#7C3AED" }]} />
          <View style={[styles.stageSegment, { flex: sleepData.remSleepPercent, backgroundColor: "#0284C7" }]} />
          <View style={[styles.stageSegment, { flex: sleepData.lightSleepPercent, backgroundColor: "#0D9488" }]} />
        </View>
        <View style={styles.stageLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#7C3AED" }]} />
            <Text style={styles.legendText}>Deep {sleepData.deepSleepPercent}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#0284C7" }]} />
            <Text style={styles.legendText}>REM {sleepData.remSleepPercent}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#0D9488" }]} />
            <Text style={styles.legendText}>Light {sleepData.lightSleepPercent}%</Text>
          </View>
        </View>
      </View>

      {/* Bedtime Recommendation */}
      <View style={styles.bedtimeBox}>
        <View style={styles.bedtimeTop}>
          <Text style={styles.bedtimeLabel}>🌙 Recommended Target Bedtime</Text>
          <Text style={styles.bedtimeValue}>{sleepData.optimalBedtime}</Text>
        </View>
        <Text style={styles.adviceText}>{sleepData.recoveryAdvice}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metricSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    height: "75%",
    alignSelf: "center",
  },
  stagesContainer: {
    marginBottom: 14,
  },
  stagesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  stagesMultiBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  stageSegment: {
    height: "100%",
  },
  stageLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  bedtimeBox: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  bedtimeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  bedtimeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },
  bedtimeValue: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  adviceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

export default SleepAnalyticsCard;
