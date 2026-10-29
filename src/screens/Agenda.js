import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { dias, money } from '../data/mockData';
import Btn from '../components/ui/Btn';

export default function Agenda({ citas, cancelar, verMapa, reservar }) {
  const [ds] = useState(() => dias());
  const [sel, setSel] = useState(0);
  const del = citas.filter((c) => c.k === sel);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ backgroundColor: C.sand, paddingTop: 22, paddingBottom: 14 }}>
        <Text style={[s.gran2, { paddingHorizontal: 18 }]}>Mi agenda</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18 }}>
          {ds.map((d) => {
            const hay = citas.some((c) => c.k === d.k && c.estado !== 'Cancelada');
            return (
              <TouchableOpacity key={d.k} onPress={() => setSel(d.k)} style={[s.dia, { backgroundColor: sel === d.k ? C.ink : C.white }]}>
                <Text style={[s.sub, sel === d.k && { color: C.sand2 }]}>{d.d}</Text>
                <Text style={[s.diaN, sel === d.k && { color: C.white }]}>{d.n}</Text>
                <View style={{ width: 6, height: 6, borderRadius: 3, marginTop: 3, backgroundColor: hay ? C.coral : 'transparent' }} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
        {del.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 40 }}>🗓️</Text>
            <Text style={[s.nom, { marginTop: 10 }]}>Sin citas este día</Text>
            <Text style={[s.sub, { marginBottom: 16 }]}>Agenda un acompañamiento en un par de toques.</Text>
            <Btn t="Agendar" onPress={() => reservar(null)} style={{ paddingHorizontal: 40 }} />
          </View>
        )}
        {del.map((c) => (
          <View key={c.id} style={{ flexDirection: 'row', marginBottom: 14 }}>
            <View style={{ width: 54 }}><Text style={{ fontWeight: '800', color: C.ink }}>{c.hora}</Text><Text style={s.sub}>{c.h} h</Text></View>
            <View style={[s.cita, c.estado === 'Cancelada' && { opacity: 0.5 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: c.a.foto }} style={s.foto42} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={s.nom}>{c.act.i} {c.act.n}</Text>
                  <Text style={s.sub}>{c.a.nombre}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: c.estado === 'Cancelada' ? C.red : C.teal }}>{c.estado}</Text>
              </View>
              <Text style={[s.sub, { marginTop: 8 }]}>📍 {c.lugar} · {money(c.total)}</Text>
              {c.estado === 'Confirmada' && (
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Btn t="Seguir en mapa" tipo="sand" style={{ flex: 1, marginRight: 8, paddingVertical: 11 }} onPress={() => verMapa(c)} />
                  <Btn t="Cancelar" tipo="line" style={{ flex: 1, paddingVertical: 11 }} onPress={() => cancelar(c.id)} />
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
