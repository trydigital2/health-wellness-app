import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/slices/authSlice';
import { setTodayActivity, setWeeklyPoints } from '@/redux/slices/activitySlice';
import { setHistory } from '@/redux/slices/workoutSlice';
import { setSettings } from '@/redux/slices/settingsSlice';
import { storageService } from '@/services/storage';
import { COLORS } from '@/constants/COLORS';

const AppNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    primary: COLORS.primary,
    card: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.borderLight,
  },
};

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        // Seed initial data if first run
        await storageService.seedInitialDataIfFirstTime();

        // Hydrate Redux state from AsyncStorage
        const [profile, settings, history, activity] = await Promise.all([
          storageService.getUserProfile(),
          storageService.getUserSettings(),
          storageService.getWorkoutHistory(),
          storageService.getDailyActivity(),
        ]);

        if (profile) dispatch(setUser(profile));
        if (settings) dispatch(setSettings(settings));
        if (history) dispatch(setHistory(history));
        if (activity) dispatch(setTodayActivity(activity));
      } catch (e) {
        console.warn('[RootNavigator] Bootstrap error:', e);
      } finally {
        setIsInitializing(false);
      }
    }

    bootstrap();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppNavigationTheme}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});

export default RootNavigator;
