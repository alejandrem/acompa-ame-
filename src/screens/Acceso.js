import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import Btn from '../components/ui/Btn';
import Marca from '../components/ui/Marca';

export default function Acceso({ entrar }) {
  const [reg, setReg] = useState(false);
  const [f, setF] = useState({ nombre: '', adulto: '', correo: '', clave: '' });
  const [err, setErr] = useState('');
  const [a] = useState(() => new Animated.Value(0));
  useEffect(() => { Animated.timing(a, { toValue: 1, duration: 600, useNativeDriver: true }).start(); }, [a]);
  const set = (k) => (v) => setF((prev) => ({ ...prev, [k]: v }));
  const ir = () => {
    if (!f.correo.includes('@') || f.clave.length < 4) return setErr('Revisa tu correo y usa una contraseña de 4 o más caracteres.');
    if (reg && (!f.nombre.trim() || !f.adulto.trim())) return setErr('Escribe tu nombre y el de tu familiar.');
    entrar({ nombre: reg ? f.nombre.trim() : 'Alicia Ramírez', adulto: reg ? f.adulto.trim() : 'Doña Elena', correo: f.correo });
  };
  return (
    <ScrollView style={{ backgroundColor: C.sand }} contentContainerStyle={{ padding: 26, paddingTop: 60, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <Animated.View style={{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
        <Marca />
        <Text style={s.gran}>Ellos no tienen que ir solos.</Text>
        <Text style={[s.sub, { marginBottom: 26 }]}>Acompañantes verificados para trámites, citas y paseos de tus papás o abuelos.</Text>
        {reg && (
          <>
            <TextInput style={s.in} placeholder="Tu nombre" placeholderTextColor={C.grey} value={f.nombre} onChangeText={set('nombre')} />
            <TextInput style={s.in} placeholder="Nombre de tu adulto mayor" placeholderTextColor={C.grey} value={f.adulto} onChangeText={set('adulto')} />
          </>
        )}
        <TextInput style={s.in} placeholder="Correo" placeholderTextColor={C.grey} autoCapitalize="none" keyboardType="email-address" value={f.correo} onChangeText={set('correo')} />
        <TextInput style={s.in} placeholder="Contraseña" placeholderTextColor={C.grey} secureTextEntry value={f.clave} onChangeText={set('clave')} />
        {!!err && <Text style={{ color: C.red, marginBottom: 10 }}>{err}</Text>}
        <Btn t={reg ? 'Crear mi cuenta' : 'Entrar'} onPress={ir} />
        <TouchableOpacity onPress={() => { setReg(!reg); setErr(''); }} style={{ marginTop: 18, alignItems: 'center' }}>
          <Text style={{ color: C.ink, fontWeight: '700' }}>{reg ? 'Ya tengo cuenta' : 'Soy nuevo, quiero crear una cuenta'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}
