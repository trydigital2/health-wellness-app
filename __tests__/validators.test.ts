import {
  validateEmail,
  validatePassword,
  validateName,
  validatePositiveNumber,
} from '../src/utils/validators';

describe('Validators Utilities', () => {
  describe('validateEmail', () => {
    it('should accept valid email formats', () => {
      expect(validateEmail('alex@healthwellness.demo').isValid).toBe(true);
      expect(validateEmail('user.name+tag@domain.co').isValid).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('plainaddress').isValid).toBe(false);
      expect(validateEmail('@missingusername.com').isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept passwords with 6 or more characters', () => {
      expect(validatePassword('123456').isValid).toBe(true);
      expect(validatePassword('Wellness2026!').isValid).toBe(true);
    });

    it('should reject passwords shorter than 6 characters', () => {
      expect(validatePassword('12345').isValid).toBe(false);
      expect(validatePassword('').isValid).toBe(false);
    });
  });

  describe('validateName', () => {
    it('should accept valid non-empty names', () => {
      expect(validateName('Alex Morgan').isValid).toBe(true);
      expect(validateName('Jo').isValid).toBe(true);
    });

    it('should reject empty or 1-character names', () => {
      expect(validateName('').isValid).toBe(false);
      expect(validateName('A').isValid).toBe(false);
    });
  });

  describe('validatePositiveNumber', () => {
    it('should validate positive numbers within bounds', () => {
      expect(validatePositiveNumber(10000, 'Step Goal', 1000, 50000).isValid).toBe(true);
      expect(validatePositiveNumber(500, 'Step Goal', 1000, 50000).isValid).toBe(false);
      expect(validatePositiveNumber(60000, 'Step Goal', 1000, 50000).isValid).toBe(false);
    });
  });
});
