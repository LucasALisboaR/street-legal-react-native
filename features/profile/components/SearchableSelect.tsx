import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { BrandColors } from '@/constants/theme';

interface Option {
  code: string;
  name: string;
}

interface SearchableSelectProps {
  placeholder: string;
  options: Option[];
  value?: string;
  onSelect: (option: Option) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SearchableSelect({
  placeholder,
  options,
  value,
  onSelect,
  loading = false,
  disabled = false,
}: SearchableSelectProps) {
  // Converter options para o formato do Dropdown
  const data = options.map((opt) => ({
    label: opt.name,
    value: opt.code,
  }));

  const handleChange = (item: { label: string; value: string }) => {
    const selectedOption = options.find((opt) => opt.code === item.value);
    if (selectedOption) {
      onSelect(selectedOption);
    }
  };

  return (
    <View style={styles.container}>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        value={value || null}
        onChange={handleChange}
        placeholder={disabled ? 'Selecione a marca primeiro' : placeholder}
        search
        searchPlaceholder="Buscar..."
        maxHeight={300}
        disable={disabled || loading}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={styles.containerStyle}
        itemTextStyle={styles.itemTextStyle}
        activeColor="rgba(255,69,0,0.15)"
        renderLeftIcon={() => (
          loading ? (
            <ActivityIndicator size="small" color={BrandColors.lightGray} style={styles.icon} />
          ) : null
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1,
  },
  dropdown: {
    backgroundColor: BrandColors.mediumGray,
    borderColor: BrandColors.mediumGray,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    color: BrandColors.placeholderGray,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: BrandColors.white,
    fontSize: 16,
  },
  inputSearchStyle: {
    fontSize: 16,
    height: 44,
    marginHorizontal: 0,
    marginVertical: 0,
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
    elevation: 8,
  },
  itemTextStyle: {
    color: BrandColors.white,
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
});
