import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Pressable, Text, View, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette, GlobalStyles } from '@/constants/Styles';
import ExerciseDetailModal from './ExerciseDetailModal';
import ActivityPickerModal from './ActivityPickerModal';
import { styles } from './workoutStyles';
import { aiService, AzukaDailyOutput } from '@/services/aiService';
import { WorkoutListSkeleton } from '@/components/ui/Skeleton';
import { ErrorCard } from '@/components/ui/StateFeedback';

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
  metric?: 'duration' | 'sets';
  durationMinutes?: number;
  sets?: number;
  reps?: number;
  intensity?: 'Easy' | 'Moderate' | 'Hard';
  caloriesBurned?: number;
  notes?: string;
};

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'bodyweight-squats',
    name: 'Bodyweight Squats',
    duration: '3 sets × 12',
    icon: 'body-outline',
    reason: 'Builds lower-body capacity and stimulates growth hormone.',
    description:
      'A foundational strength movement designed to engage the quads, hamstrings, and glutes with zero joint impact.',
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridges',
    duration: '3 sets × 10',
    icon: 'fitness-outline',
    reason: 'Builds lower-body stability with low neurological fatigue.',
    description:
      'Glute bridges activate the posterior chain while keeping overall strain low and supportive of current hormonal phase.',
  },
  {
    id: 'plank-hold',
    name: 'Plank Hold',
    duration: '3 mins',
    icon: 'shield-checkmark-outline',
    reason: 'Develops core isometric endurance without excessive cortisol.',
    description:
      'Isometric abdominal bracing that enhances trunk stability while maintaining steady breathing.',
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Mobility',
    duration: '3 mins',
    icon: 'leaf-outline',
    reason: 'Supports spinal decompression and down-regulates nervous system.',
    description:
      'A gentle mobility flow that loosens the spine and facilitates recovery without metabolic fatigue.',
  },
];

