import React from 'react';
import { Text, View } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { dailyData } from './data';

import { styles } from './styles';

interface PhaseCardProps {
  selectedDate?: string;
}

const phaseConfig = {
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
}: PhaseCardProps) {
  // Use selected date if provided, otherwise use today's date
  const today = getTodayDate();
  const dateToUse = selectedDate ?? today;

  // Get data for selected/today's date
  let data = dailyData[dateToUse];

  // If today's data doesn't exist yet, use the latest
  // available data from dailyData.
  if (!data) {
    const availableDates = Object.keys(dailyData).sort();
    const latestDate = availableDates[availableDates.length - 1];

    data = dailyData[latestDate];
  }

  // Don't render if there is no data
  if (!data) {
    return null;
  }

  const config =
    phaseConfig[data.phase as keyof typeof phaseConfig];

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
            {data.phase}
          </Text>

          <Text style={styles.phaseSubtitle}>
            Day {data.cycleDay} of {data.cycleLength}
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
            {config.badge}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${data.progress}%`,
              backgroundColor: config.color,
            },
          ]}
        />
      </View>

      {/* Helper text */}
      <Text style={styles.helperText}>
        {data.nextPeriod}
      </Text>
    </View>
  );
}