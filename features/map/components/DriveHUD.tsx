import { StyleSheet, Text, View } from 'react-native';

import { BrandColors, MapColors } from '@/constants/theme';

type Props = {
  visible?: boolean;
};

export function DriveHUD({ visible = false }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Modo Drive (em breve)</Text>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.value}>-- km/h</Text>
          <Text style={styles.caption}>Velocidade</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.value}>-- min</Text>
          <Text style={styles.caption}>ETA</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.value}>-- km</Text>
          <Text style={styles.caption}>Distância</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: MapColors.overlayBackground,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: MapColors.overlayBorder,
    gap: 12,
  },
  label: {
    color: BrandColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  value: {
    color: BrandColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  caption: {
    color: BrandColors.lightGray,
    fontSize: 12,
  },
});
