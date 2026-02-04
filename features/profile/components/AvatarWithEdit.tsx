import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

interface AvatarWithEditProps {
  uri?: string | null;
  onPress: () => void;
}

export function AvatarWithEdit({ uri, onPress }: AvatarWithEditProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.avatarRing}>
        {uri ? (
          <Image source={{ uri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={BrandColors.lightGray} />
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onPress}>
        <Ionicons name="camera" size={16} color={BrandColors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    borderWidth: 2,
    borderColor: BrandColors.orange,
    borderRadius: 999,
    padding: 4,
    backgroundColor: BrandColors.darkGray,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 999,
  },
  avatarPlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.mediumGray,
  },
  editButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: BrandColors.orange,
    padding: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: BrandColors.darkGray,
  },
});

