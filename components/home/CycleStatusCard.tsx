import React from 'react';
import { View, Text } from 'react-native';
import { Palette } from '../../constants/Styles';
import { styles } from './styles';

type Props = {
  phase: string;
  cycleDay: number;
  isMinimumWin: boolean;
};

export function CycleStatusCard({ phase, cycleDay, isMinimumWin }: Props) {
  return (
    <View style={styles.cycleCard}>
      <View style={styles.cycleCardHeader}>
        <View style={styles.phaseBadge}>
          <View style={styles.phaseBadgeDot} />
          <Text style={styles.phaseBadgeText}>{phase} Phase • Day {cycleDay}</Text>
        </View>
        
      </View>

      <Text style={styles.orchestratorMessage}>
        {isMinimumWin
          ? 'System in Recovery Preservation Mode. High stress detected—all volume caps reduced by 50% to protect nervous state.'
          : 'Estrogen is stabilizing and progesterone is rising. Shift towards steady-state effort and moderate recovery protocols.'}
      </Text>
    </View>
  );
}