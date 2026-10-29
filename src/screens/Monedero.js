import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { money } from '../data/mockData';
import Btn from '../components/ui/Btn';
import Marca from '../components/ui/Marca';

export default function Monedero({ saldo, movs, recargar }) {
  const [modal, setModal] = useState(false);
  const [monto, setMonto] = useState('');
  const [err, setErr] = useState('');

  const abrir = () => { setMonto(''); setErr(''); setModal(true); };
  const confirmar = () => {
    const n = Number(monto);
    if (!monto || isNaN(n) || n <= 0) return setErr('Ingresa una cantidad válida.');
    recargar(n);
    setModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
        <Text style={[s.gran2, { marginTop: 14 }]}>Monedero</Text>
        <View style={s.tarjeta}>
          <Marca size={22} />
          <Text style={{ color: C.sand2, marginTop: 22 }}>Saldo disponible</Text>
          <Text style={{ color: C.white, fontSize: 40, fontWeight: '800' }}>{money(saldo)}</Text>
          <Text style={{ color: C.sand2, fontSize: 12, marginTop: 4 }}>•••• 4821 · MXN</Text>
        </View>

        <Text style={s.lbl}>Recargar</Text>
        <Btn t="Recargar más dinero" tipo="teal" onPress={abrir} style={{ marginTop: 6 }} />

        <Text style={s.lbl}>Movimientos</Text>
        {movs.map((x) => (
          <View key={x.id} style={s.mov}>
            <View style={[s.dot, { backgroundColor: x.monto > 0 ? C.tealSoft : '#F2DDDC' }]}>
              <Text>{x.monto > 0 ? '↓' : '↑'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}><Text style={{ fontWeight: '700', color: C.ink }}>{x.c}</Text><Text style={s.sub}>{x.f}</Text></View>
            <Text style={{ fontWeight: '800', color: x.monto > 0 ? C.teal : C.ink }}>{x.monto > 0 ? '+' : '−'}{money(Math.abs(x.monto))}</Text>
          </View>
        ))}
      </ScrollView>

      {modal && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(47,22,72,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ width: '100%', maxWidth: 360, backgroundColor: C.white, borderRadius: 18, padding: 20 }}>
            <Text style={[s.gran2, { fontSize: 20, marginBottom: 8 }]}>Recargar dinero</Text>
            <Text style={[s.sub, { marginBottom: 12 }]}>Ingresa la cantidad que deseas agregar.</Text>
            <TextInput
              style={s.in}
              placeholder="Cantidad en MXN"
              placeholderTextColor={C.grey}
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
            />
            {!!err && <Text style={{ color: C.red, marginBottom: 10 }}>{err}</Text>}
            <Btn t="Confirmar recarga" tipo="teal" onPress={confirmar} />
            <TouchableOpacity onPress={() => setModal(false)} style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: C.grey, fontWeight: '700' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
