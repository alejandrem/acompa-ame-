import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { iconoPin, ICONO_YO } from '../components/iconosMapa';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import * as Location from 'expo-location';

const RUTA = [
  [19.0436, -98.2000],
  [19.0436, -98.1981],
  [19.0444, -98.1981],
  [19.0444, -98.1970],
  [19.0436, -98.1970],
  [19.0429, -98.1970],
];

const DESTINO = [19.0429, -98.1970];

function interpolarRuta(t) {
  const segs = [];
  let total = 0;
  for (let i = 0; i < RUTA.length - 1; i++) {
    const d = Math.hypot(RUTA[i + 1][0] - RUTA[i][0], RUTA[i + 1][1] - RUTA[i][1]);
    segs.push(d);
    total += d;
  }
  let d = t * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const k = segs[i] === 0 ? 0 : d / segs[i];
      return [
        RUTA[i][0] + (RUTA[i + 1][0] - RUTA[i][0]) * k,
        RUTA[i][1] + (RUTA[i + 1][1] - RUTA[i][1]) * k,
      ];
    }
    d -= segs[i];
  }
  return RUTA[RUTA.length - 1];
}

function Follower({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, 17, { duration: 0.5 });
  }, [map, pos]);
  return null;
}

export default function Seguir({ c, cerrar }) {
  const [pos, setPos] = useState(RUTA[0]);
  const [min, setMin] = useState(6);
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
          setMiUbicacion([loc.coords.latitude, loc.coords.longitude]);
        }
      } catch (_e) {
        setPermiso(false);
      }
    })();
  }, []);

  useEffect(() => {
    const inicio = Date.now();
    const duracion = 12000;
    const t = setInterval(() => {
      const p = Math.min(1, (Date.now() - inicio) / duracion);
      setPos(interpolarRuta(p));
      if (p >= 1) clearInterval(t);
    }, 120);
    const m = setInterval(() => setMin((x) => (x > 1 ? x - 1 : 1)), 2500);
    return () => { clearInterval(t); clearInterval(m); };
  }, []);

  const CENTRO = [19.0436, -98.1985];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: '100%', position: 'relative' }}>
        <MapContainer
          center={CENTRO}
          zoom={17}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={RUTA} pathOptions={{ color: C.teal, weight: 5 }} />
          <Marker position={DESTINO} icon={iconoPin({ e: '🏠' })}>
            <Popup>Destino</Popup>
          </Marker>
          <Marker position={pos} icon={iconoPin({ foto: c.a.foto })}>
            <Popup>Acompañante</Popup>
          </Marker>
          {miUbicacion && (
            <Marker position={miUbicacion} icon={ICONO_YO}>
              <Popup>Tu ubicación</Popup>
            </Marker>
          )}
          <Follower pos={pos} />
        </MapContainer>
        <TouchableOpacity onPress={cerrar} style={[styles.atras, { position: 'absolute', top: 16, left: 16, backgroundColor: C.white, zIndex: 1000 }]}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  atras: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
});