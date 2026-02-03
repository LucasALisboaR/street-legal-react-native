import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { BrandColors } from '@/constants/theme';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function AuthButton({
  title,
  icon,
  loading = false,
  variant = 'primary',
  disabled,
  style,
  ...props
}: AuthButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
        (disabled || loading) && styles.buttonDisabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={BrandColors.white} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color={BrandColors.white} style={styles.icon} />}
          <Text style={styles.buttonText}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 8,
    minHeight: 52,
  },
  buttonPrimary: {
    backgroundColor: BrandColors.mediumGray,
  },
  buttonSecondary: {
    backgroundColor: BrandColors.orange,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: BrandColors.white,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

