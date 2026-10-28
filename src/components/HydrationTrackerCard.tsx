import React from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from "react-native";
import { Card } from "./Card";
import { COLORS } from "@/constants/COLORS";
import { HydrationStatusResult } from "@/utils/hydration";

export interface HydrationTrackerCardProps {
  status: HydrationStatusResult;
  onAddWater?: (amountMl: number) => void;
  style?: StyleProp<ViewStyle>;
}

export const HydrationTrackerCard: React.FC<HydrationTrackerCardProps> = ({
  status,
  onAddWater,
  style,
}) => {
  const getLevelColor = () => {
    switch (status.level) {
      case "Optimal":
        return COLORS.water || "#38BDF8";
      case "Good":
        return COLORS.primary || "#0D9488";
      case "Needs Water":
        return COLORS.warning || "#F59E0B";
      default:
        return COLORS.danger || "#EF4444";
    }
  };

  return (
    <Card style={[styles.card, style]} variant="elevated">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Hydration Tracker</Text>
          <Text style={styles.subtitle}>
            Goal: {status.targetMl} mL ({status.targetGlasses} glasses)
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getLevelColor() + "20" }]}>
          <Text style={[styles.badgeText, { color: getLevelColor() }]}>
            {status.level}
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{status.consumedMl}</Text>
          <Text style={styles.metricLabel}>Consumed</Text>
          <Text style={styles.metricSub}>mL today</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{status.percentage}%</Text>
          <Text style={styles.metricLabel}>Daily Goal</Text>
          <Text style={styles.metricSub}>{status.glassesCount} glasses</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{status.remainingMl}</Text>
          <Text style={styles.metricLabel}>Remaining</Text>
          <Text style={styles.metricSub}>to target</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${Math.min(100, status.percentage)}%`,
              backgroundColor: getLevelColor(),
            },
          ]}
        />
      </View>

      {/* Quick Add Buttons */}
      {onAddWater && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onAddWater(250)}
          >
            <Text style={styles.actionButtonText}>+250 mL (1 Glass)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onAddWater(500)}
          >
            <Text style={styles.actionButtonText}>+500 mL (Bottle)</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.insightBox}>
        <Text style={styles.insightText}>💧 {status.pacingInsight}</Text>
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
    marginBottom: 12,
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
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 14,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.waterBg || "#F0F9FF",
    borderWidth: 1,
    borderColor: COLORS.water || "#38BDF8",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primaryDark || "#0F766E",
  },
  insightBox: {
    backgroundColor: COLORS.surfaceSecondary,
    padding: 10,
    borderRadius: 8,
  },
  insightText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

export default HydrationTrackerCard;
