import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { ACOMP, ACTS, HORAS, PRECIO, dias, money } from '../data/mockData';
import Btn from '../components/ui/Btn';
import Pill from '../components/ui/Pill';
import Fila from '../components/ui/Fila';

export default function Reservar({ pre, preAct, saldo, cerrar, confirmar, aviso, irMonedero }) {
  const [ds] = useState(() => dias());
  const [paso, setPaso] = useState(pre ? 1 : 0);
  const [ac, setAc] = useState(pre || null);
  const [dia, setDia] = useState(0);
  const [hora, setHora] = useState(null);
  const [h, setH] = useState(2);
  const [act, setAct] = useState(preAct || ACTS[0]);
  const [lugar, setLugar] = useState('');
  const comp = ACOMP.find((x) => x.id === ac) || null;
  const total = h * PRECIO;
  const titulos = ['Elige a tu acompañante', 'Fecha y duración', '¿Qué van a hacer?', 'Confirma y paga'];

  const sig = () => {
    if (paso === 0 && !ac) return aviso('Elige un acompañante.', 'error');
    if (paso === 1 && !hora) return aviso('Elige una hora.', 'error');
    if (paso < 3) return setPaso(paso + 1);
    if (saldo < total) return aviso('Saldo insuficiente. Recarga tu monedero.', 'error', irMonedero);
    const elegido = ACOMP.find((x) => x.id === ac);
    confirmar({ id: Date.now(), a: elegido, dia: `${ds[dia].d} ${ds[dia].n} ${ds[dia].m}`, k: dia, hora, h, act, lugar: lugar || 'Domicilio del adulto mayor', total, estado: 'Confirmada' });
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
            <Image source={{ uri: x.foto }} style={s.foto64} />
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {ds.map((d) => (
                <TouchableOpacity key={d.k} onPress={() => setDia(d.k)} style={[s.dia, dia === d.k && { backgroundColor: C.ink }]}>
                  <Text style={[s.sub, dia === d.k && { color: C.sand2 }]}>{d.d}</Text>
                  <Text style={[s.diaN, dia === d.k && { color: C.white }]}>{d.n}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.lbl}>Hora de inicio</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{HORAS.map((x) => <Pill key={x} t={x} on={hora === x} onPress={() => setHora(x)} />)}</View>
            <Text style={s.lbl}>Duración (mínimo 2 horas)</Text>
            <View style={s.dur}>
              <TouchableOpacity style={s.mas} onPress={() => setH(Math.max(2, h - 1))}><Text style={s.masT}>−</Text></TouchableOpacity>
              <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 32, fontWeight: '800', color: C.ink }}>{h} h</Text><Text style={s.sub}>{money(total)}</Text></View>
              <TouchableOpacity style={s.mas} onPress={() => setH(Math.min(10, h + 1))}><Text style={s.masT}>+</Text></TouchableOpacity>
            </View>
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
              <Image source={{ uri: comp.foto }} style={s.foto64} />
              <View style={{ marginLeft: 12, flex: 1 }}><Text style={s.nom}>{comp.nombre}</Text><Text style={s.sub}>{comp.bio}</Text></View>
            </View>
            <View style={s.resumen2}>
              <Fila a="Día" b={`${ds[dia].d} ${ds[dia].n} ${ds[dia].m}`} />
              <Fila a="Hora" b={hora} />
              <Fila a="Actividad" b={`${act.i} ${act.n}`} />
              <Fila a="Lugar" b={lugar || 'Domicilio'} />
              <Fila a={`${h} h × $${PRECIO}`} b={money(total)} />
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
