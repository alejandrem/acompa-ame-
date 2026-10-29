import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import Btn from '../components/ui/Btn';

const TERMINOS = `CONDICIONES DEL SERVICIO

Por la seguridad y claridad de todas las partes:

Naturaleza del Servicio: Apoyo exclusivamente personal, social y logístico. No somos un servicio de atención médica, enfermería ni asistencia psicológica.

Criterios de Elegibilidad: El servicio no se prestará a personas que requieran cuidados médicos especializados o manejo de condiciones médicas de alta complejidad.

Alcance Operativo: No realizamos procedimientos clínicos, curaciones, administración de medicamentos ni prescripción de tratamientos.

Protocolo de Emergencia: Ante cualquier eventualidad, el acompañante notificará de inmediato a los servicios de emergencia y a los familiares designados.`;

export default function Terminos({ onAceptar }) {
  const [acepto, setAcepto] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 160 }} showsVerticalScrollIndicator>
        <Text style={s.gran2}>Términos y condiciones</Text>
        <Text style={[s.sub, { marginBottom: 16 }]}>Lee y acepta para continuar.</Text>
        <View style={s.resumen2}>
          <Text style={{ color: C.ink, fontSize: 14, lineHeight: 22 }}>{TERMINOS}</Text>
        </View>
        <TouchableOpacity onPress={() => setAcepto(!acepto)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <View style={{ width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: C.ink, backgroundColor: acepto ? C.teal : C.white, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            {acepto && <Text style={{ color: C.white, fontWeight: '800' }}>✓</Text>}
          </View>
          <Text style={{ color: C.ink, fontWeight: '600', flex: 1 }}>Acepto los términos y condiciones</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={s.pie}>
        <Btn t="Aceptar" tipo="teal" off={!acepto} onPress={onAceptar} />
      </View>
    </View>
  );
}