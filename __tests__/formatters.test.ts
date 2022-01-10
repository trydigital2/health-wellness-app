import { formatDuration, formatMinutesHuman, formatNumber } from '../src/utils/formatters';

describe('Formatters Utilities', () => {
  describe('formatDuration', () => {
    it('should format seconds into MM:SS format', () => {
      expect(formatDuration(0)).toBe('00:00');
      expect(formatDuration(45)).toBe('00:45');
      expect(formatDuration(90)).toBe('01:30');
      expect(formatDuration(1250)).toBe('20:50');
    });

    it('should format durations over an hour into HH:MM:SS format', () => {
      expect(formatDuration(3600)).toBe('1:00:00');
      expect(formatDuration(3665)).toBe('1:01:05');
    });

    it('should handle NaN or negative values gracefully', () => {
      expect(formatDuration(-10)).toBe('00:00');
      expect(formatDuration(NaN)).toBe('00:00');
    });
  });

  describe('formatMinutesHuman', () => {
    it('should format minutes under 60 as X min', () => {
      expect(formatMinutesHuman(25)).toBe('25 min');
      expect(formatMinutesHuman(45)).toBe('45 min');
    });

    it('should format minutes over 60 with hours and minutes', () => {
      expect(formatMinutesHuman(60)).toBe('1h');
      expect(formatMinutesHuman(75)).toBe('1h 15m');
      expect(formatMinutesHuman(120)).toBe('2h');
    });
  });

  describe('formatNumber', () => {
    it('should add commas for thousands', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(10000)).toBe('10,000');
      expect(formatNumber(1250500)).toBe('1,250,500');
    });
  });
});
