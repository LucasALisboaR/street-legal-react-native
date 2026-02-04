import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, Pressable, Text, VStack } from '@gluestack-ui/themed';
import { StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/theme';

type EventsHeaderProps = {
  onCalendarPress?: () => void;
  onAddPress?: () => void;
};

export function EventsHeader({ onCalendarPress, onAddPress }: EventsHeaderProps) {
  return (
    <VStack px="$4" pt="$4" pb="$2" gap="$1">
      <HStack justifyContent="space-between" alignItems="flex-start">
        <VStack flex={1}>
          <Text color={BrandColors.white} fontSize="$4xl" fontWeight="$bold" letterSpacing={-0.5}>
            EVENTOS
          </Text>
          <Text color={BrandColors.lightGray} fontSize="$sm" mt="$1">
            Encontros e rolês
          </Text>
        </VStack>

        <HStack gap="$2">
          <Pressable
            onPress={onCalendarPress}
            bg={BrandColors.mediumGray}
            w={44}
            h={44}
            borderRadius="$xl"
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons name="calendar-outline" size={20} color={BrandColors.white} />
          </Pressable>

          <Pressable
            onPress={onAddPress}
            bg={BrandColors.orange}
            w={44}
            h={44}
            borderRadius="$xl"
            alignItems="center"
            justifyContent="center"
          >
            <Ionicons name="add" size={24} color={BrandColors.white} />
          </Pressable>
        </HStack>
      </HStack>
    </VStack>
  );
}

