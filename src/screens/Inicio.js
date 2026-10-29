import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, PanResponder, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { ACOMP, ACTS } from '../data/mockData';
import { H } from '../constants/layout';
import Mapa from '../components/Mapa';

const EXPANDED_TOP = H - 420;
const COLLAPSED_TOP = H - 150;

export default function Inicio({ u, citas, reservar, verMapa, facil, irA, aviso }) {
  const [sube] = useState(() => new Animated.Value(0));
  const [pulso] = useState(() => new Animated.Value(1));
  const [perfil, setPerfil] = useState(null);
  const [modalAnim] = useState(() => new Animated.Value(0));
  const [sheetTop] = useState(() => new Animated.Value(H));

  const startY = useRef(0);

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulso, { toValue: 1.03, duration: 1100, useNativeDriver: true }),
      Animated.timing(pulso, { toValue: 1, duration: 1100, useNativeDriver: true }),
    ])).start();
  }, [pulso]);

  useEffect(() => {
    Animated.timing(sube, { toValue: 1, duration: 700, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    Animated.spring(sheetTop, { toValue: EXPANDED_TOP, useNativeDriver: false, tension: 60, friction: 9 }).start();
  }, [sube, sheetTop]);

  const [panResponder, setPanResponder] = useState(null);
  useEffect(() => {
    const pr = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => { startY.current = sheetTop.__getValue(); },
      onPanResponderMove: (_, g) => {
        const next = Math.max(EXPANDED_TOP, Math.min(COLLAPSED_TOP, startY.current + g.dy));
        sheetTop.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const current = sheetTop.__getValue();
        const mid = (EXPANDED_TOP + COLLAPSED_TOP) / 2;
        const target = (current > mid || g.vy > 0.4) ? COLLAPSED_TOP : EXPANDED_TOP;
        Animated.spring(sheetTop, { toValue: target, useNativeDriver: false, tension: 80, friction: 10 }).start();
      },
    });
    setPanResponder(pr);
  }, [sheetTop]);

  const abrirPerfil = (p) => {
    if (!p || !p.nombre) return;
    setPerfil(p);
    modalAnim.setValue(0);
    Animated.spring(modalAnim, { toValue: 1, useNativeDriver: true, tension: 70, friction: 9 }).start();
  };

  const cerrarPerfil = () => {
    Animated.timing(modalAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setPerfil(null));
  };

  const prox = citas.find((c) => c.estado === 'Confirmada');
  const pines = [...ACOMP.map((a) => ({ ...a, x: a.x, y: a.y * 0.8, foto: a.foto })), { x: 0.4, y: 0.34, e: '🏠', color: C.coral }];

  return (
    <View style={{ flex: 1 }}>
      <Mapa alto={H} pines={pines} onPinPress={abrirPerfil} />
      <View style={s.flota}>
        <Text style={{ fontSize: 12, color: C.grey }}>Hola, {u.nombre.split(' ')[0]}</Text>
        <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink }}>{ACOMP.length} acompañantes cerca de {u.adulto}</Text>
      </View>

      <Animated.View style={{ position: 'absolute', left: 0, right: 0, top: sheetTop, backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 100 }}>
        <View {...(panResponder ? panResponder.panHandlers : {})} style={{ alignItems: 'center', paddingBottom: 6 }}>
          <View style={s.asa} />
        </View>
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

      {perfil && (
        <Animated.View style={[styles.modalOverlay, { opacity: modalAnim }]}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={cerrarPerfil} />
          <Animated.View style={[styles.modalCard, { transform: [{ translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) }] }]}>
            <View style={{ alignItems: 'center' }}>
              <Image source={{ uri: perfil.foto }} style={styles.modalFoto} />
              <Text style={styles.modalNombre}>{perfil.nombre}</Text>
              <Text style={s.sub}>{perfil.edad} años · ★ {perfil.rating} · {perfil.serv} servicios</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
              {perfil.tags.map((t) => (
                <View key={t} style={styles.tag}><Text style={styles.tagT}>{t}</Text></View>
              ))}
            </View>
            <Text style={[s.sub, { textAlign: 'center', marginTop: 14, color: C.ink }]}>{perfil.bio}</Text>
            <TouchableOpacity style={[s.bigBtn, { marginTop: 18 }]} onPress={() => { const p = perfil; cerrarPerfil(); reservar(p); }} activeOpacity={0.85}>
              <Text style={{ fontSize: 28 }}>🤝</Text>
              <Text style={[s.bigT, { marginLeft: 12 }]}>Pedir acompañamiento</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cerrarPerfil} style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: C.grey, fontWeight: '700' }}>Cerrar</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = {
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(47,22,72,0.45)', justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40,
  },
  modalFoto: { width: 96, height: 96, borderRadius: 48, backgroundColor: C.sand },
  modalNombre: { fontSize: 24, fontWeight: '800', color: C.ink, marginTop: 12 },
  tag: { backgroundColor: C.tealSoft, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, margin: 4 },
  tagT: { color: C.ink, fontWeight: '700', fontSize: 12 },
};