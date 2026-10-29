import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import Btn from '../components/ui/Btn';
import Fila from '../components/ui/Fila';

export default function Perfil({ u, salir, facil, setFacil }) {
  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
      <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 20 }}>
        <View style={s.avatar}><Text style={{ fontSize: 38, color: C.white, fontWeight: '800' }}>{u.nombre[0]}</Text></View>
        <Text style={[s.gran2, { marginTop: 12, marginBottom: 2 }]}>{u.nombre}</Text>
        <Text style={s.sub}>{u.correo}</Text>
      </View>
      <View style={s.resumen2}>
        <Fila a="Adulto mayor" b={u.adulto} />
        <Fila a="Ciudad" b="Tlaxcala, Tlax." />
        <Fila a="Contacto de emergencia" b="Registrado" />
      </View>
      <View style={[s.resumen2, { backgroundColor: C.sand, borderColor: C.sand }]}>
        <Text style={s.sub}>🔒 Solo el equipo de Acompañame puede registrar acompañantes. Nadie se puede inscribir desde la app.</Text>
      </View>
      <TouchableOpacity activeOpacity={0.85} onPress={() => setFacil(!facil)} style={[s.resumen2, { flexDirection: 'row', alignItems: 'center' }]}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={s.nom}>Modo fácil</Text>
          <Text style={s.sub}>Botones grandes y pocas opciones, para que el adulto mayor pida su acompañamiento solo.</Text>
        </View>
        <View style={[s.sw, facil && { backgroundColor: C.teal }]}><View style={[s.swDot, facil && { alignSelf: 'flex-end' }]} /></View>
      </TouchableOpacity>
      <Btn t="Cerrar sesión" tipo="line" onPress={salir} />
    </ScrollView>
  );
}
