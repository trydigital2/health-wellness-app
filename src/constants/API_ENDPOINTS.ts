/**
 * API Endpoints configuration for current local-first architecture
 * and future backend REST API integration.
 */
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.healthwellness.demo/v1',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  ACTIVITY: {
    DAILY: '/activity/daily',
    WEEKLY_SUMMARY: '/activity/summary',
    LOG_STEPS: '/activity/steps',
  },
  WORKOUTS: {
    LIST: '/workouts',
    DETAIL: (id: string) => `/workouts/${id}`,
    LOG_SESSION: '/workouts/sessions',
    HISTORY: '/workouts/history',
  },
  PROFILE: {
    SETTINGS: '/profile/settings',
    GOALS: '/profile/goals',
  },
};

export default API_ENDPOINTS;
