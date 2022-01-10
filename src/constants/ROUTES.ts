export const ROUTES = {
  // Auth Stack
  AUTH_STACK: 'AuthStack',
  LOGIN: 'Login',
  REGISTER: 'Register',

  // Main App Tabs
  MAIN_TABS: 'MainTabs',
  HOME: 'Home',
  WORKOUTS: 'Workouts',
  PROGRESS: 'Progress',
  PROFILE: 'Profile',

  // Nested Screens
  WORKOUT_DETAIL: 'WorkoutDetail',
  WORKOUT_SESSION: 'WorkoutSession',
  EDIT_GOALS: 'EditGoals',
} as const;

export default ROUTES;
