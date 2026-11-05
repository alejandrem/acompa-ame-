import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { ACOMP, ACTS, PRECIO, dias, money } from '../data/mockData';
import Btn from '../components/ui/Btn';
import Fila from '../components/ui/Fila';

export default function Reservar({ pre, preAct, saldo, cerrar, confirmar, aviso, irMonedero }) {
  const [ds] = useState(() => dias());
  const [paso, setPaso] = useState(pre ? 1 : 0);
  const [ac, setAc] = useState(pre || null);
  const dia = 0;
  const [horaH, setHoraH] = useState(10);
  const [horaM, setHoraM] = useState(0);
  const [durH, setDurH] = useState(2);
  const [act, setAct] = useState(preAct || ACTS[0]);
  const [lugar, setLugar] = useState('');
  const comp = ACOMP.find((x) => x.id === ac) || null;
  const hora = `${String(horaH).padStart(2, '0')}:${String(horaM).padStart(2, '0')}`;
  const duracionMin = durH * 60;
  const total = (duracionMin / 60) * PRECIO;
  const titulos = ['Elige a tu acompañante', 'Hora y Duración', '¿Qué van a hacer?', 'Confirma y paga'];

  const a2En2h = (n) => Math.max(2, n - (n % 2));

  const sig = () => {
    if (paso === 0 && !ac) return aviso('Elige un acompañante.', 'error');
    if (paso === 1) {
      if (durH < 2 || durH % 2 !== 0) return aviso('Solo puedes elegir duración en bloques de 2 horas (mínimo 2).', 'error');
    }
    if (paso < 3) return setPaso(paso + 1);
    if (saldo < total) return aviso('Saldo insuficiente. Recarga tu monedero.', 'error', irMonedero);
    const elegido = ACOMP.find((x) => x.id === ac);
    confirmar({ id: Date.now(), a: elegido, dia: `${ds[dia].d} ${ds[dia].n} ${ds[dia].m}`, k: dia, hora, h: durH, duracion: `${durH}:00`, act, lugar: lugar || 'Domicilio del adulto mayor', total, estado: 'Confirmada' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18, paddingBottom: 8 }}>
        <TouchableOpacity onPress={() => (paso > 0 && !(pre && paso === 1) ? setPaso(paso - 1) : cerrar())} style={s.atras}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 14 }}>
          {[0, 1, 2, 3].map((i) => <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, marginRight: 4, backgroundColor: i <= paso ? C.teal : C.line }} />)}
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 130 }} keyboardShouldPersistTaps="handled">
        <Text style={s.gran2}>{titulos[paso]}</Text>

        {paso === 0 && ACOMP.map((x) => (
          <TouchableOpacity key={x.id} onPress={() => setAc(x.id)} activeOpacity={0.85} style={[s.fila, ac === x.id && { borderColor: C.teal, backgroundColor: C.tealSoft }]}>
            <Image source={x.foto} style={s.foto64} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.nom}>{x.nombre}</Text>
              <Text style={s.sub}>★ {x.rating} · {x.serv} servicios · {x.edad} años</Text>
              <Text style={[s.sub, { color: C.teal, marginTop: 3 }]}>{x.tags.join(' · ')}</Text>
            </View>
            <View style={[s.radio, ac === x.id && { backgroundColor: C.teal, borderColor: C.teal }]} />
          </TouchableOpacity>
        ))}

        {paso === 1 && (
          <>
            <Text style={[s.lbl, { textAlign: 'center', fontSize: 18 }]}>🕐 Hora de inicio</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16, backgroundColor: C.white, borderRadius: 18, paddingVertical: 12, borderWidth: 1, borderColor: C.line }}>
              <View style={{ alignItems: 'center', marginHorizontal: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.grey, marginBottom: 4 }}>HORA</Text>
                <TouchableOpacity style={s.mas} onPress={() => setHoraH((v) => (v > 0 ? v - 1 : 23))}><Text style={s.masT}>−</Text></TouchableOpacity>
                <TextInput style={{ fontSize: 34, fontWeight: '800', color: C.ink, marginVertical: 6, width: 60, textAlign: 'center', backgroundColor: C.sand, borderRadius: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.line }} keyboardType="numeric" value={String(horaH)} onChangeText={(v) => { const n = parseInt(v, 10); if (!isNaN(n) && n >= 0 && n <= 23) setHoraH(n); }} />
                <TouchableOpacity style={s.mas} onPress={() => setHoraH((v) => (v < 23 ? v + 1 : 0))}><Text style={s.masT}>+</Text></TouchableOpacity>
              </View>
              <Text style={{ fontSize: 34, fontWeight: '800', color: C.ink, marginHorizontal: 8 }}>:</Text>
              <View style={{ alignItems: 'center', marginHorizontal: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.grey, marginBottom: 4 }}>MIN</Text>
                <TouchableOpacity style={s.mas} onPress={() => setHoraM((v) => (v >= 15 ? v - 15 : 45))}><Text style={s.masT}>−</Text></TouchableOpacity>
                <TextInput style={{ fontSize: 34, fontWeight: '800', color: C.ink, marginVertical: 6, width: 60, textAlign: 'center', backgroundColor: C.sand, borderRadius: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.line }} keyboardType="numeric" value={String(horaM).padStart(2, '0')} onChangeText={(v) => { const n = parseInt(v, 10); if (!isNaN(n) && n >= 0 && n <= 59) setHoraM(n); }} />
                <TouchableOpacity style={s.mas} onPress={() => setHoraM((v) => (v <= 45 ? v + 15 : 0))}><Text style={s.masT}>+</Text></TouchableOpacity>
              </View>
            </View>

            <Text style={[s.lbl, { textAlign: 'center', fontSize: 18 }]}>⏱️ Duración (2 en 2 horas, mínimo 2)</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 16, backgroundColor: C.white, borderRadius: 18, paddingVertical: 16, borderWidth: 1, borderColor: C.line }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.grey, marginBottom: 6 }}>HORAS</Text>
                <TouchableOpacity style={s.mas} onPress={() => setDurH((v) => Math.max(2, v - 2))}><Text style={s.masT}>−</Text></TouchableOpacity>
                <TextInput style={{ fontSize: 34, fontWeight: '800', color: C.ink, marginVertical: 8, width: 90, textAlign: 'center', backgroundColor: C.sand, borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: C.line }} keyboardType="numeric" value={String(durH)} onChangeText={(v) => { const n = parseInt(v, 10); if (!isNaN(n)) setDurH(a2En2h(n)); }} />
                <TouchableOpacity style={s.mas} onPress={() => setDurH((v) => v + 2)}><Text style={s.masT}>+</Text></TouchableOpacity>
                <Text style={[s.sub, { marginTop: 8, textAlign: 'center' }]}>Solo 2, 4, 6 … horas</Text>
              </View>
            </View>
            <Text style={[s.sub, { textAlign: 'center', marginTop: 8, fontWeight: '700' }]}>💰 Total: {money(total)}</Text>
          </>
        )}

        {paso === 2 && (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {ACTS.map((x) => (
                <TouchableOpacity key={x.id} onPress={() => setAct(x)} style={[s.tile, act.id === x.id && { borderColor: C.teal, backgroundColor: C.tealSoft }]}>
                  <Text style={{ fontSize: 28 }}>{x.i}</Text>
                  <Text style={{ fontWeight: '700', color: C.ink, marginTop: 6 }}>{x.n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={s.in} placeholder="Lugar o dirección" placeholderTextColor={C.grey} value={lugar} onChangeText={setLugar} />
            <TextInput style={[s.in, { height: 90, textAlignVertical: 'top' }]} multiline placeholder="Notas: medicinas, gustos, cuidados" placeholderTextColor={C.grey} />
          </>
        )}

        {paso === 3 && comp && (
          <>
            <View style={s.resumen}>
              <Image source={comp.foto} style={s.foto64} />
              <View style={{ marginLeft: 12, flex: 1 }}><Text style={s.nom}>{comp.nombre}</Text><Text style={s.sub}>{comp.bio}</Text></View>
            </View>
            <View style={s.resumen2}>
              <Fila a="Día" b={`${ds[dia].d} ${ds[dia].n} ${ds[dia].m}`} />
              <Fila a="Hora" b={hora} />
              <Fila a="Actividad" b={`${act.i} ${act.n}`} />
              <Fila a="Lugar" b={lugar || 'Domicilio'} />
              <Fila a={`Duración ${durH} h × $${PRECIO}/h`} b={money(total)} />
              <View style={{ height: 1, backgroundColor: C.line, marginVertical: 6 }} />
              <Fila a="Monedero" b={money(saldo)} />
              <Fila a="Total a pagar" b={money(total)} fuerte />
            </View>
          </>
        )}
      </ScrollView>
      <View style={s.pie}>
        <Btn t={paso < 3 ? 'Continuar' : `Pagar ${money(total)}`} tipo={paso < 3 ? 'ink' : 'teal'} onPress={sig} />
      </View>
    </View>
  );
}
