import React, { useEffect, useState } from 'react';
import { Animated, Easing, Text } from 'react-native';
import { C } from '../theme/colors';
import { s } from '../styles/styles';
import Marca from '../components/ui/Marca';

export default function Splash({ fin }) {
  const [c] = useState(() => new Animated.Value(0));
  const [t] = useState(() => new Animated.Value(0));
  const [o] = useState(() => new Animated.Value(1));
  useEffect(() => {
    Animated.sequence([
      Animated.timing(c, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(t, { toValue: 1, duration: 700, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(o, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      if (fin) fin();
    });
  }, [c, o, t, fin]);
  return (
    <Animated.View style={[s.splash, { opacity: o }]}>
      <Animated.View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: C.coral, transform: [{ scale: c.interpolate({ inputRange: [0, 1], outputRange: [0, 14] }) }] }} />
      <Animated.View style={{ position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: C.teal, transform: [{ scale: c.interpolate({ inputRange: [0, 1], outputRange: [0, 9] }) }] }} />
      <Animated.View style={{ alignItems: 'center', opacity: t, transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
        <Marca size={54} color={C.white} />
        <Text style={s.splashN}>acompáñame</Text>
        <Text style={s.splashL}>Acompañando vidas</Text>
      </Animated.View>
    </Animated.View>
  );
}
