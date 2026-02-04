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

