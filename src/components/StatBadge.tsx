import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '@/constants/COLORS';

export interface StatBadgeProps {
  label: string;
  variant?: 'primary' | 'cardio' | 'strength' | 'hiit' | 'flexibility' | 'mindfulness' | 'success' | 'warning';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const StatBadge: React.FC<StatBadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'cardio':
        return { bg: COLORS.cardioBg, text: COLORS.cardio };
      case 'strength':
        return { bg: COLORS.strengthBg, text: COLORS.strength };
      case 'hiit':
        return { bg: COLORS.hiitBg, text: COLORS.hiit };
      case 'flexibility':
        return { bg: COLORS.flexibilityBg, text: COLORS.flexibility };
      case 'mindfulness':
        return { bg: COLORS.mindfulnessBg, text: COLORS.mindfulness };
      case 'success':
        return { bg: COLORS.primaryMuted, text: COLORS.success };
      case 'warning':
        return { bg: COLORS.caloriesBg, text: COLORS.warning };
      case 'primary':
      default:
        return { bg: COLORS.primarySoft, text: COLORS.primaryDark };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        size === 'sm' && styles.size_sm,
        style,
      ]}>
      <Text
        style={[
          styles.text,
          { color: colors.text },
          size === 'sm' && styles.text_sm,
          textStyle,
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  size_sm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  text_sm: {
    fontSize: 10,
  },
});

export default StatBadge;
