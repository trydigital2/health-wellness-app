import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Card, Button, ProgressRing, WeeklyBarChart, DemoBanner } from '@/components';
import { COLORS } from '@/constants/COLORS';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addSteps, addWater } from '@/redux/slices/activitySlice';
import { getTimeGreeting, formatNumber } from '@/utils/formatters';
import { calculateProgressPercentage } from '@/utils/calculations';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const activity = useAppSelector((state) => state.activity.today);
  const weeklyPoints = useAppSelector((state) => state.activity.weeklyPoints);
  const settings = useAppSelector((state) => state.settings.settings);

  const greeting = getTimeGreeting();
  const userName = user?.name ? user.name.split(' ')[0] : 'Alex';

  const stepPercent = calculateProgressPercentage(activity.steps, activity.stepGoal);
  const activePercent = calculateProgressPercentage(activity.activeMinutes, activity.activeMinutesGoal);

  return (
    <View style={styles.screen}>
      <DemoBanner />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Top Header Row with Profile Shortcut */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>{greeting},</Text>
            <Text style={styles.userNameText}>{userName} 👋</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatarButton}
            accessibilityRole="button"
            accessibilityLabel="Go to Profile">
            <Text style={styles.avatarInitial}>{userName.charAt(0)}</Text>
          </Pressable>
        </View>

        {/* Main Steps Progress Card */}
        <Card style={styles.mainProgressCard}>
          <View style={styles.progressCardHeader}>
            <View>
              <Text style={styles.cardHeaderTitle}>Daily Steps</Text>
              <Text style={styles.cardHeaderSubtitle}>
                Goal: {formatNumber(activity.stepGoal)} steps
              </Text>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>{stepPercent}% Complete</Text>
            </View>
          </View>

          <View style={styles.ringContainer}>
            <ProgressRing
              progress={stepPercent}
              size={190}
              strokeWidth={16}
              color={COLORS.primary}
              trackColor={COLORS.primarySoft}>
              <View style={styles.ringCenterText}>
                <Text style={styles.ringNumber}>{formatNumber(activity.steps)}</Text>
                <Text style={styles.ringUnit}>steps today</Text>
                <Text style={styles.ringDistance}>
                  {activity.distanceKm} {settings.unitSystem === 'imperial' ? 'miles' : 'km'}
                </Text>
              </View>
            </ProgressRing>
          </View>

          {/* Quick interactive step logger to test live reactivity */}
          <View style={styles.quickAddRow}>
            <Button
              title="+500 Steps"
              variant="secondary"
              size="sm"
              onPress={() => dispatch(addSteps(500))}
              style={styles.quickAddButton}
            />
            <Button
              title="+1,000 Steps"
              variant="secondary"
              size="sm"
              onPress={() => dispatch(addSteps(1000))}
              style={styles.quickAddButton}
            />
          </View>
        </Card>

        {/* 3 Metric Summary Cards */}
        <View style={styles.metricsGrid}>
          {/* Active Minutes Card */}
          <Card style={[styles.metricCard, { borderLeftColor: COLORS.cardio, borderLeftWidth: 4 }]}>
            <Text style={styles.metricEmoji}>⏱️</Text>
            <Text style={styles.metricValue}>{activity.activeMinutes}</Text>
            <Text style={styles.metricLabel}>Active Mins</Text>
            <Text style={styles.metricGoal}>Goal: {activity.activeMinutesGoal}m</Text>
          </Card>

          {/* Calories Burned Card */}
          <Card style={[styles.metricCard, { borderLeftColor: COLORS.calories, borderLeftWidth: 4 }]}>
            <Text style={styles.metricEmoji}>🔥</Text>
            <Text style={styles.metricValue}>{activity.caloriesBurned}</Text>
            <Text style={styles.metricLabel}>Calories</Text>
            <Text style={styles.metricGoal}>Active kcal</Text>
          </Card>

          {/* Workouts Completed Today */}
          <Card style={[styles.metricCard, { borderLeftColor: COLORS.primary, borderLeftWidth: 4 }]}>
            <Text style={styles.metricEmoji}>🏋️</Text>
            <Text style={styles.metricValue}>{activity.workoutsCompleted}</Text>
            <Text style={styles.metricLabel}>Sessions</Text>
            <Text style={styles.metricGoal}>Done Today</Text>
          </Card>
        </View>

        {/* Water Log Quick Card */}
        <Card style={styles.waterCard}>
          <View style={styles.waterInfoRow}>
            <View>
              <Text style={styles.waterTitle}>💧 Hydration Tracker</Text>
              <Text style={styles.waterSubtitle}>
                {activity.waterIntakeMl} / {settings.waterGoalMl} ml logged
              </Text>
            </View>
            <Button
              title="+250 ml"
              variant="outline"
              size="sm"
              onPress={() => dispatch(addWater(250))}
            />
          </View>
        </Card>

        {/* Quick Action Navigation Buttons */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <Button
            title="⚡ Start Workout"
            variant="primary"
            onPress={() => navigation.navigate('Workouts')}
            style={styles.actionButton}
          />
          <Button
            title="📊 View Analytics"
            variant="outline"
            onPress={() => navigation.navigate('Progress')}
            style={styles.actionButton}
          />
        </View>

        {/* Weekly Overview Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>7-Day Activity Trends</Text>
          <Pressable onPress={() => navigation.navigate('Progress')}>
            <Text style={styles.seeAllText}>Details ›</Text>
          </Pressable>
        </View>

        <Card style={styles.chartCard}>
          <WeeklyBarChart data={weeklyPoints} goalValue={activity.stepGoal} metric="steps" />
        </Card>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  mainProgressCard: {
    marginBottom: 16,
    padding: 20,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardHeaderSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  ringCenterText: {
    alignItems: 'center',
  },
  ringNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  ringUnit: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  ringDistance: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  quickAddRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 12,
  },
  quickAddButton: {
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
  },
  metricEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  metricGoal: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  waterCard: {
    padding: 16,
    marginBottom: 20,
  },
  waterInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waterTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  waterSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  chartCard: {
    padding: 16,
  },
});

export default HomeScreen;
