import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { money } from '../data/mockData';
import Btn from '../components/ui/Btn';
import Pill from '../components/ui/Pill';
import Marca from '../components/ui/Marca';

export default function Monedero({ saldo, movs, recargar }) {
  const [m, setM] = useState(500);
  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
      <Text style={[s.gran2, { marginTop: 14 }]}>Monedero</Text>
      <View style={s.tarjeta}>
        <Marca size={22} color={C.white} />
        <Text style={{ color: C.sand2, marginTop: 22 }}>Saldo disponible</Text>
        <Text style={{ color: C.white, fontSize: 40, fontWeight: '800' }}>{money(saldo)}</Text>
        <Text style={{ color: C.sand2, fontSize: 12, marginTop: 4 }}>•••• 4821 · MXN</Text>
      </View>
      <Text style={s.lbl}>Recargar</Text>
      <View style={{ flexDirection: 'row' }}>{[200, 500, 1000, 2000].map((x) => <Pill key={x} t={`$${x}`} on={m === x} onPress={() => setM(x)} />)}</View>
      <Btn t={`Agregar $${m} al monedero`} tipo="teal" onPress={() => recargar(m)} style={{ marginTop: 6 }} />
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
  );
}
