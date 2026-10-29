import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { C } from '../theme/colors';
import { W } from '../constants/layout';

const REGION_PUEBLA_TLAXCALA = {
  latitude: 19.18,
  longitude: -98.22,
  latitudeDelta: 0.45,
  longitudeDelta: 0.45,
};

const MIN_LAT = 18.98;
const MAX_LAT = 19.38;
const MIN_LON = -98.42;
const MAX_LON = -98.02;

function toCoordPuebla(p) {
  if (typeof p.latitude === 'number' && typeof p.longitude === 'number') {
    return { latitude: p.latitude, longitude: p.longitude };
  }
  const x = typeof p.x === 'number' ? p.x : 0.5;
  const y = typeof p.y === 'number' ? p.y : 0.5;
  return {
    latitude: MAX_LAT - y * (MAX_LAT - MIN_LAT),
    longitude: MIN_LON + x * (MAX_LON - MIN_LON),
  };
}

function toCoordUser(p, userLoc) {
  if (typeof p.latitude === 'number' && typeof p.longitude === 'number') {
    return { latitude: p.latitude, longitude: p.longitude };
  }
  const x = typeof p.x === 'number' ? p.x : 0.5;
  const y = typeof p.y === 'number' ? p.y : 0.5;
  // Acompañantes cerca del usuario (pequeños desplazamientos)
  return {
    latitude: userLoc.latitude + (0.5 - y) * 0.04,
    longitude: userLoc.longitude + (x - 0.5) * 0.04,
  };
}

export default function Mapa({ pines = [], alto, region, children, showUserLocation = true, onPinPress }) {
  const mapRef = useRef(null);
  const [permiso, setPermiso] = useState(false);
  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const ok = status === 'granted';
        setPermiso(ok);
        if (ok) {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const coord = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setUserLoc(coord);
          const newRegion = {
            latitude: coord.latitude,
            longitude: coord.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          };
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        }
      } catch (_e) {
        setPermiso(false);
      }
    })();
  }, []);

  const coordFor = (p) => (userLoc ? toCoordUser(p, userLoc) : toCoordPuebla(p));

  return (
    <View style={{ width: W, height: alto, overflow: 'hidden' }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        mapType="none"
        initialRegion={region || (userLoc ? { latitude: userLoc.latitude, longitude: userLoc.longitude, latitudeDelta: 0.08, longitudeDelta: 0.08 } : REGION_PUEBLA_TLAXCALA)}
        showsUserLocation={showUserLocation && permiso}
        showsMyLocationButton={false}
        userInterfaceStyle="light"
        renderToHardwareTextureAndroid={false}
      >
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        {pines.map((p, i) => {
          const coordinate = coordFor(p);
          return (
            <Marker key={i} coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }} onPress={() => onPinPress && onPinPress(p)}>
              {p.foto ? (
                <View style={[styles.pin, { borderColor: p.color || C.white }]}>
                  <Image source={p.foto} style={styles.pinImg} />
                </View>
              ) : (
                <Text style={{ fontSize: 22 }}>{p.e || '📍'}</Text>
              )}
            </Marker>
          );
        })}
        {children}
      </MapView>
      {!permiso && showUserLocation && (
        <View style={styles.permiso}>
          <Text style={{ color: C.ink, fontSize: 12, fontWeight: '600' }}>Activa tu ubicación para verte en el mapa</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.white,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pinImg: { width: 36, height: 36, borderRadius: 18 },
  permiso: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: C.white,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
});