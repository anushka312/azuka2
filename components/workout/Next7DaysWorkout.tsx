import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { styles } from './workoutStyles';

const weekPlan = [
  {
    day: 'Today',
    date: 'Feb 4',
    phase: 'Luteal',
    intensity: 'Light',
    color: Palette.orange,
    duration: 45,
  },
  {
    day: 'Wed',
    date: 'Feb 5',
    phase: 'Luteal',
    intensity: 'Light',
    color: Palette.orange,
    duration: 30,
  },
  {
    day: 'Thu',
    date: 'Feb 6',
    phase: 'Menstrual',
    intensity: 'Recovery',
    color: Palette.crimson,
    duration: 20,
  },
  {
    day: 'Fri',
    date: 'Feb 7',
    phase: 'Menstrual',
    intensity: 'Recovery',
    color: Palette.crimson,
    duration: 25,
  },
  {
    day: 'Sat',
    date: 'Feb 8',
    phase: 'Follicular',
    intensity: 'Moderate',
    color: Palette.forestGreen,
    duration: 40,
  },
  {
    day: 'Sun',
    date: 'Feb 9',
    phase: 'Follicular',
    intensity: 'Moderate',
    color: Palette.forestGreen,
    duration: 50,
  },
  {
    day: 'Mon',
    date: 'Feb 10',
    phase: 'Follicular',
    intensity: 'High',
    color: Palette.oceanBlue,
    duration: 60,
  },
];

export default function Next7DaysWorkout() {
  return (
    <View>
      {weekPlan.map((day) => (
        <View
          key={`${day.day}-${day.date}`}
          style={GlobalStyles.cardElevated}
        >
          <View style={styles.weekRow}>

            {/* Date */}
            <View style={styles.dateColumn}>
              <Text style={styles.dayName}>
                {day.day}
              </Text>

              <Text style={styles.dateText}>
                {day.date}
              </Text>
            </View>

            <View style={styles.verticalDivider} />

            {/* Phase */}
            <View style={styles.weekInfo}>
              <Text style={styles.weekPhase}>
                {day.phase}
              </Text>

              <Text style={styles.weekDuration}>
                {day.duration} min
              </Text>
            </View>

            {/* Intensity */}
            <View
              style={[
                styles.weekIntensity,
                {
                  backgroundColor: day.color,
                },
              ]}
            >
              <Text style={styles.weekIntensityText}>
                {day.intensity}
              </Text>
            </View>

          </View>
        </View>
      ))}
    </View>
  );
}