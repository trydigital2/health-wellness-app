import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure default notification handler for foreground display
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.log('[Notifications] Notification handler setup skipped in current environment');
}

export interface NotificationStatus {
  isSupported: boolean;
  hasPermission: boolean;
  message?: string;
}

class NotificationService {
  /**
   * Checks if local notifications are supported in this execution context
   */
  async checkSupport(): Promise<NotificationStatus> {
    if (Platform.OS === 'web') {
      return {
        isSupported: false,
        hasPermission: false,
        message: 'Push notifications are not configured for Web browser mode.',
      };
    }

    try {
      const { status } = await Notifications.getPermissionsAsync();
      return {
        isSupported: true,
        hasPermission: status === 'granted',
      };
    } catch (error) {
      return {
        isSupported: false,
        hasPermission: false,
        message: 'Notification service unavailable in simulator or development environment.',
      };
    }
  }

  /**
   * Requests permission to deliver local notifications
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('workout-reminders', {
          name: 'Workout Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0D9488',
        });
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.warn('[Notifications] Request permission failed:', error);
      return false;
    }
  }

  /**
   * Schedules a daily recurring workout reminder at specified HH:mm
   */
  async scheduleDailyReminder(timeString: string = '08:30'): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      // Cancel existing workout reminders first
      await this.cancelAllReminders();

      const [hourStr, minuteStr] = timeString.split(':');
      const hour = parseInt(hourStr || '8', 10);
      const minute = parseInt(minuteStr || '30', 10);

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for your daily workout! 💪',
          body: 'Stay consistent with your wellness goals. Tap to start today’s session.',
          data: { screen: 'workouts' },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });

      return identifier;
    } catch (error) {
      console.warn('[Notifications] Failed to schedule daily reminder:', error);
      return null;
    }
  }

  /**
   * Triggers an immediate test notification to verify delivery
   */
  async triggerTestNotification(): Promise<boolean> {
    try {
      const hasPerm = await this.requestPermissions();
      if (!hasPerm) return false;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Health & Wellness Reminder Test 🌟',
          body: 'Your notification setup is working perfectly! Keep moving toward your goals.',
          sound: true,
        },
        trigger: null, // deliver immediately
      });
      return true;
    } catch (error) {
      console.warn('[Notifications] Immediate test notification failed:', error);
      return false;
    }
  }

  /**
   * Cancels all scheduled notifications
   */
  async cancelAllReminders(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.warn('[Notifications] Cancel reminders failed:', error);
    }
  }
}

export const notificationService = new NotificationService();
