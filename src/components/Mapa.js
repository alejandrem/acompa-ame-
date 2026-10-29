import React from 'react';
import { Image, Text, View } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import { W } from '../constants/layout';

export default function Mapa({ pines = [], alto, children }) {
  return (
    <View style={{ width: W, height: alto, backgroundColor: C.map, overflow: 'hidden' }}>
      {[10, 26, 44, 62, 78, 92].map((p) => (
        <View key={'h' + p} style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, height: 12, backgroundColor: C.white }} />
      ))}
      {[8, 30, 52, 74, 94].map((p) => (
        <View key={'v' + p} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: 12, backgroundColor: C.white }} />
      ))}
      <View style={{ position: 'absolute', left: '33%', top: '28%', width: '16%', height: '14%', backgroundColor: C.park, borderRadius: 12 }} />
      <View style={{ position: 'absolute', left: '56%', top: '64%', width: '15%', height: '12%', backgroundColor: C.park, borderRadius: 12 }} />
      {pines.map((p, i) => (
        <View key={i} style={[s.pin, { left: p.x * (W - 46), top: p.y * alto, borderColor: p.color || C.white }]}>
          {p.foto ? <Image source={{ uri: p.foto }} style={s.pinImg} /> : <Text style={{ fontSize: 18 }}>{p.e}</Text>}
        </View>
      ))}
      {children}
    </View>
  );
}
