import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, Pressable, Text, VStack } from '@gluestack-ui/themed';
import { StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { Event } from '../types';

type EventCardProps = {
  event: Event;
  onPress?: () => void;
};

const getEventTypeConfig = (type: Event['type']) => {
  switch (type) {
    case 'meetup':
      return {
        label: 'Encontro',
        icon: 'car-outline' as const,
        color: '#EF4444', // Red
      };
    case 'exhibition':
      return {
        label: 'Exposição',
        icon: 'trophy-outline' as const,
        color: '#EAB308', // Gold
      };
    case 'ride':
      return {
        label: 'Rolê',
        icon: 'map-outline' as const,
        color: '#22C55E', // Green
      };
    default:
      return {
        label: 'Evento',
        icon: 'calendar' as const,
        color: BrandColors.orange,
      };
  }
};

export function EventCard({ event, onPress }: EventCardProps) {
  const typeConfig = getEventTypeConfig(event.type);

  return (
    <Pressable onPress={onPress}>
      <Box
        bg={BrandColors.mediumGray}
        borderRadius="$2xl"
        p="$4"
        borderWidth={1}
        borderColor="rgba(255,69,0,0.15)"
        style={styles.card}
      >
        <HStack justifyContent="space-between" alignItems="flex-start" mb="$2">
          <Box
            bg={BrandColors.darkGray}
            px="$2.5"
            py="$1"
            borderRadius="$lg"
            flexDirection="row"
            alignItems="center"
            gap="$1.5"
          >
            <Ionicons name={typeConfig.icon} size={14} color={typeConfig.color} />
            <Text color={BrandColors.lightGray} fontSize="$xs" fontWeight="$medium">
              {typeConfig.label}
            </Text>
          </Box>
          {event.isLive && (
            <Box bg={BrandColors.orange} px="$2.5" py="$1" borderRadius="$lg">
              <Text color={BrandColors.white} fontSize="$xs" fontWeight="$bold">
                • AO VIVO
              </Text>
            </Box>
          )}
        </HStack>

        <VStack gap="$2" mb="$3">
          <Text color={BrandColors.white} fontSize="$lg" fontWeight="$bold">
            {event.title}
          </Text>

          <HStack alignItems="center" gap="$1.5">
            <Ionicons name="location-outline" size={14} color={BrandColors.lightGray} />
            <Text color={BrandColors.lightGray} fontSize="$sm" flex={1}>
              {event.location}
            </Text>
          </HStack>

          <HStack alignItems="center" gap="$1.5">
            <Ionicons name="time-outline" size={14} color={BrandColors.lightGray} />
            <Text color={BrandColors.lightGray} fontSize="$sm">
              {event.time}
            </Text>
          </HStack>
        </VStack>

        <HStack justifyContent="flex-end" alignItems="center" gap="$1.5">
          <Ionicons name="people-outline" size={16} color={BrandColors.lightGray} />
          <Text color={BrandColors.lightGray} fontSize="$sm">
            {event.participants}
          </Text>
        </HStack>
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: BrandColors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

