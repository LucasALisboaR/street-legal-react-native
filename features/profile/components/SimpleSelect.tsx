import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { BrandColors } from '@/constants/theme';

interface SimpleSelectOption {
  label: string;
  value: string;
}

interface SimpleSelectProps {
  placeholder: string;
  options: SimpleSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SimpleSelect({
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
}: SimpleSelectProps) {
  const handleChange = (item: { label: string; value: string }) => {
    onChange(item.value);
  };

  return (
    <View style={styles.container}>
      <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        value={value || null}
        onChange={handleChange}
        placeholder={placeholder}
        maxHeight={180}
        disable={disabled}
        dropdownPosition="auto"
        showsVerticalScrollIndicator={true}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.containerStyle}
        itemTextStyle={styles.itemTextStyle}
        activeColor="rgba(255,69,0,0.15)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 9999,
  },
  dropdown: {
    backgroundColor: BrandColors.mediumGray,
    borderColor: BrandColors.mediumGray,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    zIndex: 9999,
  },
  placeholderStyle: {
    color: BrandColors.placeholderGray,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: BrandColors.white,
    fontSize: 16,
  },
  containerStyle: {
    backgroundColor: BrandColors.mediumGray,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 9999,
  },
  itemTextStyle: {
    color: BrandColors.white,
    fontSize: 16,
  },
});

