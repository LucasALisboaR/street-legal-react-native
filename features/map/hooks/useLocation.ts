import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export type LocationState = {
  location: Location.LocationObject | null;
  loading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
};

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: true,
    error: null,
    permissionStatus: null,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const start = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setState({
            location: null,
            loading: false,
            error: 'Permissão de localização negada',
            permissionStatus: status,
          });
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setState({
          location: currentLocation,
          loading: false,
          error: null,
          permissionStatus: status,
        });

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1,
            timeInterval: 1000,
          },
          (newLocation) => {
            setState((prev) => ({
              ...prev,
              location: newLocation,
              loading: false,
              error: null,
            }));
          }
        );
      } catch (error) {
        setState({
          location: null,
          loading: false,
          error: 'Erro ao obter a localização',
          permissionStatus: null,
        });
        console.error('Erro ao obter localização:', error);
      }
    };

    start();

    return () => {
      subscription?.remove();
    };
  }, []);

  return state;
}
