import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { COLORS } from '@/constants/COLORS';

interface IconProps {
  focused: boolean;
  color?: string;
  size?: number;
}

/**
 * Health Home Icon: Heartbeat pulse rhythm within an activity circle
 */
export const HealthHomeIcon: React.FC<IconProps> = ({
  focused,
  color = COLORS.primary,
  size = 24,
}) => {
  const iconColor = focused ? COLORS.primary : COLORS.textMuted;
  const fillColor = focused ? COLORS.primarySoft : 'transparent';

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Background shield/circle on focus */}
        <Circle cx="12" cy="12" r="10" stroke={iconColor} strokeWidth="2" fill={fillColor} />
        {/* Vital ECG Heart Pulse Path */}
        <Path
          d="M5 12h3l2-4 3 8 2-5 2 2h3"
          stroke={iconColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

/**
 * Health Workout Icon: Fitness barbell / dumbbell with weight plates
 */
export const HealthWorkoutIcon: React.FC<IconProps> = ({
  focused,
  color = COLORS.primary,
  size = 24,
}) => {
  const iconColor = focused ? COLORS.primary : COLORS.textMuted;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Left outer plate */}
        <Rect x="2" y="7" width="3" height="10" rx="1.5" fill={iconColor} />
        {/* Left inner plate */}
        <Rect x="6" y="9" width="2" height="6" rx="1" fill={iconColor} />
        {/* Center bar with grip */}
        <Rect x="8" y="11" width="8" height="2" fill={iconColor} />
        {/* Right inner plate */}
        <Rect x="16" y="9" width="2" height="6" rx="1" fill={iconColor} />
        {/* Right outer plate */}
        <Rect x="19" y="7" width="3" height="10" rx="1.5" fill={iconColor} />
      </Svg>
    </View>
  );
};

/**
 * Health Progress Icon: Activity metrics graph and rising health trend
 */
export const HealthProgressIcon: React.FC<IconProps> = ({
  focused,
  color = COLORS.primary,
  size = 24,
}) => {
  const iconColor = focused ? COLORS.primary : COLORS.textMuted;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Bar 1 */}
        <Rect x="4" y="14" width="3" height="7" rx="1.5" fill={iconColor} />
        {/* Bar 2 */}
        <Rect x="10.5" y="9" width="3" height="12" rx="1.5" fill={iconColor} />
        {/* Bar 3 */}
        <Rect x="17" y="4" width="3" height="17" rx="1.5" fill={iconColor} />
        {/* Rising spark line */}
        <Path
          d="M3 13l6-5 5 4 7-8"
          stroke={focused ? COLORS.calories : iconColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

/**
 * Health Profile Icon: User silhouette with a wellness leaf badge
 */
export const HealthProfileIcon: React.FC<IconProps> = ({
  focused,
  color = COLORS.primary,
  size = 24,
}) => {
  const iconColor = focused ? COLORS.primary : COLORS.textMuted;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* User Head */}
        <Circle cx="12" cy="7" r="4" stroke={iconColor} strokeWidth="2" fill={focused ? iconColor : 'transparent'} />
        {/* Body curve */}
        <Path
          d="M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2"
          stroke={iconColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Small wellness leaf badge accent */}
        <Path
          d="M17 3c2 0 3 1 3 3 0 2-2 3-3 3s-1-2-1-3c0-1.5 1-3 1-3z"
          fill={focused ? COLORS.primaryLight : 'transparent'}
          stroke={iconColor}
          strokeWidth="1.2"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
});
