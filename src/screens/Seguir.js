import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { H, W } from '../constants/layout';
import Mapa from '../components/Mapa';

export default function Seguir({ c, cerrar }) {
  const [av] = useState(() => new Animated.Value(0));
  const [min, setMin] = useState(6);
  useEffect(() => {
    Animated.timing(av, { toValue: 1, duration: 12000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }).start();
    const t = setInterval(() => setMin((m) => (m > 1 ? m - 1 : 1)), 2500);
    return () => clearInterval(t);
  }, [av]);
  const alto = H * 0.62;
  return (
    <View style={{ flex: 1 }}>
      <Mapa alto={alto} pines={[{ x: 0.78, y: 0.62, e: '🏠', color: C.coral }]}>
        <View style={{ position: 'absolute', left: '14%', top: '20%', width: '66%', height: 5, backgroundColor: C.teal }} />
        <View style={{ position: 'absolute', left: '78%', top: '20%', width: 5, height: '44%', backgroundColor: C.teal }} />
        <Animated.View style={[s.pin, { borderColor: C.teal, left: av.interpolate({ inputRange: [0, 1], outputRange: [0.1 * (W - 46), 0.78 * (W - 46)] }), top: av.interpolate({ inputRange: [0, 1], outputRange: [0.17 * alto, 0.62 * alto] }) }]}>
          <Image source={{ uri: c.a.foto }} style={s.pinImg} />
        </Animated.View>
      </Mapa>
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
            <Text style={s.sub}>{c.act.n} · {c.h} horas</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
