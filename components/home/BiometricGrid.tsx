import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/Styles';
import { styles } from './styles';

type Props = {
  onOpenSleepModal: () => void;
  sleepHours: string;
  hrvValue: number;
  cortisolRisk: string;
};

export function BiometricGrid({
  onOpenSleepModal,
  sleepHours,
  hrvValue,
  cortisolRisk,
}: Props) {
  return (
    <View style={styles.biometricGrid}>
      {/* SLEEP TILE */}
      <TouchableOpacity
        style={styles.biometricTile}
        onPress={onOpenSleepModal}
        activeOpacity={0.8}
      >
        <View style={styles.tileHeader}>
          <View style={[styles.tileIconContainer, { backgroundColor: Palette.surfaceBlueMuted }]}>
            <Ionicons name="moon" size={16} color={Palette.oceanBlue} />
          </View>
          <Ionicons name="add-circle-outline" size={18} color={Palette.textSubtle} />
        </View>
        <Text style={styles.tileLabel}>Sleep Duration</Text>
        <Text style={styles.tileValue}>{sleepHours}</Text>
        <Text style={styles.tileMeta}>Tap to update log</Text>
      </TouchableOpacity>

      {/* HRV TILE */}
      <View style={styles.biometricTile}>
        <View style={styles.tileHeader}>
          <View style={[styles.tileIconContainer, { backgroundColor: Palette.surfaceGreenMuted }]}>
            <Ionicons name="heart" size={16} color={Palette.forestGreen} />
          </View>
        </View>
        <Text style={styles.tileLabel}>Body Recovery</Text>
        <Text style={styles.tileValue}>{hrvValue} ms</Text>
        <Text style={styles.tileMeta}>Ready for daily tasks</Text>
      </View>

      {/* STRESS LEVEL TILE */}
      <View style={styles.biometricTile}>
        <View style={styles.tileHeader}>
          <View style={[styles.tileIconContainer, { backgroundColor: Palette.surfaceOrangeMuted }]}>
            <Ionicons name="flame" size={16} color={Palette.orange} />
          </View>
        </View>
        <Text style={styles.tileLabel}>Stress Level</Text>
        <Text style={styles.tileValue}>{cortisolRisk}</Text>
        <Text style={styles.tileMeta}>Take light breaks</Text>
      </View>

      {/* ENERGY TILE */}
      <View style={styles.biometricTile}>
        <View style={styles.tileHeader}>
          <View style={[styles.tileIconContainer, { backgroundColor: Palette.surfaceCrimsonMuted }]}>
            <Ionicons name="battery-charging" size={16} color={Palette.crimson} />
          </View>
        </View>
        <Text style={styles.tileLabel}>Energy Bank</Text>
        <Text style={styles.tileValue}>62%</Text>
        <Text style={styles.tileMeta}>Pace yourself today</Text>
      </View>
    </View>
  );
}