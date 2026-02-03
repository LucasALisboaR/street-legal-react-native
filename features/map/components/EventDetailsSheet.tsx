import { StyleSheet, Text, View } from 'react-native';

import { BrandColors, MapColors } from '@/constants/theme';
import { MapEvent } from '@/features/map/types';

export function EventDetailsSheet({ event }: { event: MapEvent }) {
  return (
    <View style={styles.container}>
      <View style={styles.drag} />
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.subtitle}>{event.locationName}</Text>
      <Text style={styles.meta}>{event.dateTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: MapColors.overlayBackground,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: MapColors.overlayBorder,
    gap: 6,
  },
  drag: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 6,
  },
  title: {
    color: BrandColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: BrandColors.lightGray,
    fontSize: 13,
  },
  meta: {
    color: BrandColors.orange,
    fontSize: 13,
    fontWeight: '600',
  },
});
