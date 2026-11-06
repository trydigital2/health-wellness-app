import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Card } from './Card';
import { COLORS } from '@/constants/COLORS';
import { calculateNorwegianProtocolTargets } from '@/utils/norwegianProtocol';

export interface NorwegianProtocolCardProps {
  userAge?: number;
  style?: StyleProp<ViewStyle>;
}

export const NorwegianProtocolCard: React.FC<NorwegianProtocolCardProps> = ({
  userAge = 30,
  style,
}) => {
  const protocol = calculateNorwegianProtocolTargets(userAge);

  return (
    <Card style={[styles.card, style]} variant="elevated">
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>4x4 Norwegian Aerobic Protocol</Text>
          <Text style={styles.subtitle}>Gold-Standard VO2 Max Interval Engine</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>AEROBIC PEAK</Text>
        </View>
      </View>

      {/* Target Zone Hero */}
      <View style={styles.heroBox}>
        <View style={styles.zoneItem}>
          <Text style={styles.zoneLabel}>WORK INTERVAL (4 MIN)</Text>
          <Text style={styles.zoneBpm}>
            {protocol.workHeartRateRange.min} - {protocol.workHeartRateRange.max}
            <Text style={styles.unit}> BPM</Text>
          </Text>
          <Text style={styles.zoneSub}>90 - 95% Max HR</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.zoneItem}>
          <Text style={styles.zoneLabel}>ACTIVE RECOVERY (3 MIN)</Text>
          <Text style={[styles.zoneBpm, { color: COLORS.primaryDark }]}>
            {protocol.recoveryHeartRateRange.min} - {protocol.recoveryHeartRateRange.max}
            <Text style={styles.unit}> BPM</Text>
          </Text>
          <Text style={styles.zoneSub}>~70% Max HR</Text>
        </View>
      </View>

      {/* Protocol Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total Duration</Text>
          <Text style={styles.metricValue}>{protocol.totalDurationMinutes} min</Text>
          <Text style={styles.metricSub}>Includes warm/cool</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Aerobic Gain</Text>
          <Text style={[styles.metricValue, { color: COLORS.success }]}>
            +{protocol.estimatedVO2MaxGainPerBlockPct}%
          </Text>
          <Text style={styles.metricSub}>Per training block</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Frequency</Text>
          <Text style={styles.metricValue}>{protocol.recommendedWeeklyFrequency}x / wk</Text>
          <Text style={styles.metricSub}>Non-consecutive days</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleGroup: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#FFE4E6',
    borderColor: '#E11D48',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E11D48',
  },
  heroBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  zoneItem: {
    flex: 1,
    alignItems: 'center',
  },
  zoneLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  zoneBpm: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E11D48',
  },
  unit: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  zoneSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricItem: {
    flex: 1,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 10,
    padding: 10,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export default NorwegianProtocolCard;
