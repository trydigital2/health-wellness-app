import { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyActivity, DayMetricPoint, ProgressPeriod, ProgressSummary } from '@/types/activity';
import { storageService } from '@/services/storage';
import { MOCK_TODAY_ACTIVITY, MOCK_WEEKLY_POINTS } from '@/data/mockActivities';
import {
  calculateProgressPercentage,
  calculateStepDistance,
  calculateStreak,
} from '@/utils/calculations';

export function useActivity() {
  const [activity, setActivity] = useState<DailyActivity>(MOCK_TODAY_ACTIVITY);
  const [weeklyPoints, setWeeklyPoints] = useState<DayMetricPoint[]>(MOCK_WEEKLY_POINTS);
  const [period, setPeriod] = useState<ProgressPeriod>('Week');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadActivity = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await storageService.getDailyActivity();
      setActivity(data);

      // Update today's entry in weeklyPoints
      setWeeklyPoints((prev) =>
        prev.map((pt) =>
          pt.isToday
            ? {
                ...pt,
                steps: data.steps,
                activeMinutes: data.activeMinutes,
                calories: data.caloriesBurned,
                goalMet: data.steps >= data.stepGoal,
              }
            : pt
        )
      );
    } catch (e) {
      console.warn('[useActivity] Failed to load activity:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  // Steps Progress %
  const stepProgressPercent = useMemo(
    () => calculateProgressPercentage(activity.steps, activity.stepGoal),
    [activity.steps, activity.stepGoal]
  );

  // Active Minutes Progress %
  const activeMinutesProgressPercent = useMemo(
    () => calculateProgressPercentage(activity.activeMinutes, activity.activeMinutesGoal),
    [activity.activeMinutes, activity.activeMinutesGoal]
  );

  // Streak
  const currentStreak = useMemo(() => calculateStreak(weeklyPoints), [weeklyPoints]);

  // Quick Action: Add Steps
  const addSteps = useCallback(
    async (delta: number) => {
      const newSteps = activity.steps + delta;
      const { distance } = calculateStepDistance(newSteps);
      const updated: DailyActivity = {
        ...activity,
        steps: newSteps,
        distanceKm: distance,
        caloriesBurned: activity.caloriesBurned + Math.round(delta * 0.04),
      };
      setActivity(updated);
      await storageService.saveDailyActivity(updated);
    },
    [activity]
  );

  // Quick Action: Add Water
  const addWater = useCallback(
    async (deltaMl: number) => {
      const updated: DailyActivity = {
        ...activity,
        waterIntakeMl: Math.max(0, activity.waterIntakeMl + deltaMl),
      };
      setActivity(updated);
      await storageService.saveDailyActivity(updated);
    },
    [activity]
  );

  // Progress summary derived from period
  const progressSummary: ProgressSummary = useMemo(() => {
    const totalSteps = weeklyPoints.reduce((acc, p) => acc + p.steps, 0);
    const totalActive = weeklyPoints.reduce((acc, p) => acc + p.activeMinutes, 0);
    const totalCals = weeklyPoints.reduce((acc, p) => acc + p.calories, 0);
    const daysWithGoalMet = weeklyPoints.filter((p) => p.goalMet).length;

    return {
      period,
      totalSteps,
      averageDailySteps: Math.round(totalSteps / weeklyPoints.length),
      totalActiveMinutes: totalActive,
      totalCalories: totalCals,
      workoutsCompleted: weeklyPoints.length,
      currentStreakDays: currentStreak,
      completionRatePercentage: Math.round((daysWithGoalMet / weeklyPoints.length) * 100),
      dailyPoints: weeklyPoints,
    };
  }, [weeklyPoints, period, currentStreak]);

  return {
    activity,
    weeklyPoints,
    stepProgressPercent,
    activeMinutesProgressPercent,
    currentStreak,
    period,
    setPeriod,
    progressSummary,
    isLoading,
    addSteps,
    addWater,
    refreshActivity: loadActivity,
  };
}
