import { StyleSheet, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

type Props = {
  heading: number;
};

export function UserLocationMarker({ heading }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.arrow, { transform: [{ rotate: `${heading}deg` }] }]} />
      <View style={styles.glow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: BrandColors.orange,
    shadowColor: BrandColors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  glow: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 69, 0, 0.25)',
  },
});
