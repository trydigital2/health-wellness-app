import React from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Card } from "./Card";
import { COLORS } from "@/constants/COLORS";
import { CardioLoadAnalysis, HeartRateZoneInfo } from "@/utils/heartRateZones";

export interface HeartRateZoneCardProps {
  cardioLoad: CardioLoadAnalysis;
  currentBpm?: number;
  style?: StyleProp<ViewStyle>;
}

export const HeartRateZoneCard: React.FC<HeartRateZoneCardProps> = ({
  cardioLoad,
  currentBpm,
  style,
}) => {
  const getClassificationColor = () => {
    switch (cardioLoad.loadClassification) {
      case "Light Recovery":
        return COLORS.primary;
      case "Moderate Aerobic":
        return COLORS.cardio;
      case "Productive Strain":
        return COLORS.calories;
      case "Overreaching Warning":
        return COLORS.danger;
      default:
        return COLORS.primary;
    }
  };

  return (
    <Card style={[styles.card, style]} variant="elevated">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Cardio Training Zones</Text>
          <Text style={styles.subtitle}>
            Max HR: {cardioLoad.maxHeartRate} bpm · Rest: {cardioLoad.restingHeartRate} bpm
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getClassificationColor() + "20" }]}>
          <Text style={[styles.badgeText, { color: getClassificationColor() }]}>
            {cardioLoad.loadClassification}
          </Text>
        </View>
      </View>

      {/* TRIMP & Strain Summary */}
      <View style={styles.loadRow}>
        <View style={styles.loadStat}>
          <Text style={styles.loadValue}>{cardioLoad.trimpScore}</Text>
          <Text style={styles.loadLabel}>TRIMP Score</Text>
        </View>
        <View style={styles.loadDivider} />
        <View style={styles.loadStat}>
          <Text style={styles.loadValue}>{cardioLoad.totalActiveMinutes}m</Text>
          <Text style={styles.loadLabel}>Total Cardio</Text>
        </View>
        <View style={styles.loadDivider} />
        <View style={styles.loadStat}>
          <Text style={styles.loadValue}>
            {currentBpm ? `${currentBpm} bpm` : `${cardioLoad.heartRateReserve} bpm`}
          </Text>
          <Text style={styles.loadLabel}>{currentBpm ? "Current Pulse" : "HR Reserve"}</Text>
        </View>
      </View>

      {/* Zones Visualizer */}
      <View style={styles.zonesContainer}>
        {cardioLoad.zones.map((zone: HeartRateZoneInfo) => {
          const isCurrent =
            currentBpm !== undefined &&
            currentBpm >= zone.minBpm &&
            currentBpm <= zone.maxBpm;

          return (
            <View
              key={zone.zone}
              style={[styles.zoneRow, isCurrent && styles.activeZoneRow]}
            >
              <View style={[styles.zonePill, { backgroundColor: zone.color }]}>
                <Text style={styles.zonePillText}>Z{zone.zone}</Text>
              </View>
              <View style={styles.zoneDetails}>
                <View style={styles.zoneTop}>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <Text style={styles.zoneBpm}>
                    {zone.minBpm}–{zone.maxBpm} bpm
                  </Text>
                </View>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: zone.color,
                        width: `${zone.intensityPercentMax}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Training Advice Insight */}
      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>Physiological Training Insight</Text>
        <Text style={styles.insightText}>{cardioLoad.trainingAdvice}</Text>
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
  loadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  loadStat: {
    alignItems: "center",
  },
  loadValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  loadLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  loadDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    height: "80%",
    alignSelf: "center",
  },
  zonesContainer: {
    gap: 10,
    marginBottom: 16,
  },
  zoneRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeZoneRow: {
    backgroundColor: COLORS.primarySoft,
  },
  zonePill: {
    width: 32,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  zonePillText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },
  zoneDetails: {
    flex: 1,
  },
  zoneTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  zoneName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  zoneBpm: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  barBackground: {
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  insightBox: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginBottom: 2,
  },
  insightText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
});
