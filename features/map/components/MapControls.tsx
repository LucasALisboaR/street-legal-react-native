import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/ui/icon-button';

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenterUser: () => void;
};

export function MapControls({ onZoomIn, onZoomOut, onCenterUser }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.cluster}>
        <IconButton icon="add" onPress={onZoomIn} />
        <View style={styles.divider} />
        <IconButton icon="remove" onPress={onZoomOut} />
      </View>
      <IconButton icon="locate" onPress={onCenterUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  cluster: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    gap: 1,
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
