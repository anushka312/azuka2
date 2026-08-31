
import React from 'react';

import { View, Text } from 'react-native';

import { useAzuka } from '../../contexts/AzukaContext';

import { styles } from './styles';

export function CycleStatusCard() {
  const { dailyState } = useAzuka();

  // ============================================================
  // AZUKA CONTEXT = SOURCE OF TRUTH
  // ============================================================

  const phase = dailyState?.phase;
  const cycleDay = dailyState?.day;
  const comment = dailyState?.comment;

  // ============================================================
  // DISPLAY MESSAGE
  // ============================================================

  const displayMessage =
    comment ||
    'Your daily guidance is being personalized based on your current cycle phase and body state.';

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
