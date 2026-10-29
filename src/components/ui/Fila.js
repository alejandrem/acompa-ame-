import React from 'react';
import { Text, View } from 'react-native';
import { C } from '../../theme/colors';
import { s } from '../../styles/styles';

export default function Fila({ a, b, fuerte }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
      <Text style={[s.sub, fuerte && { color: C.ink, fontWeight: '800' }]}>{a}</Text>
      <Text style={[s.sub, { color: C.ink }, fuerte && { fontWeight: '800', fontSize: 17 }]}>{b}</Text>
    </View>
  );
}
