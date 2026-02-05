import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

interface AuthInputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  error?: boolean;
}

export function AuthInput({ icon, secureTextEntry, error, style, onFocus, onBlur, ...props }: AuthInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = secureTextEntry;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Determina a cor da borda: erro tem prioridade, depois foco, depois transparente
  const borderColor = error ? '#FF3B30' : isFocused ? BrandColors.orange : 'transparent';

  return (
    <View style={[styles.container, { borderColor }]}>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={error ? '#FF3B30' : isFocused ? BrandColors.orange : BrandColors.white}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.input, !icon && styles.inputWithoutIcon]}
        placeholderTextColor={BrandColors.placeholderGray}
        secureTextEntry={isPassword && !isPasswordVisible}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={BrandColors.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.mediumGray,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 8,
  },
  containerError: {
    borderColor: '#FF3B30',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: BrandColors.white,
    fontSize: 16,
    padding: 0,
  },
  inputWithoutIcon: {
    paddingLeft: 0,
  },
  eyeIcon: {
    padding: 4,
  },
});

