import { ElementRef, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mapbox } from '@/config/mapbox';
import { BrandColors } from '@/constants/theme';
import { SearchBar } from '@/components/ui/search-bar';
import { EventDetailsSheet } from '@/features/map/components/EventDetailsSheet';
import { EventMarker } from '@/features/map/components/EventMarker';
import { DriveHUD } from '@/features/map/components/DriveHUD';
import { MapControls } from '@/features/map/components/MapControls';
import { NearbyUserMarker } from '@/features/map/components/NearbyUserMarker';
import { UserLocationMarker } from '@/features/map/components/UserLocationMarker';
import { mockCenterCoordinate, mockEvents, mockNearbyUsers } from '@/features/map/data/mock';
import { useLocation } from '@/features/map/hooks/useLocation';
import { useUserHeading } from '@/features/map/hooks/useUserHeading';
import { mapStyleUrl } from '@/features/map/styles/mapStyle';
import { MapEvent, MapMode } from '@/features/map/types';

const MIN_ZOOM = 11;
const MAX_ZOOM = 18;

export function ExploreScreen() {
  const cameraRef = useRef<ElementRef<typeof Mapbox.Camera>>(null);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [mapMode] = useState<MapMode>('idle');
  const { location, loading, error, permissionStatus } = useLocation();
  const heading = useUserHeading({ enabled: permissionStatus === 'granted', smoothingFactor: 0.18 });

  const centerCoordinate = useMemo<[number, number]>(() => {
    if (location) {
      return [location.coords.longitude, location.coords.latitude];
    }
    return mockCenterCoordinate;
  }, [location]);

  useEffect(() => {
    if (!location || !cameraRef.current) {
      return;
    }
    cameraRef.current.setCamera({
      centerCoordinate: [location.coords.longitude, location.coords.latitude],
      zoomLevel,
      animationDuration: 600,
    });
  }, [location, zoomLevel]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, MAX_ZOOM));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, MIN_ZOOM));

  const handleCenterUser = () => {
    if (!location || !cameraRef.current) {
      return;
    }
    cameraRef.current.setCamera({
      centerCoordinate: [location.coords.longitude, location.coords.latitude],
      zoomLevel,
      animationDuration: 500,
    });
  };

  return (
    <View style={styles.root}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={mapStyleUrl}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
        onPress={() => setSelectedEvent(null)}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={zoomLevel}
          centerCoordinate={centerCoordinate}
          animationMode="flyTo"
          animationDuration={800}
        />

        {location && (
          <Mapbox.PointAnnotation id="user-location" coordinate={centerCoordinate}>
            <UserLocationMarker heading={heading} />
          </Mapbox.PointAnnotation>
        )}

        {mockEvents.map((event) => (
          <Mapbox.PointAnnotation
            key={event.id}
            id={event.id}
            coordinate={event.coordinate}
            onSelected={() => setSelectedEvent(event)}
          >
            <EventMarker type={event.type} />
          </Mapbox.PointAnnotation>
        ))}

        {mockNearbyUsers.map((user) => (
          <Mapbox.PointAnnotation key={user.id} id={user.id} coordinate={user.coordinate}>
            <NearbyUserMarker label={user.name} />
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>

      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <View style={styles.topBar}>
          <SearchBar onFilterPress={() => undefined} />
        </View>

        <View style={styles.controls}>
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onCenterUser={handleCenterUser}
          />
        </View>

        <View style={styles.bottomArea} pointerEvents="box-none">
          <DriveHUD visible={mapMode === 'driving'} />
          {selectedEvent && <EventDetailsSheet event={selectedEvent} />}
        </View>
      </SafeAreaView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={BrandColors.orange} />
          <Text style={styles.loadingText}>Carregando mapa...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.darkGray,
  },
  map: {
    flex: 1,
  },
  safeArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: Platform.select({ ios: 8, android: 16, default: 12 }),
  },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 120,
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: BrandColors.white,
    fontSize: 15,
  },
  errorOverlay: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(20,20,20,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  errorText: {
    color: BrandColors.orange,
    fontSize: 13,
  },
});
