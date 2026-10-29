import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { C } from '../../theme/colors';
import { s } from '../../styles/styles';

export default function Pill({ t, on, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[s.pill, on && { backgroundColor: C.ink, borderColor: C.ink }]}>
      <Text style={[s.pillT, on && { color: C.white }]}>{t}</Text>
    </TouchableOpacity>
  );
}
