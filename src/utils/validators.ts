export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, message: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return { isValid: false, message: 'Password is required.' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'Name is required.' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters.' };
  }
  return { isValid: true };
}

export function validatePositiveNumber(value: number, fieldName: string, min = 1, max = 100000): ValidationResult {
  if (isNaN(value)) {
    return { isValid: false, message: `${fieldName} must be a valid number.` };
  }
  if (value < min) {
    return { isValid: false, message: `${fieldName} must be at least ${min}.` };
  }
  if (value > max) {
    return { isValid: false, message: `${fieldName} must be less than ${max}.` };
  }
  return { isValid: true };
}
