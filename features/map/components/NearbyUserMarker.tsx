import { StyleSheet, View } from 'react-native';

import { BrandColors, MapColors } from '@/constants/theme';

type Props = {
  label?: string;
};

export function NearbyUserMarker({ label }: Props) {
  return (
    <View style={styles.container} accessibilityLabel={label ?? 'Usuário'}>
      <View style={styles.outer}>
        <View style={styles.inner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: BrandColors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MapColors.userRing,
  },
  inner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.orange,
    opacity: 0.6,
  },
});
