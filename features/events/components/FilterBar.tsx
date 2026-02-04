import { Ionicons } from '@expo/vector-icons';
import { Box, Pressable, ScrollView, Text } from '@gluestack-ui/themed';
import { StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { EventType } from '../types';

type FilterBarProps = {
  selectedFilter: EventType;
  onFilterChange: (filter: EventType) => void;
};

const filters: Array<{ type: EventType; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { type: 'all', label: 'Todos', icon: 'grid-outline' },
  { type: 'meetup', label: 'Encontro', icon: 'car-outline' },
  { type: 'exhibition', label: 'Exposição', icon: 'trophy-outline' },
  { type: 'ride', label: 'Rolê', icon: 'map-outline' },
];

const getFilterColor = (type: EventType) => {
  switch (type) {
    case 'meetup':
      return '#EF4444';
    case 'exhibition':
      return '#EAB308';
    case 'ride':
      return '#22C55E';
    default:
      return BrandColors.white;
  }
};

export function FilterBar({ selectedFilter, onFilterChange }: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.scrollView}
    >
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.type;
        const iconColor = isSelected ? BrandColors.white : getFilterColor(filter.type);

        return (
          <Pressable key={filter.type} onPress={() => onFilterChange(filter.type)} style={styles.filterItem}>
            <Box
              bg={isSelected ? BrandColors.orange : BrandColors.mediumGray}
              px="$3.5"
              py="$2.5"
              borderRadius="$xl"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              style={styles.filterBox}
            >
              <Ionicons name={filter.icon} size={16} color={iconColor} style={styles.icon} />
              <Text
                color={isSelected ? BrandColors.white : BrandColors.lightGray}
                fontSize="$sm"
                fontWeight={isSelected ? '$semibold' : '$normal'}
                style={styles.filterText}
              >
                {filter.label}
              </Text>
            </Box>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  scrollContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItem: {
    marginRight: 8,
  },
  filterBox: {
    minHeight: 40,
  },
  icon: {
    marginRight: 6,
  },
  filterText: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

