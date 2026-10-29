import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { C } from '../../theme/colors';
import { s } from '../../styles/styles';

export default function Btn({ t, onPress, tipo = 'ink', style, off }) {
  return (
    <TouchableOpacity activeOpacity={0.85} disabled={off} onPress={onPress}
      style={[s.btn, tipo === 'ink' && { backgroundColor: C.ink }, tipo === 'teal' && { backgroundColor: C.teal },
        tipo === 'sand' && { backgroundColor: C.sand }, tipo === 'line' && { borderWidth: 1.5, borderColor: C.ink },
        off && { opacity: 0.4 }, style]}>
      <Text style={[s.btnT, (tipo === 'sand' || tipo === 'line') && { color: C.ink }]}>{t}</Text>
    </TouchableOpacity>
  );
}
