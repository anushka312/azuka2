
import React from 'react';
import {
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { styles } from './workoutStyles';
import { useAzuka } from '../../contexts/AzukaContext';

export default function WorkoutHistory() {
  const {
    workoutHistory,
    isLoading,
    error,
    refreshWorkoutData,
  } = useAzuka();

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <View
        style={{
          paddingVertical: 20,
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size="small"
          color={Palette.oceanBlue}
        />
      </View>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <View
        style={{
          paddingVertical: 20,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: Palette.crimson,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Unable to load workout history.
        </Text>

        <Text
          onPress={refreshWorkoutData}
          style={{
            color: Palette.oceanBlue,
            fontWeight: '600',
          }}
        >
          Try again
        </Text>
      </View>
    );
  }

  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (!workoutHistory || workoutHistory.length === 0) {
    return (
      <View
        style={{
          paddingVertical: 24,
          alignItems: 'center',
        }}
      >
        <Ionicons
          name="fitness-outline"
          size={28}
          color={Palette.textMuted}
        />

        <Text
          style={{
            marginTop: 8,
            color: Palette.textSecondary,
            fontSize: 13,
          }}
        >
          No workout history yet.
        </Text>
      </View>
    );
  }

  // ============================================================
  // WORKOUT HISTORY
  // ============================================================

  return (
    <View>
      {workoutHistory.map((item, index) => {
        const workoutDate =
          item.date
            ? new Date(item.date).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                }
              )
            : '';

        const duration =
          item.duration_mins ?? 0;

        const workoutType =
          item.activities?.length > 0
            ? item.activities[0]?.activity_name
            : 'Workout';

        return (
          <View
            key={`${item.date}-${workoutType}-${index}`}
            style={GlobalStyles.cardElevated}
          >
            <View style={styles.historyRow}>
              {/* LEFT */}
              <View style={styles.historyLeft}>
                <View style={styles.historyIcon}>
                  <Ionicons
                    name={
                      item.status === 'completed'
                        ? 'checkmark'
                        : 'fitness-outline'
                    }
                    size={20}
                    color={Palette.oceanBlue}
                  />
                </View>

                <View>
                  <Text style={styles.historyType}>
                    {workoutType}
                  </Text>

                  <Text style={styles.historyMeta}>
                    {workoutDate}
                    {' • '}
                    {duration} min
                  </Text>
                </View>
              </View>

              {/* PHASE */}
              <Text style={styles.historyPhase}>
                {item.phase || ''}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
