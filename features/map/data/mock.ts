import { MapEvent, NearbyUser } from '@/features/map/types';

export const mockCenterCoordinate: [number, number] = [-43.97023, -19.94693];

const eventTemplates: Array<Omit<MapEvent, 'coordinate'> & { offset: [number, number] }> = [
  {
    id: 'event-1',
    title: 'Night Cruise BH',
    locationName: 'Av. Raja Gabaglia',
    dateTime: 'Hoje • 22:30',
    type: 'meetup',
    offset: [-0.0021, 0.0018],
  },
  {
    id: 'event-2',
    title: 'Encontro de Crew',
    locationName: 'Rua José Hélio Freitas',
    dateTime: 'Sáb • 19:00',
    type: 'garage',
    offset: [0.0016, 0.0034],
  },
  {
    id: 'event-3',
    title: 'Sessão Fotografia',
    locationName: 'Parque Oneida',
    dateTime: 'Dom • 16:00',
    type: 'photoshoot',
    offset: [-0.0032, 0.0006],
  },
  {
    id: 'event-4',
    title: 'Sprint Sul',
    locationName: 'Av. Niza Marques',
    dateTime: 'Sex • 23:45',
    type: 'race',
    offset: [0.0024, -0.0021],
  },
];

const nearbyUserTemplates: Array<Omit<NearbyUser, 'coordinate'> & { offset: [number, number] }> = [
  {
    id: 'user-1',
    name: 'Carla',
    offset: [-0.0016, -0.0012],
  },
  {
    id: 'user-2',
    name: 'Rafa',
    offset: [0.0008, -0.0004],
  },
  {
    id: 'user-3',
    name: 'Luca',
    offset: [0.0021, 0.0002],
  },
];

const applyOffset = (center: [number, number], offset: [number, number]): [number, number] => [
  center[0] + offset[0],
  center[1] + offset[1],
];

export const buildMockEvents = (center: [number, number]): MapEvent[] =>
  eventTemplates.map((event) => ({
    ...event,
    coordinate: applyOffset(center, event.offset),
  }));

export const buildMockNearbyUsers = (center: [number, number]): NearbyUser[] =>
  nearbyUserTemplates.map((user) => ({
    ...user,
    coordinate: applyOffset(center, user.offset),
  }));
