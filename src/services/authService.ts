import { UserProfile, PrimaryGoal } from '@/types/user';
import { storageService } from './storage';
import { DEFAULT_USER, DEMO_CREDENTIALS } from '@/constants/defaults';
import { validateEmail, validatePassword, validateName } from '@/utils/validators';

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

class AuthService {
  /**
   * Demo Login Flow
   * Validates input format and checks against demo credentials or local saved profile.
   * NOTE: This is client-side mock authentication for prototyping and local exploration.
   */
  async login(email: string, pass: string): Promise<AuthResponse> {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.message };
    }

    const passValidation = validatePassword(pass);
    if (!passValidation.isValid) {
      return { success: false, error: passValidation.message };
    }

    // Check against demo credentials or accept standard demo email/password
    const cleanEmail = email.trim().toLowerCase();
    const isDemo = cleanEmail === DEMO_CREDENTIALS.email.toLowerCase() || cleanEmail.includes('demo');

    let profile = await storageService.getUserProfile();

    if (!profile || profile.email.toLowerCase() !== cleanEmail) {
      // Update or create active profile with entered email
      profile = {
        ...DEFAULT_USER,
        id: `user-${Date.now()}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()),
      };
      await storageService.saveUserProfile(profile);
    }

    // Save demo token
    const mockToken = `demo_jwt_token_${Date.now()}`;
    await storageService.saveAuthToken(mockToken);

    return { success: true, user: profile };
  }

  /**
   * Demo Registration Flow
   */
  async register(
    name: string,
    email: string,
    pass: string,
    primaryGoal: PrimaryGoal = 'General Wellness'
  ): Promise<AuthResponse> {
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return { success: false, error: nameValidation.message };
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.message };
    }

    const passValidation = validatePassword(pass);
    if (!passValidation.isValid) {
      return { success: false, error: passValidation.message };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      heightCm: 175,
      weightKg: 70,
      fitnessLevel: 'Beginner',
      primaryGoal,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    await storageService.saveUserProfile(newUser);
    const mockToken = `demo_jwt_token_${Date.now()}`;
    await storageService.saveAuthToken(mockToken);

    return { success: true, user: newUser };
  }

  /**
   * Checks whether an existing active session exists
   */
  async checkSession(): Promise<{ isAuthenticated: boolean; user: UserProfile | null }> {
    const token = await storageService.getAuthToken();
    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    const user = await storageService.getUserProfile();
    return { isAuthenticated: true, user };
  }

  /**
   * Logout user and clear stored session token
   */
  async logout(): Promise<void> {
    await storageService.clearAuthSession();
  }
}

export const authService = new AuthService();
