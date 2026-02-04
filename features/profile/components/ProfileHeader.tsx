import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@gluestack-ui/themed';

import { BrandColors } from '@/constants/theme';

interface ProfileHeaderProps {
  onPressSettings: () => void;
  onPressLogout: () => void;
}

export function ProfileHeader({ onPressSettings, onPressLogout }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PERFIL</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onPressSettings}>
          <Ionicons name="settings-outline" size={18} color={BrandColors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onPressLogout}>
          <Ionicons name="log-out-outline" size={18} color={BrandColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: BrandColors.white,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: BrandColors.mediumGray,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

