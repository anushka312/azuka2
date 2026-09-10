
import React from 'react';
import { View, Text } from 'react-native';

import { useAzuka } from '../../contexts/AzukaContext';

import { styles } from './styles';

export function CycleStatusCard() {
  const { userProfile, dailyScore } = useAzuka();

  // ============================================================
  // USER PROFILE CYCLE DATA
  // ============================================================

  const lastPeriodStartDate =
    userProfile?.cycle?.last_period_start_date;

  const cycleLength =
    userProfile?.general_state?.average_cycle_length ?? 28;

  const periodDuration =
    userProfile?.general_state?.period_duration ?? 5;

  // ============================================================
  // CALCULATE TODAY'S CYCLE DAY
  // ============================================================

  let cycleDay: number | null = null;
  let phase: string | null = null;

  if (lastPeriodStartDate) {
    const startDate = new Date(
      `${lastPeriodStartDate}T12:00:00`,
    );

    const today = new Date();

    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12,
      0,
      0,
    );

    const difference =
      Math.floor(
        (todayDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

    cycleDay =
      ((difference % cycleLength) + cycleLength) %
        cycleLength +
      1;

    // ==========================================================
    // CALCULATE PHASE
    // ==========================================================

    if (cycleDay <= periodDuration) {
      phase = 'Menstrual';
    } else {
      const ovulationDay =
        Math.round(cycleLength / 2);

      if (cycleDay < ovulationDay) {
        phase = 'Follicular';
      } else if (cycleDay === ovulationDay) {
        phase = 'Ovulation';
      } else {
        phase = 'Luteal';
      }
    }
  }

  // ============================================================
  // AZUKA DAILY GUIDANCE
  // ============================================================

  const displayMessage =
    dailyScore?.comment ??
    'Your daily guidance is being personalized based on your current cycle phase and body state.';

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <View style={styles.cycleCard}>

      {/* ========================================================
          HEADER
      ======================================================== */}

      <View style={styles.cycleCardHeader}>
        <View style={styles.phaseBadge}>

          <View style={styles.phaseBadgeDot} />

          <Text style={styles.phaseBadgeText}>
            {phase
              ? `${phase} Phase`
              : 'Cycle Phase'}

            {cycleDay != null
              ? ` • Day ${cycleDay}`
              : ''}
          </Text>

        </View>
      </View>

      {/* ========================================================
          AZUKA DAILY GUIDANCE
      ======================================================== */}

      <Text style={styles.orchestratorMessage}>
        {displayMessage}
      </Text>

    </View>
  );
}
