import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

interface ProfileCardProps {
  children: ReactNode;
}

export function ProfileCard({ children }: ProfileCardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 24,
    backgroundColor: BrandColors.mediumGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
