import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

export function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <View style={styles.logoGlow} />
        <View style={styles.iconContainer}>
          <Ionicons name="speedometer-outline" size={32} color={BrandColors.orange} />
        </View>
        <Text style={styles.logoText}>GH</Text>
      </View>
      <View style={styles.brandContainer}>
        <Text style={styles.brandName}>
          GEARHEAD <Text style={styles.brandNameAccent}>BR</Text>
        </Text>
        <Text style={styles.tagline}>A comunidade que acelera junto</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: BrandColors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: BrandColors.orange,
    opacity: 0.3,
    shadowColor: BrandColors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    marginTop: -8,
  },
  logoText: {
    position: 'absolute',
    color: BrandColors.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 24,
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: BrandColors.white,
    letterSpacing: 1,
    marginBottom: 8,
  },
  brandNameAccent: {
    color: BrandColors.orange,
  },
  tagline: {
    fontSize: 14,
    color: BrandColors.lightGray,
    fontWeight: '400',
  },
});

