import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { Card, Button, InputField, StatBadge } from '@/components';
import { COLORS } from '@/constants/COLORS';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUserProfile, logoutUser } from '@/redux/slices/authSlice';
import {
  setStepGoal,
  setActiveMinutesGoal,
  setUnitSystem,
  setNotificationsEnabled,
} from '@/redux/slices/settingsSlice';
import { storageService } from '@/services/storage';
import { notificationService } from '@/services/notifications';
import { FitnessLevel } from '@/types/user';
import { formatNumber } from '@/utils/formatters';

interface ProfileScreenProps {
  navigation: any;
}

const FITNESS_LEVELS: FitnessLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const settings = useAppSelector((state) => state.settings.settings);

  // Edit Profile Modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editHeight, setEditHeight] = useState(user?.heightCm?.toString() || '175');
  const [editWeight, setEditWeight] = useState(user?.weightKg?.toString() || '70');
  const [editLevel, setEditLevel] = useState<FitnessLevel>(user?.fitnessLevel || 'Intermediate');

  // Edit Goals Modal
  const [isGoalsModalVisible, setIsGoalsModalVisible] = useState(false);
  const [tempStepGoal, setTempStepGoal] = useState(settings.stepGoal.toString());
  const [tempMinutesGoal, setTempMinutesGoal] = useState(settings.activeMinutesGoal.toString());

  const handleSaveProfile = async () => {
    const updated = {
      name: editName.trim() || user?.name || 'Alex Morgan',
      heightCm: parseInt(editHeight, 10) || 175,
      weightKg: parseInt(editWeight, 10) || 70,
      fitnessLevel: editLevel,
    };
    dispatch(updateUserProfile(updated));
    if (user) {
      await storageService.saveUserProfile({ ...user, ...updated });
    }
    setIsEditModalVisible(false);
    Alert.alert('Profile Updated', 'Your personal health profile has been saved.');
  };

  const handleSaveGoals = async () => {
    const steps = parseInt(tempStepGoal, 10) || 10000;
    const mins = parseInt(tempMinutesGoal, 10) || 45;

    dispatch(setStepGoal(steps));
    dispatch(setActiveMinutesGoal(mins));
    await storageService.saveUserSettings({
      ...settings,
      stepGoal: steps,
      activeMinutesGoal: mins,
    });

    setIsGoalsModalVisible(false);
    Alert.alert('Goals Updated', 'Your daily wellness targets have been adjusted.');
  };

  const handleToggleNotifications = async (val: boolean) => {
    dispatch(setNotificationsEnabled(val));
    if (val) {
      const granted = await notificationService.requestPermissions();
      if (granted) {
        await notificationService.scheduleDailyReminder(settings.reminderTime);
        Alert.alert('Reminders Enabled', `Daily workout notifications scheduled for ${settings.reminderTime}.`);
      } else {
        Alert.alert(
          'Notice',
          'Notification permissions require authorization on physical devices. Demo simulated notifications remain enabled.'
        );
      }
    } else {
      await notificationService.cancelAllReminders();
    }
  };

  const handleTestNotification = async () => {
    const sent = await notificationService.triggerTestNotification();
    if (sent) {
      Alert.alert('Notification Delivered', 'Check your device notification banner!');
    } else {
      Alert.alert(
        'Simulation Verified',
        'Notification triggered in local demo mode. On physical iOS/Android devices, this triggers a system notification banner.'
      );
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Sample Data?',
      'This will reset your workout history and metrics back to initial demonstration values.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await storageService.resetToDefaultMockData();
            Alert.alert('Data Reset', 'Default mock data has been restored.');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of your session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await storageService.clearAuthSession();
          dispatch(logoutUser());
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header Card */}
      <Card style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.largeAvatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Alex Morgan'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'alex@healthwellness.demo'}</Text>
            <View style={styles.badgeRow}>
              <StatBadge label={user?.fitnessLevel || 'Intermediate'} size="sm" variant="primary" />
              <StatBadge label={user?.primaryGoal || 'General Wellness'} size="sm" variant="flexibility" />
            </View>
          </View>
        </View>

        <Button
          title="✏️ Edit Profile"
          variant="outline"
          size="sm"
          onPress={() => {
            setEditName(user?.name || '');
            setEditHeight(user?.heightCm?.toString() || '175');
            setEditWeight(user?.weightKg?.toString() || '70');
            setEditLevel(user?.fitnessLevel || 'Intermediate');
            setIsEditModalVisible(true);
          }}
          style={styles.editBtn}
        />
      </Card>

      {/* Daily Goals Section */}
      <Text style={styles.sectionTitle}>Wellness Targets</Text>
      <Card style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Daily Step Target</Text>
            <Text style={styles.settingSubtext}>{formatNumber(settings.stepGoal)} steps per day</Text>
          </View>
          <Button
            title="Adjust"
            variant="ghost"
            size="sm"
            onPress={() => {
              setTempStepGoal(settings.stepGoal.toString());
              setTempMinutesGoal(settings.activeMinutesGoal.toString());
              setIsGoalsModalVisible(true);
            }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Active Minutes Target</Text>
            <Text style={styles.settingSubtext}>{settings.activeMinutesGoal} minutes per day</Text>
          </View>
          <Button
            title="Adjust"
            variant="ghost"
            size="sm"
            onPress={() => {
              setTempStepGoal(settings.stepGoal.toString());
              setTempMinutesGoal(settings.activeMinutesGoal.toString());
              setIsGoalsModalVisible(true);
            }}
          />
        </View>
      </Card>

      {/* Notifications & Reminders */}
      <Text style={styles.sectionTitle}>Reminders & Alerts</Text>
      <Card style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Daily Workout Reminder</Text>
            <Text style={styles.settingSubtext}>Scheduled at {settings.reminderTime}</Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Notification Test</Text>
            <Text style={styles.settingSubtext}>Verify push delivery</Text>
          </View>
          <Button
            title="Test Alert"
            variant="secondary"
            size="sm"
            onPress={handleTestNotification}
          />
        </View>
      </Card>

      {/* Preferences & Units */}
      <Text style={styles.sectionTitle}>App Preferences</Text>
      <Card style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Unit System</Text>
            <Text style={styles.settingSubtext}>
              {settings.unitSystem === 'metric' ? 'Metric (km, kg)' : 'Imperial (miles, lbs)'}
            </Text>
          </View>
          <Button
            title={settings.unitSystem === 'metric' ? 'Switch to Imperial' : 'Switch to Metric'}
            variant="ghost"
            size="sm"
            onPress={() => {
              const next = settings.unitSystem === 'metric' ? 'imperial' : 'metric';
              dispatch(setUnitSystem(next));
              storageService.saveUserSettings({ ...settings, unitSystem: next });
            }}
          />
        </View>
      </Card>

      {/* Data Management & Session */}
      <Text style={styles.sectionTitle}>System & Session</Text>
      <Card style={styles.settingCard}>
        <Button
          title="🔄 Reset to Default Sample Data"
          variant="secondary"
          onPress={handleResetData}
          style={{ marginBottom: 12 }}
        />
        <Button
          title="🚪 Sign Out"
          variant="danger"
          onPress={handleLogout}
        />
      </Card>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Edit Profile</Text>

            <InputField
              label="Full Name"
              value={editName}
              onChangeText={setEditName}
            />

            <InputField
              label="Height (cm)"
              value={editHeight}
              onChangeText={setEditHeight}
              keyboardType="numeric"
            />

            <InputField
              label="Weight (kg)"
              value={editWeight}
              onChangeText={setEditWeight}
              keyboardType="numeric"
            />

            <Text style={styles.fieldLabel}>Fitness Level</Text>
            <View style={styles.levelRow}>
              {FITNESS_LEVELS.map((lvl) => {
                const isSelected = editLevel === lvl;
                return (
                  <Pressable
                    key={lvl}
                    onPress={() => setEditLevel(lvl)}
                    style={[styles.levelPill, isSelected && styles.levelPillActive]}>
                    <Text style={[styles.levelText, isSelected && styles.levelTextActive]}>
                      {lvl}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalBtnRow}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setIsEditModalVisible(false)}
                style={styles.modalBtn}
              />
              <Button
                title="Save Profile"
                variant="primary"
                onPress={handleSaveProfile}
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Goals Modal */}
      <Modal visible={isGoalsModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>Adjust Daily Goals</Text>

            <InputField
              label="Daily Step Goal"
              value={tempStepGoal}
              onChangeText={setTempStepGoal}
              keyboardType="numeric"
              helperText="Recommended: 8,000 to 12,000 steps"
            />

            <InputField
              label="Active Minutes Goal"
              value={tempMinutesGoal}
              onChangeText={setTempMinutesGoal}
              keyboardType="numeric"
              helperText="Recommended: 30 to 60 minutes"
            />

            <View style={styles.modalBtnRow}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setIsGoalsModalVisible(false)}
                style={styles.modalBtn}
              />
              <Button
                title="Save Targets"
                variant="primary"
                onPress={handleSaveGoals}
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileCard: {
    padding: 20,
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  largeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  editBtn: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginTop: 6,
  },
  settingCard: {
    padding: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  settingSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  levelPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  levelPillActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  levelTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
  },
});

export default ProfileScreen;
