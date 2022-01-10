import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/main/HomeScreen';
import { WorkoutsScreen } from '@/screens/main/WorkoutsScreen';
import { WorkoutDetailScreen } from '@/screens/main/WorkoutDetailScreen';
import { ProgressScreen } from '@/screens/main/ProgressScreen';
import { ProfileScreen } from '@/screens/main/ProfileScreen';
import { COLORS } from '@/constants/COLORS';

import {
  HealthHomeIcon,
  HealthWorkoutIcon,
  HealthProgressIcon,
  HealthProfileIcon,
} from '@/components/icons/HealthTabIcons';

export type MainTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  WorkoutDetail: { workoutId: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

function MainTabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.borderLight,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          color: COLORS.textPrimary,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Health & Wellness',
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <HealthHomeIcon focused={focused} size={22} />,
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          title: 'Workouts',
          tabBarLabel: 'Workouts',
          tabBarIcon: ({ focused }) => <HealthWorkoutIcon focused={focused} size={22} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Health Progress',
          tabBarLabel: 'Progress',
          tabBarIcon: ({ focused }) => <HealthProgressIcon focused={focused} size={22} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile & Settings',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <HealthProfileIcon focused={focused} size={22} />,
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default AppNavigator;
