import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

interface StatMiniCardProps {
  label: string;
  value: number;
}

export function StatMiniCard({ label, value }: StatMiniCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: BrandColors.mediumGray,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  value: {
    color: BrandColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  label: {
    color: BrandColors.lightGray,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
