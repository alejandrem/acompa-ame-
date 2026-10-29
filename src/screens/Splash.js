import React, { useEffect, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import { SvgXml } from 'react-native-svg';
import { C } from '../theme/colors';
import { s } from '../styles/styles';

export default function Splash({ fin }) {
  const [pos] = useState(() => new Animated.Value(1));
  const [rot] = useState(() => new Animated.Value(0));
  const [sc] = useState(() => new Animated.Value(0.3));
  const [flash] = useState(() => new Animated.Value(0));
  const [texto] = useState(() => new Animated.Value(0));
  const [o] = useState(() => new Animated.Value(1));
  const [svgText, setSvgText] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const asset = Asset.fromModule(require('../../assets/acompaniame_logo_v2.svg'));
        await asset.downloadAsync();
        const res = await fetch(asset.uri);
        const text = await res.text();
        setSvgText(text);
      } catch (_e) {
        setSvgText(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pos, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(rot, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(sc, { toValue: 1, duration: 900, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(flash, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(sc, { toValue: 1.18, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(flash, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(sc, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(texto, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.delay(700),
      Animated.timing(o, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      if (fin) fin();
    });
  }, [ready, pos, rot, sc, flash, texto, o, fin]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../../assets/logo.jpeg')} style={{ width: 170, height: 170, borderRadius: 85 }} resizeMode="contain" />
      </View>
    );
  }

  return (
    <Animated.View style={[s.splash, { backgroundColor: C.white, opacity: o }]}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: C.teal,
          opacity: flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] }),
          transform: [{ scale: flash.interpolate({ inputRange: [0, 1], outputRange: [0.6, 4] }) }],
        }}
      />
      <Animated.View
        style={{
          alignItems: 'center',
          transform: [
            { translateY: pos.interpolate({ inputRange: [0, 1], outputRange: [0, 260] }) },
            { rotate: rot.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] }) },
            { scale: sc },
          ],
        }}
      >
        {svgText ? (
          <SvgXml xml={svgText} width={170} height={170} />
        ) : (
          <View style={{ width: 170, height: 170, borderRadius: 85, backgroundColor: C.tealSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 64, fontWeight: '800', color: C.teal }}>A</Text>
          </View>
        )}
      </Animated.View>
      <Animated.View style={{ position: 'absolute', bottom: 120, alignItems: 'center', opacity: texto, transform: [{ translateY: texto.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
        <Text style={{ color: C.ink, fontSize: 34, fontWeight: '800', letterSpacing: -1 }}>ACOMPAÑAME</Text>
      </Animated.View>
    </Animated.View>
  );
}
