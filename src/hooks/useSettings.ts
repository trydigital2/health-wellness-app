import { useState, useEffect, useCallback } from 'react';
import { UserSettings } from '@/types/user';
import { DEFAULT_SETTINGS } from '@/constants/defaults';
import { storageService } from '@/services/storage';
import { notificationService } from '@/services/notifications';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notificationStatusMsg, setNotificationStatusMsg] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await storageService.getUserSettings();
      setSettings(data);
    } catch (e) {
      console.warn('[useSettings] Failed to load settings:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(
    async (partial: Partial<UserSettings>) => {
      const updated: UserSettings = { ...settings, ...partial };
      setSettings(updated);
      await storageService.saveUserSettings(updated);
    },
    [settings]
  );

  const toggleNotifications = useCallback(
    async (enabled: boolean) => {
      if (enabled) {
        const granted = await notificationService.requestPermissions();
        if (granted) {
          await notificationService.scheduleDailyReminder(settings.reminderTime);
          await updateSettings({ notificationsEnabled: true });
          setNotificationStatusMsg('Daily workout reminders enabled!');
        } else {
          // If not granted, still toggle local preference with explanatory message
          await updateSettings({ notificationsEnabled: false });
          setNotificationStatusMsg('Notification permissions were not granted by the system.');
        }
      } else {
        await notificationService.cancelAllReminders();
        await updateSettings({ notificationsEnabled: false });
        setNotificationStatusMsg('Reminders disabled.');
      }
    },
    [settings.reminderTime, updateSettings]
  );

  const setReminderTime = useCallback(
    async (timeStr: string) => {
      await updateSettings({ reminderTime: timeStr });
      if (settings.notificationsEnabled) {
        await notificationService.scheduleDailyReminder(timeStr);
        setNotificationStatusMsg(`Reminder set for ${timeStr}`);
      }
    },
    [settings.notificationsEnabled, updateSettings]
  );

  const testNotification = useCallback(async () => {
    const success = await notificationService.triggerTestNotification();
    if (success) {
      setNotificationStatusMsg('Test notification sent! Check your notification center.');
    } else {
      setNotificationStatusMsg('Notification trigger simulated (Web or Simulator environment).');
    }
    return success;
  }, []);

  const resetAllData = useCallback(async () => {
    await storageService.resetToDefaultMockData();
    await loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    notificationStatusMsg,
    setNotificationStatusMsg,
    updateSettings,
    toggleNotifications,
    setReminderTime,
    testNotification,
    resetAllData,
    refreshSettings: loadSettings,
  };
}
