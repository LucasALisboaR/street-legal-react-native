import { ElementRef, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/ui/search-bar';
import { Mapbox } from '@/config/mapbox';
import { BrandColors } from '@/constants/theme';
import { DriveHUD } from '@/features/map/components/DriveHUD';
import { EventDetailsSheet } from '@/features/map/components/EventDetailsSheet';
import { EventMarker } from '@/features/map/components/EventMarker';
import { MapControls } from '@/features/map/components/MapControls';
import { NearbyUserMarker } from '@/features/map/components/NearbyUserMarker';
import { buildMockEvents, buildMockNearbyUsers, mockCenterCoordinate } from '@/features/map/data/mock';
import { useLocation } from '@/features/map/hooks/useLocation';
import { mapStyleUrl } from '@/features/map/styles/mapStyle';
import { MapEvent, MapMode } from '@/features/map/types';

// Imagem de seta para o bearing no Android (deve ser PNG, não SVG)
const userLocationBearingImage = require('@/assets/images/navigation-arrow-fill.png');

const MIN_ZOOM = 11;
const MAX_ZOOM = 18;

export function ExploreScreen() {
  const cameraRef = useRef<ElementRef<typeof Mapbox.Camera>>(null);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [mapMode] = useState<MapMode>('idle');
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const { location, loading, error } = useLocation();

  const centerCoordinate = useMemo<[number, number]>(() => {
    if (location) {
      return [location.coords.longitude, location.coords.latitude];
    }
    return mockCenterCoordinate;
  }, [location]);

  const mockEvents = useMemo(() => buildMockEvents(centerCoordinate), [centerCoordinate]);
  const mockNearbyUsers = useMemo(() => buildMockNearbyUsers(centerCoordinate), [centerCoordinate]);

  const handleZoomIn = () => {
    setFollowUserLocation(false);
    const newZoom = Math.min(zoomLevel + 1, MAX_ZOOM);
    setZoomLevel(newZoom);
  };

  const handleZoomOut = () => {
    setFollowUserLocation(false);
    const newZoom = Math.max(zoomLevel - 1, MIN_ZOOM);
    setZoomLevel(newZoom);
  };

  const handleCenterUser = () => {
    if (!location) {
      return;
    }
    setFollowUserLocation(true);
  };

  // Só renderiza o mapa quando tiver localização
  if (loading || !location) {
    return (
      <View style={styles.root}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={BrandColors.orange} />
          <Text style={styles.loadingText}>
            {loading ? 'Obtendo localização...' : 'Aguardando localização...'}
          </Text>
        </View>
      </View>
    );
  }

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
          centerCoordinate={centerCoordinate}
          zoomLevel={zoomLevel}
          minZoomLevel={MIN_ZOOM}
          maxZoomLevel={MAX_ZOOM}
          animationDuration={300}
          followUserLocation={followUserLocation}
        />

        {/* Location Puck com suporte a bearing no Android */}
        {Platform.OS === 'android' ? (
          <>
            <Mapbox.Images images={{ headingArrow: userLocationBearingImage }} />
            <Mapbox.LocationPuck
              puckBearingEnabled={true}
              puckBearing="heading"
              bearingImage="headingArrow"
              visible={true}
              pulsing={{ isEnabled: true, color: BrandColors.orange, radius: 'accuracy' }}
            />
          </>
        ) : (
          <Mapbox.LocationPuck
            puckBearingEnabled={true}
            puckBearing="heading"
            visible={true}
            pulsing={{ isEnabled: true, color: BrandColors.orange, radius: 'accuracy' }}
          />
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

      {error && (
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
