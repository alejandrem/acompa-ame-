import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import Btn from '../components/ui/Btn';

export default function Bitacora({ citas, completar }) {
  const hechas = citas.filter((c) => c.estado === 'Completada');
  const pend = citas.filter((c) => c.estado === 'Confirmada');
  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
      <Text style={[s.gran2, { marginTop: 14, marginBottom: 4 }]}>Bitácora</Text>
      <Text style={[s.sub, { marginBottom: 14 }]}>Lo que hizo tu acompañante en cada visita, paso a paso.</Text>
      {hechas.length === 0 && <View style={s.resumen2}><Text style={s.sub}>Cuando termine tu primer servicio, aquí verás qué hicieron.</Text></View>}
      {hechas.map((c) => (
        <View key={c.id} style={s.resumen2}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: c.a.foto }} style={s.foto42} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={s.nom}>{c.act.i} {c.act.n} con {c.a.nombre.split(' ')[0]}</Text>
              <Text style={s.sub}>{c.dia} · {c.hora} · {c.h} h</Text>
            </View>
            <View style={s.estadoOk}><Text style={{ color: C.teal, fontWeight: '800', fontSize: 11 }}>Completada</Text></View>
          </View>
          <View style={{ marginTop: 14 }}>
            {c.bit.map((e, i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                <Text style={s.tlH}>{e.h}</Text>
                <View style={{ alignItems: 'center', width: 18 }}>
                  <View style={s.tlDot} />{i < c.bit.length - 1 && <View style={s.tlLine} />}
                </View>
                <Text style={s.tlT}>{e.t}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line }}>
            <Text style={s.sub}>Ánimo: <Text style={{ color: C.ink, fontWeight: '700' }}>{c.animo}</Text></Text>
            <Text style={s.sub}>Entregado {c.entrega}</Text>
          </View>
        </View>
      ))}
      {pend.length > 0 && <Text style={s.lbl}>Por realizarse</Text>}
      {pend.map((c) => (
        <View key={c.id} style={s.resumen2}>
          <Text style={s.nom}>{c.act.i} {c.dia} · {c.hora}</Text>
          <Text style={[s.sub, { marginBottom: 10 }]}>La bitácora aparece cuando {c.a.nombre.split(' ')[0]} termine el servicio.</Text>
          <Btn t="Simular fin del servicio (demo)" tipo="sand" style={{ paddingVertical: 12 }} onPress={() => completar(c.id)} />
        </View>
      ))}
    </ScrollView>
  );
}
