import { MapEvent, NearbyUser } from '@/features/map/types';

export const mockCenterCoordinate: [number, number] = [-43.97023, -19.94693];

export const mockEvents: MapEvent[] = [
  {
    id: 'event-1',
    title: 'Night Cruise BH',
    locationName: 'Av. Raja Gabaglia',
    dateTime: 'Hoje • 22:30',
    type: 'meetup',
    coordinate: [-43.9714, -19.9448],
  },
  {
    id: 'event-2',
    title: 'Encontro de Crew',
    locationName: 'Rua José Hélio Freitas',
    dateTime: 'Sáb • 19:00',
    type: 'garage',
    coordinate: [-43.9678, -19.9406],
  },
  {
    id: 'event-3',
    title: 'Sessão Fotografia',
    locationName: 'Parque Oneida',
    dateTime: 'Dom • 16:00',
    type: 'photoshoot',
    coordinate: [-43.9765, -19.9432],
  },
  {
    id: 'event-4',
    title: 'Sprint Sul',
    locationName: 'Av. Niza Marques',
    dateTime: 'Sex • 23:45',
    type: 'race',
    coordinate: [-43.9642, -19.9512],
  },
];

export const mockNearbyUsers: NearbyUser[] = [
  {
    id: 'user-1',
    name: 'Carla',
    coordinate: [-43.9731, -19.949],
  },
  {
    id: 'user-2',
    name: 'Rafa',
    coordinate: [-43.9695, -19.9471],
  },
  {
    id: 'user-3',
    name: 'Luca',
    coordinate: [-43.9649, -19.946],
  },
];
