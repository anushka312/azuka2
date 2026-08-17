import React from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { styles } from './workoutStyles';

const workout = {
  phase: 'Luteal',
  day: 22,
  readiness: 68,
  intensity: 'Moderate',
  intensityColor: Palette.orange,

  exercises: [
    {
      name: 'Yoga Flow',
      duration: '20 min',
    },
    {
      name: 'Light Cardio Walk',
      duration: '30 min',
    },
    {
      name: 'Stretching',
      duration: '10 min',
    },
  ],

  warnings: [
    'Ligament laxity - avoid high-impact movements',
    'Elevated inflammation - prioritize recovery',
  ],
};

export default function TodayWorkout() {
  return (
    <View>

      {/* =========================
          READINESS CARD
      ========================== */}

      <View style={GlobalStyles.cardElevated}>
        <View style={styles.readinessHeader}>

          <View style={styles.recoveryLeft}>
            <View style={styles.recoveryIcon}>
              <Ionicons
                name="leaf-outline"
                size={25}
                color={Palette.orange}
              />
            </View>

            <View>
              <Text style={styles.recoveryTitle}>
                Recovery Focus
              </Text>

              <Text style={styles.phaseText}>
                {workout.phase} • Day {workout.day}
              </Text>
            </View>
          </View>

          <View style={styles.readiness}>
            <Text style={styles.readinessNumber}>
              {workout.readiness}%
            </Text>

            <Text style={styles.readinessLabel}>
              Readiness
            </Text>
          </View>
        </View>

        {/* Intensity */}
        <View style={styles.badgeRow}>

          <View
            style={[
              styles.intensityBadge,
              {
                backgroundColor: workout.intensityColor,
              },
            ]}
          >
            <Text style={styles.lightBadgeText}>
              {workout.intensity} Intensity
            </Text>
          </View>

          <View style={styles.durationBadge}>
            <Text style={styles.durationBadgeText}>
              45 min total
            </Text>
          </View>
        </View>

        {/* Warnings */}
        {workout.warnings.length > 0 && (
          <View style={styles.warningList}>
            {workout.warnings.map((warning, index) => (
              <View
                key={index}
                style={styles.warning}
              >
                <Ionicons
                  name="warning-outline"
                  size={17}
                  color={Palette.crimson}
                />

                <Text style={styles.warningText}>
                  {warning}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* =========================
          EXERCISES
      ========================== */}

      <View style={GlobalStyles.cardElevated}>
        <Text style={styles.cardTitle}>
          Today's Exercises
        </Text>

        <View>
          {workout.exercises.map((exercise, index) => (
            <Pressable
              key={exercise.name}
              style={[
                styles.exerciseRow,
                index === workout.exercises.length - 1 &&
                  styles.exerciseRowLast,
              ]}
            >
              <View style={styles.exerciseLeft}>
                <View style={styles.exerciseIcon}>
                  <Ionicons
                    name="barbell-outline"
                    size={20}
                    color={Palette.orange}
                  />
                </View>

                <View>
                  <Text style={styles.exerciseName}>
                    {exercise.name}
                  </Text>

                  <Text style={styles.exerciseDuration}>
                    {exercise.duration}
                  </Text>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={Palette.textSubtle}
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* =========================
          ACTION BUTTONS
      ========================== */}

      <View style={styles.actionRow}>

        <Pressable
          style={[
            styles.actionButton,
            styles.actionButtonPrimary,
          ]}
        >
          <Ionicons
            name="checkmark"
            size={21}
            color={Palette.textWhite}
          />

          <Text style={styles.actionPrimaryText}>
            Mark Done
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
        >
          <Ionicons
            name="create-outline"
            size={21}
            color={Palette.textPrimary}
          />

          <Text style={styles.actionText}>
            Edit
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
        >
          <Ionicons
            name="refresh-outline"
            size={21}
            color={Palette.textPrimary}
          />

          <Text style={styles.actionText}>
            Regenerate
          </Text>
        </Pressable>

      </View>
    </View>
  );
}