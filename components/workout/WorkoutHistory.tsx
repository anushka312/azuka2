import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { styles } from './workoutStyles';

const history = [
  {
    date: 'Feb 3',
    type: 'Pilates',
    duration: 50,
    completed: true,
    phase: 'Luteal',
  },
  {
    date: 'Feb 2',
    type: 'Yoga',
    duration: 45,
    completed: true,
    phase: 'Luteal',
  },
  {
    date: 'Feb 1',
    type: 'HIIT',
    duration: 30,
    completed: true,
    phase: 'Luteal',
  },
  {
    date: 'Jan 31',
    type: 'Strength',
    duration: 55,
    completed: true,
    phase: 'Ovulatory',
  },
  {
    date: 'Jan 30',
    type: 'Running',
    duration: 40,
    completed: true,
    phase: 'Ovulatory',
  },
];

export default function WorkoutHistory() {
  return (
    <View>
      {history.map((item) => (
        <View
          key={`${item.date}-${item.type}`}
          style={GlobalStyles.cardElevated}
        >
          <View style={styles.historyRow}>

            <View style={styles.historyLeft}>

              <View style={styles.historyIcon}>
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={Palette.oceanBlue}
                />
              </View>

              <View>
                <Text style={styles.historyType}>
                  {item.type}
                </Text>

                <Text style={styles.historyMeta}>
                  {item.date} • {item.duration} min
                </Text>
              </View>

            </View>

            <Text style={styles.historyPhase}>
              {item.phase}
            </Text>

          </View>
        </View>
      ))}
    </View>
  );
}