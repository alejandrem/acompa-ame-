import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import Btn from '../components/ui/Btn';

export default function Bitacora({ citas, completar }) {
  const [sel, setSel] = useState(null);
  const [fotoSel, setFotoSel] = useState(null);
  const hechas = citas.filter((c) => c.estado === 'Completada');
  const pend = citas.filter((c) => c.estado === 'Confirmada');

  const fotosDe = (c) => (c.fotos && c.fotos.length ? c.fotos : [c.a.foto, c.a.foto, c.a.foto]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
        <Text style={[s.gran2, { marginTop: 14, marginBottom: 4 }]}>Bitácora</Text>
        <Text style={[s.sub, { marginBottom: 14 }]}>Lo que hizo tu acompañante en cada visita, paso a paso.</Text>
        {hechas.length === 0 && <View style={s.resumen2}><Text style={s.sub}>Cuando termine tu primer servicio, aquí verás qué hicieron.</Text></View>}
        {hechas.map((c) => (
          <View key={c.id} style={s.resumen2}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={c.a.foto} style={s.foto42} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={s.nom}>{c.act.i} {c.act.n} con {c.a.nombre.split(' ')[0]}</Text>
                <Text style={s.sub}>{c.dia} · {c.hora} · {c.h} h</Text>
              </View>
              <View style={s.estadoOk}><Text style={{ color: C.teal, fontWeight: '800', fontSize: 11 }}>Completada</Text></View>
            </View>
            <View style={{ marginTop: 14 }}>
              {c.bit.slice(0, 2).map((e, i) => (
                <View key={i} style={{ flexDirection: 'row' }}>
                  <Text style={s.tlH}>{e.h}</Text>
                  <View style={{ alignItems: 'center', width: 18 }}>
                    <View style={s.tlDot} />{i < 1 && <View style={s.tlLine} />}
                  </View>
                  <Text style={s.tlT}>{e.t}</Text>
                </View>
              ))}
            </View>
            <View style={{ marginTop: 8 }}>
              <Btn t="Ver más" tipo="sand" style={{ paddingVertical: 10 }} onPress={() => setSel(c)} />
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

      {sel && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(47,22,72,0.45)', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 60, padding: 24 }}>
          <View style={{ width: '100%', maxWidth: 400, backgroundColor: C.white, borderRadius: 20, padding: 20, maxHeight: '80%' }}>
            <ScrollView showsVerticalScrollIndicator>
              <Text style={[s.gran2, { fontSize: 20, marginBottom: 4 }]}>{sel.act.i} {sel.act.n}</Text>
              <Text style={[s.sub, { marginBottom: 12 }]}>{sel.a.nombre} · {sel.dia} · {sel.hora}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <Image source={sel.a.foto} style={s.foto42} />
                <Text style={[s.sub, { marginLeft: 10, flex: 1, color: C.ink }]}>Ánimo: {sel.animo} · Entregado {sel.entrega}</Text>
              </View>
              <Text style={[s.lbl, { marginTop: 0 }]}>Bitácora completa</Text>
              {sel.bit.map((e, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={s.tlH}>{e.h}</Text>
                  <View style={{ alignItems: 'center', width: 18 }}>
                    <View style={s.tlDot} />{i < sel.bit.length - 1 && <View style={s.tlLine} />}
                  </View>
                  <Text style={s.tlT}>{e.t}</Text>
                </View>
              ))}
              <Text style={[s.lbl, { marginTop: 10 }]}>Fotos del pasatiempo</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {fotosDe(sel).map((f, i) => (
                  <TouchableOpacity key={i} onPress={() => setFotoSel(f)} style={{ width: '32%', marginBottom: 8 }}>
                    <Image source={{ uri: f }} style={{ width: '100%', aspectRatio: 1, borderRadius: 12 }} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity onPress={() => setSel(null)} style={{ marginTop: 12, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: C.sand }}>
              <Text style={{ color: C.ink, fontWeight: '800', fontSize: 16 }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {fotoSel && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20, zIndex: 10 }} onPress={() => setFotoSel(null)}>
            <Text style={{ color: C.white, fontSize: 28, fontWeight: '800' }}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: fotoSel }} style={{ width: '100%', height: '80%', resizeMode: 'contain' }} />
        </View>
      )}
    </View>
  );
}
