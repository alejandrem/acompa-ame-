import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { C } from '../theme/colors';
import { W } from '../constants/layout';
import 'leaflet/dist/leaflet.css';

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
  return {
    latitude: userLoc.latitude + (0.5 - y) * 0.04,
    longitude: userLoc.longitude + (x - 0.5) * 0.04,
  };
}

function toLatLng(p, userLoc) {
  const coord = userLoc ? toCoordUser(p, userLoc) : toCoordPuebla(p);
  return [coord.latitude, coord.longitude];
}

export default function Mapa({ pines = [], alto, region = REGION_PUEBLA_TLAXCALA, children, showUserLocation = true, onPinPress }) {
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
          setUserLoc({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      } catch (_e) {
        setPermiso(false);
      }
    })();
  }, []);

  const center = userLoc ? [userLoc.latitude, userLoc.longitude] : [19.18, -98.22];

  return (
    <View style={{ width: W, height: alto }}>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pines.map((p, i) => {
          const pos = toLatLng(p, userLoc);
          if (!pos) return null;
          return (
            <Marker key={i} position={pos} onClick={() => onPinPress && onPinPress(p)}>
              {p.foto && (
                <Popup>
                  <Image source={p.foto} style={{ width: 50, height: 50, borderRadius: 25 }} />
                </Popup>
              )}
            </Marker>
          );
        })}
        {userLoc && (
          <Marker position={userLoc}>
            <Popup>
              <Text style={{ color: C.ink }}>Tu ubicación</Text>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({});