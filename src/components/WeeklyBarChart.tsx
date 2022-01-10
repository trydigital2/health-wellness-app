import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { DayMetricPoint } from '@/types/activity';
import { COLORS } from '@/constants/COLORS';

export interface WeeklyBarChartProps {
  data: DayMetricPoint[];
  goalValue?: number;
  metric?: 'steps' | 'activeMinutes' | 'calories';
  height?: number;
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({
  data,
  goalValue = 10000,
  metric = 'steps',
  height = 180,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(data.length - 1);

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.emptyText}>No activity data available</Text>
      </View>
    );
  }

  const values = data.map((d) => d[metric]);
  const maxValue = Math.max(...values, goalValue, 1);
  const chartHeight = height - 50; // leave room for labels and tooltip
  const barWidth = 24;
  const totalWidth = 320;
  const spacing = (totalWidth - data.length * barWidth) / (data.length + 1);

  const selectedPoint = data[selectedDayIndex] || data[data.length - 1];

  // Calculate Y position for a given value
  const getY = (val: number) => {
    const ratio = Math.min(1, Math.max(0, val / maxValue));
    return chartHeight - ratio * (chartHeight - 20) + 10;
  };

  const goalY = getY(goalValue);

  return (
    <View style={styles.container}>
      {/* Selected Day Info Badge */}
      <View style={styles.tooltipHeader}>
        <Text style={styles.tooltipDate}>
          {selectedPoint.shortDay} (Day {selectedPoint.dayNumber}) {selectedPoint.isToday ? '• Today' : ''}
        </Text>
        <Text style={styles.tooltipValue}>
          {metric === 'steps'
            ? `${selectedPoint.steps.toLocaleString()} steps`
            : metric === 'activeMinutes'
            ? `${selectedPoint.activeMinutes} mins`
            : `${selectedPoint.calories} kcal`}
        </Text>
      </View>

      <Svg width="100%" height={chartHeight + 35} viewBox={`0 0 ${totalWidth} ${chartHeight + 35}`}>
        {/* Goal line */}
        <Line
          x1={spacing / 2}
          y1={goalY}
          x2={totalWidth - spacing / 2}
          y2={goalY}
          stroke={COLORS.primary}
          strokeDasharray="4 4"
          strokeWidth="1.5"
          opacity={0.6}
        />
        <SvgText
          x={totalWidth - 4}
          y={goalY - 4}
          fontSize="10"
          fill={COLORS.primary}
          fontWeight="600"
          textAnchor="end">
          Goal
        </SvgText>

        {/* Bars and labels */}
        {data.map((point, index) => {
          const val = point[metric];
          const barHeight = Math.max(6, ((val / maxValue) * (chartHeight - 20)));
          const x = spacing + index * (barWidth + spacing);
          const y = chartHeight + 10 - barHeight;
          const isSelected = index === selectedDayIndex;
          const isGoalMet = point.goalMet;

          const barColor = isSelected
            ? COLORS.primary
            : isGoalMet
            ? COLORS.primaryLight
            : COLORS.border;

          return (
            <React.Fragment key={point.date}>
              {/* Background Bar Track */}
              <Rect
                x={x}
                y={10}
                width={barWidth}
                height={chartHeight}
                rx={6}
                fill={COLORS.surfaceSecondary}
              />
              {/* Active Value Bar */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill={barColor}
              />
              {/* Day Label */}
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight + 28}
                fontSize="11"
                fill={isSelected ? COLORS.textPrimary : COLORS.textSecondary}
                fontWeight={isSelected ? '700' : '500'}
                textAnchor="middle">
                {point.shortDay}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Interactive touch overlay */}
      <View style={[StyleSheet.absoluteFill, styles.touchRow, { top: 40, height: chartHeight + 30 }]}>
        {data.map((_, index) => (
          <Pressable
            key={index}
            style={styles.touchArea}
            onPress={() => setSelectedDayIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  tooltipDate: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tooltipValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  touchRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  touchArea: {
    flex: 1,
    height: '100%',
  },
});

export default WeeklyBarChart;
