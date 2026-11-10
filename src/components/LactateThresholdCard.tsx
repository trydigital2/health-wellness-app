import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Card } from './Card';
import { COLORS } from '@/constants/COLORS';
import { calculateLactateThreshold } from '../utils/lactateThreshold';

export interface LactateThresholdCardProps {
  userAge?: number;
  restingHr?: number;
  currentHr?: number;
  style?: StyleProp<ViewStyle>;
}

export const LactateThresholdCard: React.FC<LactateThresholdCardProps> = ({
  userAge = 32,
  restingHr = 58,
  currentHr = 164,
  style,
}) => {
  const result = calculateLactateThreshold(userAge, restingHr);

  const isNearThreshold = Math.abs(currentHr - result.anaerobicThresholdHr) <= 5;
  const isAboveThreshold = currentHr > result.anaerobicThresholdHr;

  return (
    <Card style={[styles.card, style]} variant="elevated">
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Lactate Threshold (LTHR)</Text>
          <Text style={styles.subtitle}>Conconi Deflection & Threshold Analyzer</Text>
        </View>
        <View style={[styles.badge, isAboveThreshold ? styles.badgeHigh : styles.badgeOptimal]}>
          <Text style={[styles.badgeText, isAboveThreshold ? styles.badgeTextHigh : styles.badgeTextOptimal]}>
            {isAboveThreshold ? 'ANAEROBIC' : isNearThreshold ? 'SWEET SPOT' : 'AEROBIC'}
          </Text>
        </View>
      </View>

      {/* Hero Display */}
      <View style={styles.heroBox}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>LT1 (AEROBIC)</Text>
          <Text style={styles.metricBpm}>
            {result.aerobicThresholdHr} <Text style={styles.unit}>BPM</Text>
          </Text>
          <Text style={styles.metricSub}>FatMax Zone</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>LT2 (THRESHOLD)</Text>
          <Text style={[styles.metricBpm, styles.highlightBpm]}>
            {result.anaerobicThresholdHr} <Text style={styles.unit}>BPM</Text>
          </Text>
          <Text style={styles.metricSub}>~4.0 mmol/L</Text>
        </View>
      </View>

      {/* Real-time Comparison */}
      <View style={styles.currentBar}>
        <Text style={styles.currentLabel}>Current Live HR:</Text>
        <Text style={styles.currentVal}>{currentHr} BPM</Text>
        <Text style={styles.statusText}>
          {isAboveThreshold
            ? 'Above LTHR: Acidosis Accumulation'
            : isNearThreshold
            ? 'At Threshold: Maximum Sustainable Pace'
            : 'Below LTHR: Clearance Rate Exceeds Production'}
        </Text>
      </View>

      {/* Guidance */}
      <View style={styles.guidanceBox}>
        <Text style={styles.guidanceTitle}>Pacing Guidance</Text>
        <Text style={styles.guidanceDesc}>{result.paceGuidance}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
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
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeOptimal: {
    backgroundColor: COLORS.primarySoft,
  },
  badgeHigh: {
    backgroundColor: COLORS.hiitBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextOptimal: {
    color: COLORS.primaryDark,
  },
  badgeTextHigh: {
    color: COLORS.hiit,
  },
  heroBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 14,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  metricBpm: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  highlightBpm: {
    color: COLORS.warning,
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  metricSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  currentBar: {
    backgroundColor: COLORS.surfaceSecondary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  currentLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  currentVal: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  guidanceBox: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
  },
  guidanceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  guidanceDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default LactateThresholdCard;
