import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Card, WeeklyBarChart, StatBadge, DemoBanner } from '@/components';
import { COLORS } from '@/constants/COLORS';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSelectedPeriod } from '@/redux/slices/activitySlice';
import { ProgressPeriod } from '@/types/activity';
import { calculateStreak } from '@/utils/calculations';
import { formatNumber } from '@/utils/formatters';

interface ProgressScreenProps {
  navigation: any;
}

const PERIODS: ProgressPeriod[] = ['Day', 'Week', 'Month'];
type MetricType = 'steps' | 'activeMinutes' | 'calories';

export const ProgressScreen: React.FC<ProgressScreenProps> = () => {
  const dispatch = useAppDispatch();
  const selectedPeriod = useAppSelector((state) => state.activity.selectedPeriod);
  const weeklyPoints = useAppSelector((state) => state.activity.weeklyPoints);
  const settings = useAppSelector((state) => state.settings.settings);
  const history = useAppSelector((state) => state.workout.history);

  const [activeMetric, setActiveMetric] = useState<MetricType>('steps');

  // Aggregated Stats
  const totalSteps = weeklyPoints.reduce((acc, p) => acc + p.steps, 0);
  const avgSteps = Math.round(totalSteps / Math.max(1, weeklyPoints.length));
  const totalActive = weeklyPoints.reduce((acc, p) => acc + p.activeMinutes, 0);
  const totalCalories = weeklyPoints.reduce((acc, p) => acc + p.calories, 0);
  const daysMet = weeklyPoints.filter((p) => p.goalMet).length;
  const complianceRate = Math.round((daysMet / Math.max(1, weeklyPoints.length)) * 100);
  const streak = calculateStreak(weeklyPoints);

  const goalForMetric =
    activeMetric === 'steps'
      ? settings.stepGoal
      : activeMetric === 'activeMinutes'
      ? settings.activeMinutesGoal
      : 550;

  return (
    <View style={styles.screen}>
      <DemoBanner />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header & Streak Card */}
        <Card style={styles.streakCard}>
          <View style={styles.streakRow}>
            <View>
              <Text style={styles.streakLabel}>Consistency Streak</Text>
              <Text style={styles.streakCount}>{streak} Days Strong 🔥</Text>
              <Text style={styles.streakSubtext}>
                You met your step goal on {daysMet} of 7 days this week.
              </Text>
            </View>
            <View style={styles.complianceBadge}>
              <Text style={styles.compliancePercent}>{complianceRate}%</Text>
              <Text style={styles.complianceLabel}>Success Rate</Text>
            </View>
          </View>
        </Card>

        {/* Period Selector Tabs */}
        <View style={styles.periodTabsRow}>
          {PERIODS.map((period) => {
            const isSelected = selectedPeriod === period;
            return (
              <Pressable
                key={period}
                onPress={() => dispatch(setSelectedPeriod(period))}
                style={[styles.periodTab, isSelected && styles.periodTabActive]}>
                <Text style={[styles.periodTabText, isSelected && styles.periodTabTextActive]}>
                  {period}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Metric Switcher Pills */}
        <View style={styles.metricSwitcherRow}>
          <Pressable
            style={[styles.metricPill, activeMetric === 'steps' && styles.metricPillActive]}
            onPress={() => setActiveMetric('steps')}>
            <Text
              style={[
                styles.metricPillText,
                activeMetric === 'steps' && styles.metricPillTextActive,
              ]}>
              Steps
            </Text>
          </Pressable>
          <Pressable
            style={[styles.metricPill, activeMetric === 'activeMinutes' && styles.metricPillActive]}
            onPress={() => setActiveMetric('activeMinutes')}>
            <Text
              style={[
                styles.metricPillText,
                activeMetric === 'activeMinutes' && styles.metricPillTextActive,
              ]}>
              Active Mins
            </Text>
          </Pressable>
          <Pressable
            style={[styles.metricPill, activeMetric === 'calories' && styles.metricPillActive]}
            onPress={() => setActiveMetric('calories')}>
            <Text
              style={[
                styles.metricPillText,
                activeMetric === 'calories' && styles.metricPillTextActive,
              ]}>
              Calories
            </Text>
          </Pressable>
        </View>

        {/* SVG Chart Card */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.chartTitle}>Activity Trends</Text>
            <StatBadge label={`Goal: ${formatNumber(goalForMetric)}`} size="sm" variant="primary" />
          </View>

          <WeeklyBarChart
            data={weeklyPoints}
            goalValue={goalForMetric}
            metric={activeMetric}
            height={200}
          />
        </Card>

        {/* Statistics Grid */}
        <Text style={styles.sectionTitle}>Summary Statistics</Text>
        <View style={styles.statsGrid}>
          <Card style={styles.statBox}>
            <Text style={styles.statIcon}>👟</Text>
            <Text style={styles.statVal}>{formatNumber(totalSteps)}</Text>
            <Text style={styles.statLbl}>Total Steps</Text>
            <Text style={styles.statSub}>Avg: {formatNumber(avgSteps)}/day</Text>
          </Card>

          <Card style={styles.statBox}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statVal}>{totalActive} min</Text>
            <Text style={styles.statLbl}>Active Time</Text>
            <Text style={styles.statSub}>This Week</Text>
          </Card>

          <Card style={styles.statBox}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statVal}>{formatNumber(totalCalories)}</Text>
            <Text style={styles.statLbl}>Calories Burned</Text>
            <Text style={styles.statSub}>Active kcal</Text>
          </Card>

          <Card style={styles.statBox}>
            <Text style={styles.statIcon}>🏋️</Text>
            <Text style={styles.statVal}>{history.length}</Text>
            <Text style={styles.statLbl}>Workouts Logged</Text>
            <Text style={styles.statSub}>Total History</Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  streakCard: {
    padding: 18,
    marginBottom: 16,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
  },
  streakCount: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
    marginBottom: 4,
  },
  streakSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    maxWidth: 200,
  },
  complianceBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  compliancePercent: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  complianceLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  periodTabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodTabActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  periodTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodTabTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  metricSwitcherRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  metricPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  metricPillTextActive: {
    color: COLORS.white,
  },
  chartCard: {
    padding: 18,
    marginBottom: 20,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLbl: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export default ProgressScreen;
