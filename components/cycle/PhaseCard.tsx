import React from 'react';
import { Text, View } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { dailyData } from './data';
import { styles } from './styles';

interface PhaseCardProps {
  selectedDate?: string;
  phase?: string;
  cycleDay?: number;
  cycleLength?: number;
  progress?: number;
  nextPeriod?: string;
  badge?: string;
}

const phaseConfig: Record<string, { color: string; backgroundColor: string; badge: string }> = {
  Menstrual: {
    color: Palette.crimson,
    backgroundColor: Palette.surfaceCrimsonMuted,
    badge: 'Recovery',
  },
  Follicular: {
    color: Palette.forestGreen,
    backgroundColor: Palette.surfaceGreenMuted,
    badge: 'Build',
  },
  Ovulation: {
    color: Palette.marigold,
    backgroundColor: Palette.surfaceMarigoldMuted,
    badge: 'Peak',
  },
  Ovulatory: {
    color: Palette.marigold,
    backgroundColor: Palette.surfaceMarigoldMuted,
    badge: 'Peak',
  },
  Luteal: {
    color: Palette.oceanBlue,
    backgroundColor: Palette.surfaceBlueMuted,
    badge: 'Balance',
  },
  'Late Luteal': {
    color: Palette.orange,
    backgroundColor: Palette.surfaceOrangeMuted,
    badge: 'Recovery',
  },
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PhaseCard({
  selectedDate,
  phase: overridePhase,
  cycleDay: overrideCycleDay,
  cycleLength: overrideCycleLength,
  progress: overrideProgress,
  nextPeriod: overrideNextPeriod,
  badge: overrideBadge,
}: PhaseCardProps) {
  const today = getTodayDate();
  const dateToUse = selectedDate ?? today;

  let data = dailyData[dateToUse];
  if (!data) {
    const availableDates = Object.keys(dailyData).sort();
    const latestDate = availableDates[availableDates.length - 1];
    data = dailyData[latestDate];
  }

  const currentPhase = overridePhase || data?.phase || 'Luteal';
  const currentDay = overrideCycleDay ?? data?.cycleDay ?? 22;
  const currentLength = overrideCycleLength ?? data?.cycleLength ?? 28;
  const currentProgress = overrideProgress ?? data?.progress ?? Math.round((currentDay / currentLength) * 100);
  const currentNextPeriod = overrideNextPeriod ?? data?.nextPeriod ?? 'Period in ~6 days';

  const config = phaseConfig[currentPhase] || phaseConfig['Luteal'];
  const badgeLabel = overrideBadge || config.badge;

  return (
    <View
      style={[
        GlobalStyles.cardElevated,
        styles.phaseCard,
        {
          backgroundColor: config.backgroundColor,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.phaseHeader}>
        <View>
          <Text style={styles.smallLabel}>
            CURRENT PHASE
          </Text>

          <Text style={styles.phaseTitle}>
            {currentPhase}
          </Text>

          <Text style={styles.phaseSubtitle}>
            Day {currentDay} of {currentLength}
          </Text>
        </View>

        {/* Badge */}
        <View style={styles.phaseBadge}>
          <View
            style={[
              styles.phaseDot,
              {
                backgroundColor: config.color,
              },
            ]}
          />

          <Text
            style={[
              styles.phaseBadgeText,
              {
                color: config.color,
              },
            ]}
          >
            {badgeLabel}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${currentProgress}%`,
              backgroundColor: config.color,
            },
          ]}
        />
      </View>

      {/* Helper text */}
      <Text style={styles.helperText}>
        {currentNextPeriod}
      </Text>
    </View>
  );
}