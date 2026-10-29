import React from 'react';
import { View } from 'react-native';
import { C } from '../../theme/colors';

export default function Marca({ size = 28, color = C.ink }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.coral }} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, marginLeft: -size * 0.35 }} />
    </View>
  );
}