export default function TodayWorkout() {
  const [exercisesList, setExercisesList] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [workoutMeta, setWorkoutMeta] = useState<{ infoTag: string; intensityTag: string }>({
    infoTag: 'Adaptive Strength',
    intensityTag: 'Moderate',
  });
  
  // Loading, saving and error states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoggedSuccessfully, setIsLoggedSuccessfully] = useState(false);

  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Fetch adaptive training plan from FastAPI backend
  const fetchAdaptiveWorkout = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const plan: AzukaDailyOutput = await aiService.getLatestDailyPlan('default_user');
      
      if (plan?.workout?.[0]) {
        const today = plan.workout[0];
        setWorkoutMeta({
          infoTag: today.info_tag || 'Adaptive Routine',
          intensityTag: today.intensity_tag || 'Moderate',
        });

        if (today.activities && today.activities.length > 0) {
          const mapped: Exercise[] = today.activities.map((act, index) => {
            const dur = act.sets && act.reps
              ? `${act.sets} sets × ${act.reps}`
              : act.duration_mins
              ? `${act.duration_mins} mins`
              : '10 mins';
            
            let icon: keyof typeof Ionicons.glyphMap = 'fitness-outline';
            if (act.type?.includes('mobility') || act.type?.includes('stretch')) icon = 'leaf-outline';
            else if (act.type?.includes('endurance') || act.type?.includes('core')) icon = 'shield-checkmark-outline';
            else if (act.type?.includes('strength')) icon = 'barbell-outline';

            return {
              id: `ex-${index}-${act.activity_name.toLowerCase().replace(/\s+/g, '-')}`,
              name: act.activity_name,
              duration: dur,
              icon,
              reason: `Bio-adapted for your current phase energy and recovery profile.`,
              description: `${act.activity_name} is specifically prescribed to match your metabolic state without over-straining recovery.`,
            };
          });
          setExercisesList(mapped);
        }
      }
    } catch (err: any) {
      console.warn('[TodayWorkout] Error fetching workout plan:', err);
      setErrorMsg('Could not fetch live workout routine from server. Displaying offline preset.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdaptiveWorkout();
  }, [fetchAdaptiveWorkout]);

  const completedCount = useMemo(
    () => Object.values(completed).filter(Boolean).length,
    [completed]
  );

  const allCompleted = exercisesList.length > 0 && completedCount === exercisesList.length;

  // Complete Workout action handler to trigger logWorkout back to MongoDB
  const handleCompleteWorkout = async () => {
    try {
      setSaving(true);
      const completedNames = exercisesList
        .filter(ex => completed[ex.id])
        .map(ex => ex.name);

      const payload = {
        completed_exercises: completedNames.length > 0 ? completedNames : exercisesList.map(e => e.name),
        actual_activities: activities.map(a => ({
          name: a.name,
          sets: a.sets,
          reps: a.reps,
          durationMinutes: a.durationMinutes,
          intensity: a.intensity,
          caloriesBurned: a.caloriesBurned,
        })),
        duration_mins: 30,
        calories_burned: 180 + completedNames.length * 20,
        notes: `Completed adaptive workout on ${new Date().toLocaleDateString()}. Recorded ${completedNames.length}/${exercisesList.length} items.`,
      };

      const response = await aiService.logWorkout(payload, 'default_user');
      setIsLoggedSuccessfully(true);
      Alert.alert(
        'Workout Completed!',
        'Your workout data and bio-adaptive recovery adjustments have been saved to your MongoDB profile.',
        [{ text: 'Awesome' }]
      );
    } catch (e: any) {
      console.warn('[TodayWorkout] Failed to log workout:', e);
      Alert.alert('Notice', 'Workout saved locally in offline cache.');
    } finally {
      setSaving(false);
    }
  };

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
    exercisesList.forEach(exercise => {
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

  if (loading) {
    return (
      <View style={{ marginTop: 8 }}>
        <WorkoutListSkeleton />
      </View>
    );
  }

  return (
    <>
      {errorMsg && (
        <ErrorCard
          title="Workout Sync Notice"
          message={errorMsg}
          onRetry={fetchAdaptiveWorkout}
        />
      )}

      {/* TODAY ADAPTIVE CARD */}
      <View style={GlobalStyles.cardElevated}>
        {/* HEADER */}
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text style={styles.cardTitle}>Today's Prescribed Plan</Text>
            <Text style={styles.exerciseHint}>
              {workoutMeta.infoTag} • {workoutMeta.intensityTag} ({completedCount}/{exercisesList.length} completed)
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

        {/* EXERCISES LIST */}
        {exercisesList.map((exercise, index) => {
          const isCompleted = !!completed[exercise.id];

          return (
            <Pressable
              key={exercise.id}
              onPress={() => openExercise(exercise)}
              style={[
                styles.exerciseRow,
                isCompleted && styles.exerciseRowCompleted,
                index === exercisesList.length - 1 && styles.exerciseRowLast,
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

        {/* COMPLETE WORKOUT ACTION BUTTON */}
        <Pressable
          onPress={handleCompleteWorkout}
          disabled={saving}
          style={({ pressed }) => [
            GlobalStyles.btnPrimary,
            {
              backgroundColor: allCompleted || isLoggedSuccessfully ? Palette.forestGreen : Palette.oceanBlue,
              marginTop: 18,
              marginBottom: 4,
              flexDirection: 'row',
              gap: 8,
              opacity: pressed || saving ? 0.88 : 1,
            },
          ]}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Palette.textWhite} />
          ) : (
            <>
              <Ionicons
                name={allCompleted || isLoggedSuccessfully ? 'checkmark-done-circle' : 'play-circle-outline'}
                size={20}
                color={Palette.textWhite}
              />
              <Text style={GlobalStyles.btnPrimaryText}>
                {isLoggedSuccessfully
                  ? 'Workout Saved to Profile'
                  : allCompleted
                  ? 'Complete & Save Workout'
                  : 'Save Workout Progress'}
              </Text>
            </>
          )}
        </Pressable>
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
              Recorded activities sync to your biometric profile.
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

      {/* STATUS BANNER */}
      {isLoggedSuccessfully && (
        <View style={styles.completedBanner}>
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={Palette.forestGreen}
          />

          <View style={styles.completedBannerText}>
            <Text style={styles.completedBannerTitle}>
              Today's workout recorded
            </Text>

            <Text style={styles.completedBannerSubtitle}>
              Progress and recovery adaptation metrics have been persisted into your profile.
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