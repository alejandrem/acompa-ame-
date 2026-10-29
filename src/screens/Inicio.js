import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { ACOMP, ACTS } from '../data/mockData';
import { H } from '../constants/layout';
import Mapa from '../components/Mapa';

export default function Inicio({ u, citas, reservar, verMapa, facil, irA, aviso }) {
  const [sube] = useState(() => new Animated.Value(0));
  const [pulso] = useState(() => new Animated.Value(1));
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulso, { toValue: 1.03, duration: 1100, useNativeDriver: true }),
      Animated.timing(pulso, { toValue: 1, duration: 1100, useNativeDriver: true }),
    ])).start();
  }, [pulso]);
  useEffect(() => {
    Animated.timing(sube, { toValue: 1, duration: 700, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [sube]);
  const prox = citas.find((c) => c.estado === 'Confirmada');
  return (
    <View style={{ flex: 1 }}>
      <Mapa alto={H} pines={[...ACOMP.map((a) => ({ x: a.x, y: a.y * 0.8, foto: a.foto })), { x: 0.4, y: 0.34, e: '🏠', color: C.coral }]} />
      <View style={s.flota}>
        <Text style={{ fontSize: 12, color: C.grey }}>Hola, {u.nombre.split(' ')[0]}</Text>
        <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink }}>{ACOMP.length} acompañantes cerca de {u.adulto}</Text>
      </View>
      <Animated.View style={[s.hoja, { transform: [{ translateY: sube.interpolate({ inputRange: [0, 1], outputRange: [380, 0] }) }] }]}>
        <View style={s.asa} />
        <Text style={s.h2}>¿Quién acompaña hoy?</Text>
        <Animated.View style={{ transform: [{ scale: pulso }] }}>
          <TouchableOpacity style={[s.bigBtn, facil && { padding: 28 }]} onPress={() => reservar(null)} activeOpacity={0.85}>
            <Text style={{ fontSize: facil ? 44 : 34 }}>🤝</Text>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[s.bigT, facil && { fontSize: 25 }]}>Pedir acompañamiento</Text>
              <Text style={[s.bigS, facil && { fontSize: 15 }]}>Fácil y rápido — desde 2 horas</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        {facil && (
          <>
            <TouchableOpacity style={[s.bigBtn, { backgroundColor: C.tealSoft, marginTop: 12, padding: 24 }]} onPress={() => irA('bitacora')}>
              <Text style={{ fontSize: 36 }}>📖</Text>
              <Text style={[s.bigT, { color: C.ink, marginLeft: 14, fontSize: 22 }]}>Mi bitácora</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.bigBtn, { backgroundColor: C.tealSoft, marginTop: 12, padding: 24 }]} onPress={() => aviso('Llamando a tu familiar… (demo)')}>
              <Text style={{ fontSize: 36 }}>📞</Text>
              <Text style={[s.bigT, { color: C.ink, marginLeft: 14, fontSize: 22 }]}>Llamar a mi familiar</Text>
            </TouchableOpacity>
          </>
        )}
        {!facil && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 14 }}>
            {ACTS.map((a) => (
              <TouchableOpacity key={a.id} style={s.atajo} onPress={() => reservar(null, a)}>
                <Text style={{ fontSize: 22 }}>{a.i}</Text>
                <Text style={{ fontSize: 12, color: C.ink, marginTop: 4, fontWeight: '600' }}>{a.n}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {!facil && prox && (
          <TouchableOpacity style={s.proxima} onPress={() => verMapa(prox)} activeOpacity={0.85}>
            <Image source={{ uri: prox.a.foto }} style={s.foto42} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: '800', color: C.ink }}>Próxima: {prox.dia}, {prox.hora}</Text>
              <Text style={s.sub}>{prox.a.nombre} — {prox.act.n}</Text>
            </View>
            <Text style={{ color: C.teal, fontWeight: '800' }}>Ver →</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}
