import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette, GlobalStyles } from '@/constants/Styles';
import ExerciseDetailModal from './ExerciseDetailModal';
import ActivityPickerModal from './ActivityPickerModal';
import { styles } from './workoutStyles';

type Exercise = {
  id: string;
  name: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  reason: string;
  description: string;
};

export type Activity = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const exercises: Exercise[] = [
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    duration: '3 mins',
    icon: 'body-outline',
    reason: 'Supports mobility and gentle spinal movement.',
    description:
      'A gentle mobility exercise that helps loosen the spine and prepare your body for movement without creating excessive fatigue.',
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridges',
    duration: '3 sets × 10',
    icon: 'fitness-outline',
    reason: 'Builds lower-body strength with low impact.',
    description:
      'Glute bridges activate the glutes and posterior chain while keeping the overall movement low impact.',
  },
  {
    id: 'breathing',
    name: 'Diaphragmatic Breathing',
    duration: '5 mins',
    icon: 'leaf-outline',
    reason: 'Helps down-regulate the nervous system.',
    description:
      'Slow diaphragmatic breathing encourages controlled breathing and can be used as a recovery-focused exercise.',
  },
];

export default function TodayWorkout() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const [selectedExercise, setSelectedExercise] =
    useState<Exercise | null>(null);

  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

  const [activityModalVisible, setActivityModalVisible] = useState(false);

  const [activities, setActivities] = useState<Activity[]>([]);

  const completedCount = useMemo(
    () => Object.values(completed).filter(Boolean).length,
    [completed]
  );

  const allCompleted = completedCount === exercises.length;

  const toggleExercise = (id: string) => {
    setCompleted(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = () => {
    if (allCompleted) {
      setCompleted({});
      return;
    }

    const next: Record<string, boolean> = {};

    exercises.forEach(exercise => {
      next[exercise.id] = true;
    });

    setCompleted(next);
  };

  const openExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalVisible(true);
  };

  const markExerciseComplete = (id: string) => {
    setCompleted(prev => ({
      ...prev,
      [id]: true,
    }));
  };

  const addActivities = (newActivities: Activity[]) => {
    setActivities(prev => {
      const existingIds = new Set(prev.map(activity => activity.id));

      const uniqueActivities = newActivities.filter(
        activity => !existingIds.has(activity.id)
      );

      return [...prev, ...uniqueActivities];
    });
  };

  const removeActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  return (
    <>
      {/* TODAY CARD */}
      <View style={GlobalStyles.cardElevated}>
        {/* HEADER */}
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.cardTitle}>Today's exercises</Text>

            <Text style={styles.exerciseHint}>
              {completedCount}/{exercises.length} completed
            </Text>
          </View>

          <Pressable
            onPress={toggleAll}
            style={[
              styles.tickAllButton,
              allCompleted && styles.tickAllButtonCompleted,
            ]}
          >
            <View
              style={[
                styles.tickAllCheck,
                allCompleted && styles.tickAllCheckCompleted,
              ]}
            >
              {allCompleted && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={Palette.textWhite}
                />
              )}
            </View>

            <Text
              style={[
                styles.tickAllText,
                allCompleted && styles.tickAllTextCompleted,
              ]}
            >
              {allCompleted ? 'Untick all' : 'Tick all'}
            </Text>
          </Pressable>
        </View>

        {/* EXERCISES */}
        {exercises.map((exercise, index) => {
          const isCompleted = !!completed[exercise.id];

          return (
            <Pressable
              key={exercise.id}
              onPress={() => openExercise(exercise)}
              style={[
                styles.exerciseRow,
                isCompleted && styles.exerciseRowCompleted,
                index === exercises.length - 1 && styles.exerciseRowLast,
              ]}
            >
              <View style={styles.exerciseLeft}>
                <View
                  style={[
                    styles.exerciseIcon,
                    isCompleted && styles.exerciseIconCompleted,
                  ]}
                >
                  <Ionicons
                    name={exercise.icon}
                    size={21}
                    color={
                      isCompleted
                        ? Palette.forestGreen
                        : Palette.orange
                    }
                  />
                </View>

                <View style={styles.exerciseInfo}>
                  <Text
                    style={[
                      styles.exerciseName,
                      isCompleted && styles.exerciseNameCompleted,
                    ]}
                  >
                    {exercise.name}
                  </Text>

                  <Text style={styles.exerciseDuration}>
                    {exercise.duration}
                  </Text>
                </View>
              </View>

              {/* CHECKBOX */}
              <Pressable
                onPress={event => {
                  event.stopPropagation();
                  toggleExercise(exercise.id);
                }}
                style={[
                  styles.exerciseCheck,
                  isCompleted && styles.exerciseCheckCompleted,
                ]}
              >
                {isCompleted && (
                  <Ionicons
                    name="checkmark"
                    size={17}
                    color={Palette.textWhite}
                  />
                )}
              </Pressable>

              <View style={styles.exerciseArrow}>
                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color={Palette.textMuted}
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ACTUAL ACTIVITY */}
      <View style={GlobalStyles.cardElevated}>
        <View style={styles.actualHeader}>
          <View style={styles.actualIcon}>
            <Ionicons
              name="walk-outline"
              size={22}
              color={Palette.oceanBlue}
            />
          </View>

          <View style={styles.actualHeaderText}>
            <Text style={styles.cardTitle}>What did you actually do?</Text>

            <Text style={styles.exerciseHint}>
              You can add more than one activity.
            </Text>
          </View>
        </View>

        {/* ADDED ACTIVITIES */}
        {activities.length > 0 && (
          <View style={styles.actualActivitiesList}>
            {activities.map(activity => (
              <View
                key={activity.id}
                style={styles.actualActivity}
              >
                <View style={styles.actualActivityLeft}>
                  <Ionicons
                    name={activity.icon}
                    size={19}
                    color={Palette.forestGreen}
                  />

                  <Text style={styles.actualActivityText}>
                    {activity.name}
                  </Text>
                </View>

                <Pressable
                  onPress={() => removeActivity(activity.id)}
                  hitSlop={10}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color={Palette.textMuted}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* ADD */}
        <Pressable
          onPress={() => setActivityModalVisible(true)}
          style={styles.addActivityButton}
        >
          <Ionicons
            name="add"
            size={21}
            color={Palette.oceanBlue}
          />

          <Text style={styles.addActivityText}>
            {activities.length > 0
              ? 'Add another activity'
              : 'Add activity'}
          </Text>
        </Pressable>
      </View>

      {/* STATUS */}
      {allCompleted && (
        <View style={styles.completedBanner}>
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={Palette.forestGreen}
          />

          <View style={styles.completedBannerText}>
            <Text style={styles.completedBannerTitle}>
              Today's workout complete
            </Text>

            <Text style={styles.completedBannerSubtitle}>
              Nice work. Your activity has been recorded.
            </Text>
          </View>
        </View>
      )}

      {/* EXERCISE MODAL */}
      <ExerciseDetailModal
        visible={exerciseModalVisible}
        exercise={selectedExercise}
        completed={
          selectedExercise
            ? !!completed[selectedExercise.id]
            : false
        }
        onClose={() => {
          setExerciseModalVisible(false);
          setSelectedExercise(null);
        }}
        onComplete={() => {
          if (selectedExercise) {
            markExerciseComplete(selectedExercise.id);
          }
        }}
      />

      {/* ACTIVITY MODAL */}
      <ActivityPickerModal
        visible={activityModalVisible}
        selectedActivities={activities}
        onClose={() => setActivityModalVisible(false)}
        onSave={addActivities}
      />
    </>
  );
}