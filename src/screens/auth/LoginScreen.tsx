import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Button, InputField, Card } from '@/components';
import { COLORS } from '@/constants/COLORS';
import { DEMO_CREDENTIALS } from '@/constants/defaults';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/slices/authSlice';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleFillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setErrors({});
  };

  const handleLogin = async () => {
    setErrors({});
    setLoading(true);

    const res = await authService.login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      dispatch(setUser(res.user));
    } else {
      Alert.alert('Sign In Failed', res.error || 'Please check your email and password.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Branding */}
        <View style={styles.brandContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.appName}>Health & Wellness</Text>
          <Text style={styles.tagline}>Sign in to continue your fitness journey</Text>
        </View>

        {/* Login Form Card */}
        <Card style={styles.formCard}>
          <InputField
            label="Email Address"
            placeholder="alex@healthwellness.demo"
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
            placeholder="••••••••"
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          {/* Quick Demo Fill Button */}
          <Button
            title="⚡ Fill Demo Account"
            onPress={handleFillDemo}
            variant="secondary"
            style={styles.demoFillButton}
          />
        </Card>

        {/* Notice Card */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerBold}>Demo Authentication: </Text>
            Credentials are stored locally in AsyncStorage for testing and development.
          </Text>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account yet?</Text>
          <Button
            title="Create Account"
            variant="ghost"
            size="sm"
            onPress={() => navigation.navigate('Register')}
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
    paddingVertical: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoEmoji: {
    fontSize: 32,
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
  loginButton: {
    marginTop: 8,
  },
  demoFillButton: {
    marginTop: 12,
  },
  disclaimerBox: {
    backgroundColor: COLORS.surfaceSecondary,
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  disclaimerBold: {
    fontWeight: '700',
    color: COLORS.primaryDark,
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

export default LoginScreen;
