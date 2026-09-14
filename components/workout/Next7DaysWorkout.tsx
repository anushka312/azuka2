import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { useAzuka } from '../../contexts/AzukaContext';

export default function Next7DaysWorkout() {
  const { nextWorkouts, isLoading } = useAzuka();

  /*
   * AzukaContext is the source of truth.
   *
   * nextWorkouts comes from:
   * GET /api/workout/next/{userId}
   *
   * We do not fetch anything directly here.
   */

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>
          7-Day Biological Outlook
        </Text>

        <Text style={styles.sectionSubtitle}>
          Loading your adaptive workout plan...
        </Text>
      </View>
    );
  }

  if (!nextWorkouts || nextWorkouts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>
          7-Day Biological Outlook
        </Text>

        <Text style={styles.sectionSubtitle}>
          No upcoming workouts available yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        7-Day Biological Outlook
      </Text>

      <Text style={styles.sectionSubtitle}>
        Dynamically adjusted to your cycle & stress load
      </Text>

      {nextWorkouts.map((item, index) => {
        /*
         * Backend workout structure:
         *
         * {
         *   date: "2026-08-26",
         *   status: "planned",
         *   info_tag: "Recovery Focus",
         *   intensity_tag: "Low",
         *   activities: [...]
         * }
         */

        const workoutDate = new Date(`${item.date}T00:00:00`);

        const dayName =
          index === 0
            ? 'Today'
            : workoutDate.toLocaleDateString('en-US', {
                weekday: 'short',
              });

        const dateText = workoutDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

        /*
         * Map the backend intensity to the existing
         * visual colors.
         */
        const intensity = item.intensity_tag || 'Moderate';

        let intensityColor = Palette.oceanBlue;

        if (
          intensity.toLowerCase().includes('low') ||
          intensity.toLowerCase().includes('light')
        ) {
          intensityColor = Palette.orange;
        } else if (
          intensity.toLowerCase().includes('high') ||
          intensity.toLowerCase().includes('hard')
        ) {
          intensityColor = Palette.crimson;
        } else if (
          intensity.toLowerCase().includes('moderate')
        ) {
          intensityColor = Palette.forestGreen;
        }

        /*
         * Convert backend activity objects into
         * the exercise names shown in the UI.
         */
        const exercises =
          item.activities?.map(
            (activity) => activity.activity_name
          ) || [];

        return (
          <View
            key={`${item.date}-${index}`}
            style={[
              GlobalStyles.cardElevated,
              styles.cardWrapper,
            ]}
          >
            <View style={styles.weekRow}>
              {/* DATE COLUMN */}
              <View style={styles.dateColumn}>
                <Text style={styles.dayName}>
                  {dayName}
                </Text>

                <Text style={styles.dateText}>
                  {dateText}
                </Text>
              </View>

              <View style={styles.verticalDivider} />

              {/* WORKOUT INFO */}
              <View style={styles.weekInfo}>
                <View style={styles.phaseRow}>
                  <Text style={styles.weekPhase}>
                    {item.info_tag || 'Adaptive Workout'}
                  </Text>

                  <Text style={styles.statusBadge}>
                    {item.status === 'planned'
                      ? 'On Track'
                      : item.status || 'Planned'}
                  </Text>
                </View>

                {/* TARGET DURATION */}
                <Text style={styles.weekDuration}>
                  Target:{' '}
                  {item.activities?.reduce(
                    (total, activity) =>
                      total + (activity.duration_mins || 0),
                    0
                  ) || 0}{' '}
                  min
                </Text>

                {/* EXERCISES */}
                {exercises.length > 0 && (
                  <View style={styles.exerciseContainer}>
                    {exercises.map((exercise, idx) => (
                      <View
                        key={`${exercise}-${idx}`}
                        style={styles.exerciseTagWrapper}
                      >
                        <Text style={styles.exerciseTag}>
                          {exercise}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* INTENSITY BADGE */}
              <View
                style={[
                  styles.weekIntensity,
                  {
                    backgroundColor: intensityColor,
                  },
                ]}
              >
                <Text style={styles.weekIntensityText}>
                  {intensity}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary || '#111',
    marginBottom: 2,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary || '#666',
    marginBottom: 12,
  },

  cardWrapper: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  weekRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  dateColumn: {
    width: 50,
  },

  dayName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#222',
  },

  dateText: {
    fontSize: 11,
    color: '#888',
  },

  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
    marginHorizontal: 12,
  },

  weekInfo: {
    flex: 1,
    paddingRight: 8,
  },

  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },

  weekPhase: {
    fontWeight: '700',
    fontSize: 13,
    color: '#444',
  },

  statusBadge: {
    fontSize: 10,
    color: '#007AFF',
    backgroundColor: '#E5F1FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },

  weekDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  exerciseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginRight: -4,
  },

  exerciseTagWrapper: {
    marginRight: 4,
    marginBottom: 4,
  },

  exerciseTag: {
    fontSize: 10,
    color: '#555',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },

  weekIntensity: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },

  weekIntensityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});