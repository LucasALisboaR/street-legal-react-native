import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BrandColors, MapColors } from '@/constants/theme';
import { IconButton } from '@/components/ui/icon-button';

type Props = {
  placeholder?: string;
  onFilterPress?: () => void;
};

export function SearchBar({
  placeholder = 'Buscar eventos, crews, lugares…',
  onFilterPress,
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={BrandColors.lightGray} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={BrandColors.lightGray}
        style={styles.input}
      />
      <IconButton icon="options-outline" onPress={onFilterPress} style={styles.filterButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: MapColors.overlayBackground,
    borderRadius: 16,
    paddingLeft: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: MapColors.overlayBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  input: {
    flex: 1,
    color: BrandColors.white,
    fontSize: 15,
  },
  filterButton: {
    backgroundColor: 'rgba(33, 33, 33, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 12,
  },
});
