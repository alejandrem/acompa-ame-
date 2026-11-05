import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import Btn from '../components/ui/Btn';
import { TERMINOS_COMPLETOS } from '../data/terminos';
import { mdTerminos } from '../theme/markdown';

export default function TerminosLegal({ volver }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18, paddingBottom: 10 }}>
        <TouchableOpacity
          onPress={volver}
          style={s.atras}
          accessibilityRole="button"
          accessibilityLabel="Volver a los términos y condiciones"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text accessibilityRole="header" style={[s.gran2, { fontSize: 20, marginBottom: 0, marginLeft: 14, flex: 1 }]}>Términos y condiciones</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 22, paddingTop: 4, paddingBottom: 20 }}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <Markdown style={mdTerminos}>{TERMINOS_COMPLETOS}</Markdown>
      </ScrollView>

      <View style={[s.pie, { backgroundColor: C.white }]}>
        <Btn t="Volver" tipo="teal" onPress={volver} />
      </View>
    </View>
  );
}
