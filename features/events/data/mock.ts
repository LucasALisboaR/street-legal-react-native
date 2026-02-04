import { Event } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Encontro Noturno SP',
    location: 'Av. Paulista, São Paulo',
    time: '21:00',
    type: 'meetup',
    participants: 45,
    isLive: true,
    date: new Date(), // Hoje
  },
  {
    id: '2',
    title: 'Cars & Coffee Alphaville',
    location: 'Shopping Iguatemi',
    time: '08:00 - 12:00',
    type: 'exhibition',
    participants: 128,
    date: new Date(), // Hoje
  },
  {
    id: '3',
    title: 'Rolê Serra da Cantareira',
    location: 'Saída: Posto Shell Santana',
    time: 'Sáb 07:00',
    type: 'ride',
    participants: 23,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Sábado
  },
];


