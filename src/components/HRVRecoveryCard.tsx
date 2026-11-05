import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { COLORS } from '@/constants/COLORS';
import { HRVRecoverySummary } from '@/utils/hrvRecovery';

export interface HRVRecoveryCardProps {
  data: HRVRecoverySummary;
  onBreathingSessionPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const HRVRecoveryCard: React.FC<HRVRecoveryCardProps> = ({
  data,
  onBreathingSessionPress,
  style,
}) => {
  const isPositiveDelta = data.deviationPct >= 0;

  return (
    <Card style={[styles.card, style]} variant="elevated">
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.title}>HRV & Autonomic Recovery</Text>
          <Text style={styles.subtitle}>Vagal Tone & Training Readiness</Text>
        </View>
        <View
          style={[
            styles.tierBadge,
            { backgroundColor: data.color + '1A', borderColor: data.color },
          ]}
        >
          <Text style={[styles.tierText, { color: data.color }]}>
            {data.tier.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Main Readiness Score Hero */}
      <View style={styles.heroSection}>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreValue, { color: data.color }]}>
            {data.readinessScore}
          </Text>
          <Text style={styles.scoreMax}>/ 100</Text>
        </View>

        <View style={styles.heroDetails}>
          <Text style={styles.stateLabel}>{data.autonomicState}</Text>
          <View style={styles.deviationRow}>
            <Text
              style={[
                styles.deviationBadge,
                {
                  color: isPositiveDelta ? COLORS.success : COLORS.danger,
                  backgroundColor: isPositiveDelta
                    ? COLORS.success + '15'
                    : COLORS.danger + '15',
                },
              ]}
            >
              {isPositiveDelta ? `+${data.deviationPct}%` : `${data.deviationPct}%`}
            </Text>
            <Text style={styles.baselineCompareText}>vs 7-day average</Text>
          </View>
        </View>
      </View>

      {/* Key Biometrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Waking RMSSD</Text>
          <View style={styles.metricValueRow}>
            <Text style={styles.metricValue}>{data.currentRMSSD}</Text>
            <Text style={styles.metricUnit}>ms</Text>
          </View>
          <Text style={styles.metricSub}>Base: {data.baseline7DayRMSSD} ms</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>ln(RMSSD)</Text>
          <View style={styles.metricValueRow}>
            <Text style={styles.metricValue}>{data.lnRMSSD}</Text>
          </View>
          <Text style={styles.metricSub}>Log-normalized scale</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Resonance Rate</Text>
          <View style={styles.metricValueRow}>
            <Text style={styles.metricValue}>{data.breathingPacingCpm}</Text>
            <Text style={styles.metricUnit}>cpm</Text>
          </View>
          <Text style={styles.metricSub}>Coherence breathing</Text>
        </View>
      </View>

      {/* Physiological Guidance Recommendation */}
      <View style={styles.recommendationContainer}>
        <Text style={styles.recommendationTitle}>TRAINING GUIDANCE</Text>
        <Text style={styles.recommendationText}>{data.recommendation}</Text>
      </View>

      {/* Vagal Coherence Breathing Action */}
      {onBreathingSessionPress && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onBreathingSessionPress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            Start 5-Min Coherence Breathing (6 bpm)
          </Text>
        </TouchableOpacity>
      )}
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
  headerTitleGroup: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
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
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  scoreCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    paddingRight: 14,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  scoreValue: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 38,
  },
  scoreMax: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  heroDetails: {
    flex: 1,
    paddingLeft: 14,
  },
  stateLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  deviationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviationBadge: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  baselineCompareText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  metricBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    padding: 10,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricUnit: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 3,
    fontWeight: '500',
  },
  metricSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  recommendationContainer: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  recommendationTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  actionButton: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default HRVRecoveryCard;
