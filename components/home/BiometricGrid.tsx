
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette } from '../../constants/Styles';
import { styles } from './styles';
import { useAzuka } from '../../contexts/AzukaContext';

type Props = {
  onOpenSleepModal: () => void;
};

export function BiometricGrid({
  onOpenSleepModal,
}: Props) {
  const { dailyState, dailyScore } = useAzuka();

  // ============================================================
  // AZUKA CONTEXT = SOURCE OF TRUTH
  // ============================================================

  const sleepHours =
    dailyState?.sleep?.sleep_hours;

  const dailyRecoveryScore =
    dailyScore?.daily_recovery_score;

  const stressLevel =
    dailyScore?.stress_level;

  const phaseEnergyScore =
    dailyScore?.phase_energy_score;

  const strainOutputBalanceScore =
    dailyScore?.strain_output_balance_score;

  return (
    <View style={styles.biometricGrid}>

      {/* ========================================================
          SLEEP
          Source: DailyState
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
          Source: DailyScore
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
          Source: DailyScore
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
          Source: DailyScore
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
          Source: DailyScore
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
