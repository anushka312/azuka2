import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette } from '../../constants/Styles';
import { styles } from './styles';

// ============================================================
// PROPS
// ============================================================
// All biometric values now flow down from Home.tsx, which is
// the single source of truth reading AzukaContext. We no longer
// call useAzuka() here directly to avoid a second, redundant
// context read that can drift from what Home actually rendered.

type Props = {
  onOpenSleepModal: () => void;

  sleepHours?: number | null;
  dailyRecoveryScore?: number | null;
  stressLevel?: string | null;
  phaseEnergyScore?: number | null;
  strainOutputBalanceScore?: number | null;
};

export function BiometricGrid({
  onOpenSleepModal,
  sleepHours,
  dailyRecoveryScore,
  stressLevel,
  phaseEnergyScore,
  strainOutputBalanceScore,
}: Props) {
  return (
    <View style={styles.biometricGrid}>

      {/* ========================================================
          SLEEP
          Source: DailyState (passed from Home)
          ======================================================== */}

      <TouchableOpacity
        style={styles.biometricTile}
        onPress={onOpenSleepModal}
        activeOpacity={0.8}
      >
        <View style={styles.tileHeader}>
          <View
            style={[
              styles.tileIconContainer,
              {
                backgroundColor:
                  Palette.surfaceBlueMuted,
              },
            ]}
          >
            <Ionicons
              name="moon"
              size={16}
              color={Palette.oceanBlue}
            />
          </View>

          <Ionicons
            name="add-circle-outline"
            size={18}
            color={Palette.textSubtle}
          />
        </View>

        <Text style={styles.tileLabel}>
          Sleep Duration
        </Text>

        <Text style={styles.tileValue}>
          {sleepHours != null
            ? `${sleepHours}h`
            : '--'}
        </Text>

        <Text style={styles.tileMeta}>
          Tap to update log
        </Text>
      </TouchableOpacity>

      {/* ========================================================
          DAILY RECOVERY
          Source: DailyScore (passed from Home)
          ======================================================== */}

      <View style={styles.biometricTile}>
        <View style={styles.tileHeader}>
          <View
            style={[
              styles.tileIconContainer,
              {
                backgroundColor:
                  Palette.surfaceGreenMuted,
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={Palette.forestGreen}
            />
          </View>
        </View>

        <Text style={styles.tileLabel}>
          Daily Recovery
        </Text>

        <Text style={styles.tileValue}>
          {dailyRecoveryScore != null
            ? `${dailyRecoveryScore}%`
            : '--'}
        </Text>

        <Text style={styles.tileMeta}>
          Capacity today
        </Text>
      </View>

      {/* ========================================================
          STRESS LEVEL
          Source: DailyScore (passed from Home)
          ======================================================== */}

      <View style={styles.biometricTile}>
        <View style={styles.tileHeader}>
          <View
            style={[
              styles.tileIconContainer,
              {
                backgroundColor:
                  Palette.surfaceOrangeMuted,
              },
            ]}
          >
            <Ionicons
              name="flame"
              size={16}
              color={Palette.orange}
            />
          </View>
        </View>

        <Text style={styles.tileLabel}>
          Stress Level
        </Text>

        <Text style={styles.tileValue}>
          {stressLevel ?? '--'}
        </Text>

        <Text style={styles.tileMeta}>
          Monitor workload
        </Text>
      </View>

      {/* ========================================================
          PHASE ENERGY
          Source: DailyScore (passed from Home)
          ======================================================== */}

      <View style={styles.biometricTile}>
        <View style={styles.tileHeader}>
          <View
            style={[
              styles.tileIconContainer,
              {
                backgroundColor:
                  Palette.surfaceCrimsonMuted,
              },
            ]}
          >
            <Ionicons
              name="battery-charging"
              size={16}
              color={Palette.crimson}
            />
          </View>
        </View>

        <Text style={styles.tileLabel}>
          Phase Energy
        </Text>

        <Text style={styles.tileValue}>
          {phaseEnergyScore != null
            ? `${phaseEnergyScore}%`
            : '--'}
        </Text>

        <Text style={styles.tileMeta}>
          Hormonal baseline
        </Text>
      </View>

      {/* ========================================================
          STRAIN OUTPUT BALANCE
          Source: DailyScore (passed from Home)
          ======================================================== */}

      <View style={styles.biometricTile}>
        <View style={styles.tileHeader}>
          <View
            style={[
              styles.tileIconContainer,
              {
                backgroundColor:
                  Palette.surfaceBlueMuted,
              },
            ]}
          >
            <Ionicons
              name="analytics"
              size={16}
              color={Palette.oceanBlue}
            />
          </View>
        </View>

        <Text style={styles.tileLabel}>
          Strain Balance
        </Text>

        <Text style={styles.tileValue}>
          {strainOutputBalanceScore != null
            ? `${strainOutputBalanceScore}%`
            : '--'}
        </Text>

        <Text style={styles.tileMeta}>
          Output alignment
        </Text>
      </View>

    </View>
  );
}