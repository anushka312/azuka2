import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';

export default function CycleHeader() {
  return (
    <View style={[styles.header, {marginTop: 20}]}>
      <Text style={styles.title}>
        Cycle & Hormones
      </Text>

      <Text style={styles.subtitle}>
        Track your cycle, symptoms & recovery signals
      </Text>
    </View>
  );
}