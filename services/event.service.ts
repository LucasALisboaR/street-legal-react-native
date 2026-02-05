import { api } from '@/services/api';
import { CreateEventPayload } from '@/features/events/types';

export interface EventResponse {
  id: string;
  title: string;
  type: string;
  description: string;
  eventDate: string;
  address: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const eventService = {
  createEvent: (payload: CreateEventPayload) =>
    api.post<EventResponse>('/events', payload),
};

