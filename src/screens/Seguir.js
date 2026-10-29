import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { H } from '../constants/layout';
import * as Location from 'expo-location';

// Ruta de ejemplo alrededor de Puebla capital
const RUTA = [
  { latitude: 19.0436, longitude: -98.2000 },
  { latitude: 19.0436, longitude: -98.1981 },
  { latitude: 19.0444, longitude: -98.1981 },
  { latitude: 19.0444, longitude: -98.1970 },
  { latitude: 19.0436, longitude: -98.1970 },
  { latitude: 19.0429, longitude: -98.1970 },
];

const DESTINO = { latitude: 19.0429, longitude: -98.1970 };

function interpolarRuta(t) {
  // t en [0,1]
  const segs = [];
  let total = 0;
  for (let i = 0; i < RUTA.length - 1; i++) {
    const d = Math.hypot(RUTA[i + 1].latitude - RUTA[i].latitude, RUTA[i + 1].longitude - RUTA[i].longitude);
    segs.push(d);
    total += d;
  }
  let d = t * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const k = segs[i] === 0 ? 0 : d / segs[i];
      return {
        latitude: RUTA[i].latitude + (RUTA[i + 1].latitude - RUTA[i].latitude) * k,
        longitude: RUTA[i].longitude + (RUTA[i + 1].longitude - RUTA[i].longitude) * k,
      };
    }
    d -= segs[i];
  }
  return RUTA[RUTA.length - 1];
}

export default function Seguir({ c, cerrar }) {
  const [min, setMin] = useState(6);
  const [pos, setPos] = useState(RUTA[0]);
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

  const alto = H * 0.62;
  const region = {
    latitude: 19.0436,
    longitude: -98.1985,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: alto, overflow: 'hidden' }}>
        <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation={permiso} userInterfaceStyle="light">
          <Polyline coordinates={RUTA} strokeColor={C.teal} strokeWidth={5} />
          <Marker coordinate={DESTINO} anchor={{ x: 0.5, y: 0.5 }}>
            <Text style={{ fontSize: 22 }}>🏠</Text>
          </Marker>
          <Marker coordinate={pos} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[s.pin, { borderColor: C.teal }]}>
              <Image source={{ uri: c.a.foto }} style={s.pinImg} />
            </View>
          </Marker>
          {miUbicacion && (
            <Marker coordinate={miUbicacion} anchor={{ x: 0.5, y: 0.5 }} title="Tú">
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#4285F4', borderWidth: 3, borderColor: C.white }} />
            </Marker>
          )}
        </MapView>
      </View>
      <TouchableOpacity onPress={cerrar} style={[s.atras, { position: 'absolute', top: 46, left: 16, backgroundColor: C.white }]}>
        <Text style={{ fontSize: 20 }}>←</Text>
      </TouchableOpacity>
      <View style={[s.hoja, { top: alto - 30, bottom: 0, height: undefined }]}>
        <View style={s.asa} />
        <Text style={s.h2}>Llega en {min} min</Text>
        <View style={s.proxima}>
          <Image source={{ uri: c.a.foto }} style={s.foto64} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.nom}>{c.a.nombre}</Text>
            <Text style={{ color: C.teal, fontWeight: '700' }}>✔ Verificado · ★ {c.a.rating}</Text>
            <Text style={s.sub}>{c.act.n} · {c.h} horas · ubicación en vivo</Text>
          </View>
        </View>
      </View>
    </View>
  );
}