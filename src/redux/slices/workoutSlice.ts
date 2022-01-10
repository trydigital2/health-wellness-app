import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workout, WorkoutCategory, CompletedWorkoutSession } from '@/types/workout';
import { MOCK_WORKOUTS } from '@/data/mockWorkouts';
import { MOCK_WORKOUT_HISTORY } from '@/data/mockActivities';

interface WorkoutState {
  workouts: Workout[];
  history: CompletedWorkoutSession[];
  selectedCategory: WorkoutCategory;
  searchQuery: string;
  activeSession: {
    workout: Workout | null;
    elapsedSeconds: number;
    currentExerciseIndex: number;
    isPaused: boolean;
    isActive: boolean;
  };
}

const initialState: WorkoutState = {
  workouts: MOCK_WORKOUTS,
  history: MOCK_WORKOUT_HISTORY,
  selectedCategory: 'All',
  searchQuery: '',
  activeSession: {
    workout: null,
    elapsedSeconds: 0,
    currentExerciseIndex: 0,
    isPaused: false,
    isActive: false,
  },
};

export const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<WorkoutCategory>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setHistory: (state, action: PayloadAction<CompletedWorkoutSession[]>) => {
      state.history = action.payload;
    },
    addCompletedSession: (state, action: PayloadAction<CompletedWorkoutSession>) => {
      state.history.unshift(action.payload);
    },
    startSession: (state, action: PayloadAction<Workout>) => {
      state.activeSession = {
        workout: action.payload,
        elapsedSeconds: 0,
        currentExerciseIndex: 0,
        isPaused: false,
        isActive: true,
      };
    },
    pauseSession: (state) => {
      state.activeSession.isPaused = true;
    },
    resumeSession: (state) => {
      state.activeSession.isPaused = false;
    },
    tickSession: (state) => {
      if (state.activeSession.isActive && !state.activeSession.isPaused) {
        state.activeSession.elapsedSeconds += 1;
      }
    },
    nextExercise: (state) => {
      if (
        state.activeSession.workout &&
        state.activeSession.currentExerciseIndex < state.activeSession.workout.exercises.length - 1
      ) {
        state.activeSession.currentExerciseIndex += 1;
      }
    },
    prevExercise: (state) => {
      if (state.activeSession.currentExerciseIndex > 0) {
        state.activeSession.currentExerciseIndex -= 1;
      }
    },
    finishSession: (state) => {
      state.activeSession = {
        workout: null,
        elapsedSeconds: 0,
        currentExerciseIndex: 0,
        isPaused: false,
        isActive: false,
      };
    },
  },
});

export const {
  setCategory,
  setSearchQuery,
  setHistory,
  addCompletedSession,
  startSession,
  pauseSession,
  resumeSession,
  tickSession,
  nextExercise,
  prevExercise,
  finishSession,
} = workoutSlice.actions;

export default workoutSlice.reducer;
