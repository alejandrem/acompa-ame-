import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { C } from '../theme/colors';
import { W } from '../constants/layout';

// Región inicial: zona Puebla / Tlaxcala
export const REGION_PUEBLA_TLAXCALA = {
  latitude: 19.18,
  longitude: -98.22,
  latitudeDelta: 0.45,
  longitudeDelta: 0.45,
};

// Convierte un pin con coordenadas fraccionarias (x,y en 0..1) a lat/lng
// dentro de la región Puebla/Tlaxcala.
const MIN_LAT = 18.98;
const MAX_LAT = 19.38;
const MIN_LON = -98.42;
const MAX_LON = -98.02;

function toCoord(p) {
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

export default function Mapa({ pines = [], alto, region = REGION_PUEBLA_TLAXCALA, children, showUserLocation = true, onPinPress }) {
  const [permiso, setPermiso] = useState(false);
  const [miUbicacion, setMiUbicacion] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const ok = status === 'granted';
        setPermiso(ok);
        if (ok) {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setMiUbicacion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      } catch (_e) {
        setPermiso(false);
      }
    })();
  }, []);

  return (
    <View style={{ width: W, height: alto, overflow: 'hidden' }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={region}
        showsUserLocation={showUserLocation && permiso}
        showsMyLocationButton={false}
        userInterfaceStyle="light"
      >
        {pines.map((p, i) => {
          const coordinate = toCoord(p);
          return (
            <Marker key={i} coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }} onPress={() => onPinPress && onPinPress(p)}>
              {p.foto ? (
                <View style={[styles.pin, { borderColor: p.color || C.white }]}>
                  <Image source={{ uri: p.foto }} style={styles.pinImg} />
                </View>
              ) : (
                <Text style={{ fontSize: 22 }}>{p.e || '📍'}</Text>
              )}
            </Marker>
          );
        })}
        {miUbicacion && (
          <Marker coordinate={miUbicacion} anchor={{ x: 0.5, y: 0.5 }} title="Tú">
            <View style={styles.yo} />
          </Marker>
        )}
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
  yo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4285F4',
    borderWidth: 3,
    borderColor: C.white,
  },
});