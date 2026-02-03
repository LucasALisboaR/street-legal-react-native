import { StyleSheet, View } from 'react-native';

import { MapColors } from '@/constants/theme';
import { EventType } from '@/features/map/types';

const EVENT_COLOR_MAP: Record<EventType, string> = MapColors.eventTypes;

type Props = {
  type: EventType;
};

export function EventMarker({ type }: Props) {
  const color = EVENT_COLOR_MAP[type];

  return (
    <View style={[styles.outer, { borderColor: color }]}
      accessibilityLabel="Evento"
      accessibilityRole="image"
    >
      <View style={[styles.inner, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
