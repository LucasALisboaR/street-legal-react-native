import { Box, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/theme';
import { EventCard } from './components/EventCard';
import { EventsHeader } from './components/EventsHeader';
import { FilterBar } from './components/FilterBar';
import { mockEvents } from './data/mock';
import { Event, EventType } from './types';

export function EventsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<EventType>('all');

  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'all') {
      return mockEvents;
    }
    return mockEvents.filter((event) => event.type === selectedFilter);
  }, [selectedFilter]);

  const todayEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  }, [filteredEvents]);

  const weekEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return (
        eventDate.getTime() > today.getTime() &&
        eventDate.getTime() <= weekEnd.getTime() &&
        !todayEvents.some((e) => e.id === event.id)
      );
    });
  }, [filteredEvents, todayEvents]);

  const handleEventPress = (event: Event) => {
    // TODO: Navegar para detalhes do evento
    console.log('Event pressed:', event.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Box flex={1} bg={BrandColors.darkGray}>
        <EventsHeader
          onCalendarPress={() => console.log('Calendar pressed')}
          onAddPress={() => router.push('/new-event')}
        />

        <FilterBar selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {todayEvents.length > 0 && (
            <VStack px="$4" mb="$6" gap="$3">
              <Text color={BrandColors.orange} fontSize="$xl" fontWeight="$bold" letterSpacing={0.5}>
                HOJE
              </Text>
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} onPress={() => handleEventPress(event)} />
              ))}
            </VStack>
          )}

          {weekEvents.length > 0 && (
            <VStack px="$4" mb="$6" gap="$3">
              <Text color={BrandColors.orange} fontSize="$xl" fontWeight="$bold" letterSpacing={0.5}>
                ESTA SEMANA
              </Text>
              {weekEvents.map((event) => (
                <EventCard key={event.id} event={event} onPress={() => handleEventPress(event)} />
              ))}
            </VStack>
          )}

          {filteredEvents.length === 0 && (
            <VStack flex={1} alignItems="center" justifyContent="center" py="$12" px="$4">
              <Text color={BrandColors.lightGray} fontSize="$md" textAlign="center">
                Nenhum evento encontrado
              </Text>
            </VStack>
          )}
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.darkGray,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
});

