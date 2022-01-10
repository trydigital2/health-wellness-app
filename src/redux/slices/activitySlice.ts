import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyActivity, DayMetricPoint, ProgressPeriod } from '@/types/activity';
import { MOCK_TODAY_ACTIVITY, MOCK_WEEKLY_POINTS } from '@/data/mockActivities';
import { calculateStepDistance } from '@/utils/calculations';

interface ActivityState {
  today: DailyActivity;
  weeklyPoints: DayMetricPoint[];
  selectedPeriod: ProgressPeriod;
  isLoading: boolean;
}

const initialState: ActivityState = {
  today: MOCK_TODAY_ACTIVITY,
  weeklyPoints: MOCK_WEEKLY_POINTS,
  selectedPeriod: 'Week',
  isLoading: false,
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setTodayActivity: (state, action: PayloadAction<DailyActivity>) => {
      state.today = action.payload;
    },
    setWeeklyPoints: (state, action: PayloadAction<DayMetricPoint[]>) => {
      state.weeklyPoints = action.payload;
    },
    setSelectedPeriod: (state, action: PayloadAction<ProgressPeriod>) => {
      state.selectedPeriod = action.payload;
    },
    addSteps: (state, action: PayloadAction<number>) => {
      state.today.steps += action.payload;
      const { distance } = calculateStepDistance(state.today.steps);
      state.today.distanceKm = distance;
      state.today.caloriesBurned += Math.round(action.payload * 0.04);

      // sync today's point in weeklyPoints
      state.weeklyPoints = state.weeklyPoints.map((pt) =>
        pt.isToday
          ? {
              ...pt,
              steps: state.today.steps,
              calories: state.today.caloriesBurned,
              goalMet: state.today.steps >= state.today.stepGoal,
            }
          : pt
      );
    },
    addWater: (state, action: PayloadAction<number>) => {
      state.today.waterIntakeMl = Math.max(0, state.today.waterIntakeMl + action.payload);
    },
    recordCompletedWorkoutActivity: (
      state,
      action: PayloadAction<{ durationSeconds: number; caloriesBurned: number }>
    ) => {
      const activeMins = Math.round(action.payload.durationSeconds / 60);
      state.today.activeMinutes += activeMins;
      state.today.caloriesBurned += action.payload.caloriesBurned;
      state.today.workoutsCompleted += 1;

      state.weeklyPoints = state.weeklyPoints.map((pt) =>
        pt.isToday
          ? {
              ...pt,
              activeMinutes: state.today.activeMinutes,
              calories: state.today.caloriesBurned,
            }
          : pt
      );
    },
  },
});

export const {
  setTodayActivity,
  setWeeklyPoints,
  setSelectedPeriod,
  addSteps,
  addWater,
  recordCompletedWorkoutActivity,
} = activitySlice.actions;

export default activitySlice.reducer;
