import React, { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { dias, money, MS } from '../data/mockData';
import Btn from '../components/ui/Btn';

export default function Agenda({ citas, cancelar, verMapa, reservar }) {
  const ds = useMemo(() => dias(), []);
  const meses = useMemo(() => {
    const seen = new Set();
    const out = [];
    ds.forEach((d) => {
      const key = `${d.mes}-${d.anio}`;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ mes: d.mes, anio: d.anio, label: `${MS[d.mes]} ${d.anio}` });
      }
    });
    return out;
  }, [ds]);

  const [mesIdx, setMesIdx] = useState(0);
  const [sel, setSel] = useState(0);
  const [modalMes, setModalMes] = useState(false);
  const [modalDia, setModalDia] = useState(false);

  const mesActual = meses[mesIdx];
  const daysInMonth = ds.filter((d) => d.mes === mesActual.mes && d.anio === mesActual.anio);
  const diaSel = ds.find((d) => d.k === sel);
  const del = citas.filter((c) => c.k === sel);

  const elegirMes = (i) => {
    setMesIdx(i);
    const first = ds.find((d) => d.mes === meses[i].mes && d.anio === meses[i].anio);
    if (first) setSel(first.k);
    setModalMes(false);
  };

  const elegirDia = (k) => {
    setSel(k);
    setModalDia(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={[s.gran2, { paddingHorizontal: 18, paddingTop: 22, marginBottom: 12 }]}>🗓️ Mi agenda</Text>

        <View style={{ paddingHorizontal: 18, marginBottom: 16 }}>
          <View style={{ backgroundColor: C.white, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: C.line }}>
            <TouchableOpacity onPress={() => setModalMes(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.grey, marginBottom: 2 }}>MES</Text>
                <Text style={{ fontSize: 20, fontWeight: '800', color: C.teal }}>{mesActual.label}</Text>
              </View>
              <Text style={{ fontSize: 22, color: C.grey }}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalDia(true)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.grey, marginBottom: 2 }}>DÍA</Text>
                <Text style={{ fontSize: 20, fontWeight: '800', color: C.teal }}>
                  {diaSel ? `${diaSel.d} ${diaSel.n} de ${diaSel.m}` : 'Elegir día'}
                </Text>
              </View>
              <Text style={{ fontSize: 22, color: C.grey }}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 18, marginBottom: 8 }}>
          <Btn t="Agendar nueva cita" onPress={() => reservar(null)} style={{ width: '100%' }} />
        </View>
        <View style={{ padding: 18 }}>
          {del.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 40 }}>🗓️</Text>
              <Text style={[s.nom, { marginTop: 10 }]}>Sin citas este día</Text>
              <Text style={[s.sub, { marginBottom: 16 }]}>Agenda un acompañamiento en un par de toques.</Text>
            </View>
          )}
          {del.map((c) => (
            <View key={c.id} style={{ flexDirection: 'row', marginBottom: 14 }}>
              <View style={{ width: 54 }}><Text style={{ fontWeight: '800', color: C.ink }}>{c.hora}</Text><Text style={s.sub}>{c.h} h</Text></View>
              <View style={[s.cita, c.estado === 'Cancelada' && { opacity: 0.5 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={c.a.foto} style={s.foto42} />
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
        </View>
      </ScrollView>

      {modalMes && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(47,22,72,0.45)', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 80, padding: 24 }}>
          <View style={{ width: '100%', maxWidth: 360, backgroundColor: C.white, borderRadius: 20, padding: 20 }}>
            <Text style={[s.gran2, { fontSize: 20, marginBottom: 14 }]}>Elegir mes</Text>
            {meses.map((m, i) => (
              <TouchableOpacity key={i} onPress={() => elegirMes(i)} style={{ paddingVertical: 16, borderRadius: 14, backgroundColor: mesIdx === i ? C.teal : C.bg, marginBottom: 10, alignItems: 'center', borderWidth: 1.5, borderColor: mesIdx === i ? C.teal : C.line }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: mesIdx === i ? C.white : C.ink }}>{m.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalMes(false)} style={{ marginTop: 6, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: C.sand }}>
              <Text style={{ color: C.ink, fontWeight: '800', fontSize: 16 }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {modalDia && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(47,22,72,0.45)', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 60, padding: 24 }}>
          <View style={{ width: '100%', maxWidth: 360, backgroundColor: C.white, borderRadius: 20, padding: 20 }}>
            <Text style={[s.gran2, { fontSize: 20, marginBottom: 14 }]}>Elegir día</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {daysInMonth.map((d) => {
                const hay = citas.some((c) => c.k === d.k && c.estado !== 'Cancelada');
                const selected = sel === d.k;
                return (
                  <TouchableOpacity key={d.k} onPress={() => elegirDia(d.k)} style={{ width: '14.28%', height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: selected ? C.teal : C.bg, marginBottom: 6, borderWidth: 1.5, borderColor: selected ? C.teal : C.line, marginHorizontal: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: selected ? C.white : C.ink }}>{d.n}</Text>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: selected ? C.sand2 : C.grey }}>{d.d}</Text>
                    <View style={{ width: 6, height: 6, borderRadius: 3, marginTop: 3, backgroundColor: hay ? C.coral : 'transparent' }} />
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity onPress={() => setModalDia(false)} style={{ marginTop: 6, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: C.sand }}>
              <Text style={{ color: C.ink, fontWeight: '800', fontSize: 16 }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
