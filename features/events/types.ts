// Tipos de eventos do backend
export type EventTypeBackend = 'MEET' | 'RACE' | 'CRUISE' | 'SHOWOFF' | 'DRIFT' | 'TIME_ATTACK' | 'OFFROAD';

// Tipos de eventos para UI (mantido para compatibilidade)
export type EventType = 'meetup' | 'exhibition' | 'ride' | 'all';

export type Event = {
  id: string;
  title: string;
  location: string;
  time: string;
  type: EventType;
  participants: number;
  isLive?: boolean;
  date: Date;
};

// Tipos para criação de evento
export interface CreateEventPayload {
  title: string;
  type: EventTypeBackend;
  description: string;
  eventDate: string; // ISO8601 format
  address: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
}
