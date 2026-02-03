export type MapMode = 'idle' | 'previewRoute' | 'driving';

export type EventType = 'meetup' | 'race' | 'photoshoot' | 'garage';

export type MapEvent = {
  id: string;
  title: string;
  locationName: string;
  dateTime: string;
  type: EventType;
  coordinate: [number, number];
};

export type NearbyUser = {
  id: string;
  name: string;
  coordinate: [number, number];
};
