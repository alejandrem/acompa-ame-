import React from 'react';
import { Image, View } from 'react-native';

export default function Marca({ size = 28 }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../../assets/logo.jpeg')}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    </View>
  );
}
