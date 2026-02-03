import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Import dinâmico do Mapbox para evitar erro se o módulo nativo não estiver disponível
let Mapbox: any = null;
let mapboxAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Mapbox = require('@rnmapbox/maps');
  if (Mapbox && Mapbox.setAccessToken) {
    Mapbox.setAccessToken('pk.eyJ1IjoibHVjYXNsaXNib2EiLCJhIjoiY2xraDFmdWJ4MDF1cDNlbnk5Z25oN3FjNyJ9.XfaFVX1TIK2FVEZu26Urmw');
    mapboxAvailable = true;
  }
} catch (err) {
  console.warn('Mapbox não está disponível. É necessário fazer um novo build nativo:', err);
  mapboxAvailable = false;
}

export default function TabTwoScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        // Solicitar permissão de localização
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permissão de localização negada');
          setLoading(false);
          return;
        }

        // Obter localização atual
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
        setHeading(currentLocation.coords.heading ?? null);
        setLoading(false);

        // Observar mudanças de localização e heading
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1, // Atualizar a cada 1 metro
            timeInterval: 1000, // Ou a cada 1 segundo
          },
          (newLocation) => {
            setLocation(newLocation);
            setHeading(newLocation.coords.heading ?? null);
          }
        );
      } catch (err) {
        setError('Erro ao obter localização');
        setLoading(false);
        console.error('Erro ao obter localização:', err);
      }
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Carregando mapa...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !location) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>
          {error || 'Não foi possível obter a localização'}
        </ThemedText>
      </ThemedView>
    );
  }

  // Verificar se o Mapbox está disponível
  if (!mapboxAvailable || !Mapbox) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>
          Módulo do Mapbox não está disponível.{'\n'}
          É necessário fazer um novo build nativo com o Mapbox incluído.{'\n\n'}
          Execute: eas build --platform android --profile development
        </ThemedText>
      </ThemedView>
    );
  }

  const { longitude, latitude } = location.coords;
  const rotationAngle = heading !== null ? heading : 0;

  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map}>
        <Mapbox.Camera
          zoomLevel={15}
          centerCoordinate={[longitude, latitude]}
          animationMode="flyTo"
          animationDuration={2000}
        />
        <Mapbox.PointAnnotation id="userLocation" coordinate={[longitude, latitude]}>
          <View style={styles.markerContainer}>
            <View
              style={[
                styles.arrow,
                {
                  transform: [{ rotate: `${rotationAngle}deg` }],
                },
              ]}
            />
          </View>
        </Mapbox.PointAnnotation>
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF9500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    padding: 20,
  },
});
