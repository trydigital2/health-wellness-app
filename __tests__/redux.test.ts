import authReducer, { setUser, updateUserProfile, logoutUser } from '../src/redux/slices/authSlice';
import workoutReducer, {
  setCategory,
  setSearchQuery,
  addCompletedSession,
} from '../src/redux/slices/workoutSlice';
import activityReducer, { addSteps, addWater } from '../src/redux/slices/activitySlice';
import settingsReducer, { setStepGoal, setUnitSystem } from '../src/redux/slices/settingsSlice';

describe('Redux Slices', () => {
  describe('authSlice', () => {
    it('should handle updateUserProfile', () => {
      const state = authReducer(undefined, updateUserProfile({ name: 'Taylor Swift' }));
      expect(state.user?.name).toBe('Taylor Swift');
    });

    it('should handle logoutUser', () => {
      const state = authReducer(undefined, logoutUser());
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('workoutSlice', () => {
    it('should change workout category filter', () => {
      const state = workoutReducer(undefined, setCategory('HIIT'));
      expect(state.selectedCategory).toBe('HIIT');
    });

    it('should update search query', () => {
      const state = workoutReducer(undefined, setSearchQuery('core'));
      expect(state.searchQuery).toBe('core');
    });

    it('should prepend completed workout session to history', () => {
      const newSession = {
        id: 'test-session-1',
        workoutId: 'w-1',
        workoutTitle: 'Quick HIIT',
        category: 'HIIT' as const,
        startedAt: '2026-10-20T10:00:00Z',
        completedAt: '2026-10-20T10:20:00Z',
        durationSeconds: 1200,
        caloriesBurned: 220,
        exercisesCompleted: 5,
        totalExercises: 5,
      };

      const state = workoutReducer(undefined, addCompletedSession(newSession));
      expect(state.history[0].id).toBe('test-session-1');
      expect(state.history[0].caloriesBurned).toBe(220);
    });
  });

  describe('activitySlice', () => {
    it('should add steps and increment calories', () => {
      const state = activityReducer(undefined, addSteps(1000));
      expect(state.today.steps).toBe(8420); // 7420 initial + 1000
      expect(state.today.caloriesBurned).toBe(525); // 485 + 40
    });

    it('should log water intake', () => {
      const state = activityReducer(undefined, addWater(250));
      expect(state.today.waterIntakeMl).toBe(2050); // 1800 initial + 250
    });
  });

  describe('settingsSlice', () => {
    it('should update step goal and unit system', () => {
      let state = settingsReducer(undefined, setStepGoal(12000));
      expect(state.settings.stepGoal).toBe(12000);

      state = settingsReducer(state, setUnitSystem('imperial'));
      expect(state.settings.unitSystem).toBe('imperial');
    });
  });
});
