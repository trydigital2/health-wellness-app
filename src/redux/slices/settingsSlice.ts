import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSettings, UnitSystem } from '@/types/user';
import { DEFAULT_SETTINGS } from '@/constants/defaults';

interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
}

const initialState: SettingsState = {
  settings: DEFAULT_SETTINGS,
  isLoading: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<UserSettings>) => {
      state.settings = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setStepGoal: (state, action: PayloadAction<number>) => {
      state.settings.stepGoal = action.payload;
    },
    setActiveMinutesGoal: (state, action: PayloadAction<number>) => {
      state.settings.activeMinutesGoal = action.payload;
    },
    setWeeklyWorkoutsGoal: (state, action: PayloadAction<number>) => {
      state.settings.weeklyWorkoutsGoal = action.payload;
    },
    setUnitSystem: (state, action: PayloadAction<UnitSystem>) => {
      state.settings.unitSystem = action.payload;
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.settings.notificationsEnabled = action.payload;
    },
    setReminderTime: (state, action: PayloadAction<string>) => {
      state.settings.reminderTime = action.payload;
    },
  },
});

export const {
  setSettings,
  updateSettings,
  setStepGoal,
  setActiveMinutesGoal,
  setWeeklyWorkoutsGoal,
  setUnitSystem,
  setNotificationsEnabled,
  setReminderTime,
} = settingsSlice.actions;

export default settingsSlice.reducer;
