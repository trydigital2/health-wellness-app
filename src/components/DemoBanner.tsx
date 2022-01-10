import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '@/constants/COLORS';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.indicatorDot} />
        <Text style={styles.text}>
          <Text style={styles.boldText}>Demo Mode Active: </Text>
          Metrics are simulated for local development & demonstration.
        </Text>
      </View>
      <Pressable
        onPress={() => setDismissed(true)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryMuted,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primarySoft,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    color: COLORS.primaryDark,
    flex: 1,
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '700',
  },
  closeButton: {
    paddingLeft: 8,
  },
  closeText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
});

export default DemoBanner;
