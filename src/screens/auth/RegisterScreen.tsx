import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import { Button, InputField, Card } from '@/components';
import { COLORS } from '@/constants/COLORS';
import { PrimaryGoal } from '@/types/user';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/slices/authSlice';

interface RegisterScreenProps {
  navigation: any;
}

const GOALS: PrimaryGoal[] = [
  'General Wellness',
  'Weight Loss',
  'Cardio Endurance',
  'Muscle Gain',
];

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<PrimaryGoal>('General Wellness');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrors({});
    setLoading(true);

    const res = await authService.register(name, email, password, selectedGoal);
    setLoading(false);

    if (res.success && res.user) {
      dispatch(setUser(res.user));
    } else {
      Alert.alert('Registration Failed', res.error || 'Please check your information.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.brandContainer}>
          <Text style={styles.appName}>Create Account</Text>
          <Text style={styles.tagline}>Start tracking your wellness habits today</Text>
        </View>

        <Card style={styles.formCard}>
          <InputField
            label="Full Name"
            placeholder="e.g. Jordan Smith"
            value={name}
            onChangeText={(txt) => {
              setName(txt);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
          />

          <InputField
            label="Email Address"
            placeholder="jordan@example.com"
            value={email}
            onChangeText={(txt) => {
              setEmail(txt);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            error={errors.email}
          />

          <InputField
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
            error={errors.password}
          />

          {/* Primary Goal Selector */}
          <Text style={styles.sectionLabel}>Primary Fitness Goal</Text>
          <View style={styles.goalsGrid}>
            {GOALS.map((goal) => {
              const isSelected = selectedGoal === goal;
              return (
                <Pressable
                  key={goal}
                  onPress={() => setSelectedGoal(goal)}
                  style={[styles.goalPill, isSelected && styles.goalPillSelected]}>
                  <Text style={[styles.goalText, isSelected && styles.goalTextSelected]}>
                    {goal}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />
        </Card>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            title="Sign In"
            variant="ghost"
            size="sm"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  formCard: {
    padding: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginTop: 4,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  goalPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  goalPillSelected: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  goalText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  goalTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  registerButton: {
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default RegisterScreen;
