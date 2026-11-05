import React, { useEffect, useState } from 'react';
import { Animated, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import Btn from '../components/ui/Btn';
import Marca from '../components/ui/Marca';
import TerminosLegal from './TerminosLegal';

export default function Acceso({ entrar }) {
  const [reg, setReg] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [f, setF] = useState({ nombre: '', adulto: '', correo: '', clave: '' });
  const [err, setErr] = useState('');
  const [aceptoT, setAceptoT] = useState(false);
  const [verLegal, setVerLegal] = useState(false);
  const [a] = useState(() => new Animated.Value(0));
  useEffect(() => { Animated.timing(a, { toValue: 1, duration: 600, useNativeDriver: true }).start(); }, [a]);
  const set = (k) => (v) => setF((prev) => ({ ...prev, [k]: v }));
  const ir = () => {
    if (!aceptoT) return setErr('Debes aceptar los términos y condiciones para continuar.');
    if (!f.correo.includes('@') || f.clave.length < 4) return setErr('Revisa tu correo y usa una contraseña de 4 o más caracteres.');
    if (reg && (!f.nombre.trim() || !f.adulto.trim())) return setErr('Escribe tu nombre y el de tu familiar.');
    entrar({ nombre: reg ? f.nombre.trim() : 'Alicia Ramírez', adulto: reg ? f.adulto.trim() : 'Doña Elena', correo: f.correo });
  };
  const continuarGoogle = () => {
    if (!aceptoT) return setErr('Debes aceptar los términos y condiciones para continuar.');
    setErr('Google Sign-In aún no está implementado en la demo. Usa tu correo y contraseña.');
  };
  if (verLegal) return <TerminosLegal volver={() => setVerLegal(false)} />;
  return (
    <ScrollView style={{ backgroundColor: C.sand }} contentContainerStyle={{ padding: 26, paddingTop: 60, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <Animated.View style={{ opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
        <View style={{ alignItems: 'center', marginBottom: 8, marginTop: -10 }}>
          <Marca size={72} />
        </View>
        <Text style={[s.gran, { marginTop: 4 }]}>De la mano de los tuyos</Text>
        <Text style={[s.sub, { marginBottom: 20 }]}>Acompañantes verificados para trámites, citas y paseos de tus papás o abuelos.</Text>

        {reg && (
          <>
            <TextInput style={s.in} placeholder="Tu nombre" placeholderTextColor={C.grey} value={f.nombre} onChangeText={set('nombre')} />
            <TextInput style={s.in} placeholder="Nombre de tu adulto mayor" placeholderTextColor={C.grey} value={f.adulto} onChangeText={set('adulto')} />
          </>
        )}

        <TextInput style={s.in} placeholder="Correo" placeholderTextColor={C.grey} autoCapitalize="none" keyboardType="email-address" value={f.correo} onChangeText={set('correo')} />

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: C.line }}>
          <TextInput
            style={{ flex: 1, padding: 14, fontSize: 15, color: C.ink }}
            placeholder="Contraseña"
            placeholderTextColor={C.grey}
            secureTextEntry={!showPass}
            value={f.clave}
            onChangeText={set('clave')}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ paddingHorizontal: 14, paddingVertical: 10 }}>
            <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'flex-end', marginBottom: 12 }}>
          <TouchableOpacity>
            <Text style={{ color: C.teal, fontWeight: '700', fontSize: 13 }}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity
            accessibilityRole="checkbox"
            accessibilityState={{ checked: aceptoT }}
            accessibilityLabel="Aceptar los términos y condiciones"
            accessibilityHint="Marca este cuadro para indicar que aceptas los términos y condiciones"
            onPress={() => {
              setAceptoT(!aceptoT);
              setErr('');
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ width: 26, height: 26, borderRadius: 6, borderWidth: 2, borderColor: C.ink, backgroundColor: aceptoT ? C.teal : C.white, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}
          >
            {aceptoT && <Text style={{ color: C.white, fontWeight: '900' }}>✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="link"
            accessibilityLabel="Ver los términos y condiciones completos"
            onPress={() => setVerLegal(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ flex: 1, paddingVertical: 6 }}
          >
            <Text style={{ color: C.teal, fontWeight: '700', fontSize: 14, lineHeight: 19 }}>Acepto los términos y condiciones</Text>
          </TouchableOpacity>
        </View>

        {!!err && <Text style={{ color: C.red, marginBottom: 10 }}>{err}</Text>}

        <Btn t="Entrar" onPress={ir} />

        <View style={{ alignItems: 'center', marginVertical: 14 }}>
          <Text style={s.sub}>o ingresa con:</Text>
        </View>

        <TouchableOpacity
          onPress={continuarGoogle}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.white, borderRadius: 12, paddingVertical: 14, borderWidth: 1, borderColor: C.line, marginBottom: 12 }}
        >
          <Image source={{ uri: 'https://www.google.com/favicon.ico' }} style={{ width: 20, height: 20, marginRight: 10 }} />
          <Text style={{ color: C.ink, fontWeight: '700', fontSize: 15 }}>Continuar con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setReg(!reg); setErr(''); }} style={{ borderRadius: 12, paddingVertical: 14, alignItems: 'center', backgroundColor: C.tealSoft, borderWidth: 1, borderColor: C.sand2 }}>
          <Text style={{ color: C.ink, fontWeight: '700', fontSize: 15 }}>{reg ? 'Ya tengo cuenta' : 'crear una cuenta'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}
