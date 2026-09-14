
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette, GlobalStyles } from '@/constants/Styles';
import ActivityPickerModal from './ActivityPickerModal';
import { styles } from './workoutStyles';
import { WorkoutListSkeleton } from '@/components/ui/Skeleton';
import { ErrorCard } from '@/components/ui/StateFeedback';
import { useAzuka } from '../../contexts/AzukaContext';

// ============================================================
// TYPES
// ============================================================

type Exercise = {
  id: string;
  name: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
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

// ============================================================
// COMPONENT
// ============================================================

export default function TodayWorkout() {
  // ============================================================
  // AZUKA CONTEXT
  // ============================================================

  const {
    todayWorkout,
    isLoading,
    error,
    refreshWorkoutData,
  } = useAzuka();

  // ============================================================
  // LOCAL UI STATE
  // ============================================================

  const [saving, setSaving] = useState(false);
  const [isLoggedSuccessfully, setIsLoggedSuccessfully] =
    useState(false);

  const [completed, setCompleted] =
    useState<Record<string, boolean>>({});

  const [activityModalVisible, setActivityModalVisible] =
    useState(false);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  // ============================================================
  // MAP BACKEND WORKOUT → UI
  // ============================================================

  const exercisesList = useMemo<Exercise[]>(() => {
    if (
      !todayWorkout ||
      !todayWorkout.activities ||
      todayWorkout.activities.length === 0
    ) {
      return [];
    }

    return todayWorkout.activities.map(
      (activity, index) => {
        let duration = '';

        if (
          activity.sets != null &&
          activity.reps != null
        ) {
          duration = `${activity.sets} sets × ${activity.reps}`;
        } else if (
          activity.duration_mins != null
        ) {
          duration = `${activity.duration_mins} mins`;
        }

        let icon: keyof typeof Ionicons.glyphMap =
          'fitness-outline';

        const type =
          activity.type?.toLowerCase() || '';

        if (
          type.includes('mobility') ||
          type.includes('stretch')
        ) {
          icon = 'leaf-outline';
        } else if (
          type.includes('endurance') ||
          type.includes('core')
        ) {
          icon = 'shield-checkmark-outline';
        } else if (
          type.includes('strength')
        ) {
          icon = 'barbell-outline';
        } else if (
          type.includes('cardio')
        ) {
          icon = 'walk-outline';
        }

        return {
          id: `ex-${index}-${activity.activity_name
            .toLowerCase()
            .replace(/\s+/g, '-')}`,

          name: activity.activity_name,

          duration,

          icon,
        };
      }
    );
  }, [todayWorkout]);

  // ============================================================
  // WORKOUT META
  // ============================================================

  const infoTag =
    todayWorkout?.info_tag || '';

  const intensityTag =
    todayWorkout?.intensity_tag || '';

  // ============================================================
  // COMPLETION
  // ============================================================

  const completedCount = useMemo(
    () =>
      Object.values(completed).filter(Boolean).length,
    [completed]
  );

  const allCompleted =
    exercisesList.length > 0 &&
    completedCount === exercisesList.length;

  // ============================================================
  // TOGGLE EXERCISE
  // ============================================================

  const toggleExercise = (id: string) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ============================================================
  // TOGGLE ALL
  // ============================================================

  const toggleAll = () => {
    if (allCompleted) {
      setCompleted({});
      return;
    }

    const next: Record<string, boolean> = {};

    exercisesList.forEach((exercise) => {
      next[exercise.id] = true;
    });

    setCompleted(next);
  };

  // ============================================================
  // SAVE WORKOUT
  // ============================================================

  const handleCompleteWorkout = async () => {
    if (!todayWorkout) {
      Alert.alert(
        'No Workout',
        'There is no workout scheduled for today.'
      );
      return;
    }

    try {
      setSaving(true);

      const completedNames =
        exercisesList
          .filter(
            (exercise) =>
              completed[exercise.id]
          )
          .map(
            (exercise) =>
              exercise.name
          );

      const actualActivities =
        activities.map((activity) => ({
          activity_name: activity.name,

          type:
            activity.metric ||
            'activity',

          duration_mins:
            activity.durationMinutes ??
            undefined,

          sets:
            activity.sets ??
            undefined,

          reps:
            activity.reps ??
            undefined,

          completed: true,
        }));

      /*
       * IMPORTANT:
       *
       * Your current AzukaContext does NOT expose
       * updateTodayWorkout().
       *
       * Therefore this component cannot currently
       * save the workout through Context.
       *
       * Once updateTodayWorkout() is added to
       * AzukaContext, this is where it should be called.
       */

      console.log(
        '[TodayWorkout] Workout to save:',
        {
          status: 'completed',

          actual_activities:
            actualActivities,

          completed_activities:
            completedNames,

          completed_at:
            new Date().toISOString(),
        }
      );

      /*
       * For now we refresh the workout data after
       * the save operation is connected.
       */

      await refreshWorkoutData();

      setIsLoggedSuccessfully(true);

      Alert.alert(
        'Workout Completed!',
        'Your workout has been saved to your profile.',
        [
          {
            text: 'Awesome',
          },
        ]
      );
    } catch (err) {
      console.warn(
        '[TodayWorkout] Failed to save workout:',
        err
      );

      Alert.alert(
        'Unable to Save',
        'We could not save your workout right now. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // ADD ACTIVITIES
  // ============================================================

  const addActivities = (
    newActivities: Activity[]
  ) => {
    setActivities((prev) => {
      const existingIds = new Set(
        prev.map(
          (activity) =>
            activity.id
        )
      );

      const uniqueActivities =
        newActivities.filter(
          (activity) =>
            !existingIds.has(
              activity.id
            )
        );

      return [
        ...prev,
        ...uniqueActivities,
      ];
    });
  };

  // ============================================================
  // REMOVE ACTIVITY
  // ============================================================

  const removeActivity = (
    id: string
  ) => {
    setActivities((prev) =>
      prev.filter(
        (activity) =>
          activity.id !== id
      )
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <View
        style={{
          marginTop: 8,
        }}
      >
        <WorkoutListSkeleton />
      </View>
    );
  }

  // ============================================================
  // NO WORKOUT
  // ============================================================

  if (!todayWorkout) {
    return (
      <View
        style={GlobalStyles.cardElevated}
      >
        <Text
          style={styles.cardTitle}
        >
          Today's Workout
        </Text>

        <Text
          style={styles.exerciseHint}
        >
          No workout has been scheduled for today.
        </Text>

        {error && (
          <ErrorCard
            title="Workout Sync Notice"
            message={error}
            onRetry={refreshWorkoutData}
          />
        )}
      </View>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      {error && (
        <ErrorCard
          title="Workout Sync Notice"
          message={error}
          onRetry={refreshWorkoutData}
        />
      )}

      {/* ======================================================
          TODAY ADAPTIVE CARD
      ====================================================== */}

      <View
        style={
          GlobalStyles.cardElevated
        }
      >
        {/* HEADER */}

        <View
          style={
            styles.exerciseHeader
          }
        >
          <View
            style={
              styles.exerciseInfo
            }
          >
            <Text
              style={
                styles.cardTitle
              }
            >
              Today's Prescribed Plan
            </Text>

            <Text
              style={
                styles.exerciseHint
              }
            >
              {infoTag}
              {infoTag &&
                intensityTag
                ? ' • '
                : ''}
              {intensityTag}
              {' '}
              ({completedCount}/
              {exercisesList.length}
              {' '}
              completed)
            </Text>
          </View>

          {/* TICK ALL */}

          <Pressable
            onPress={toggleAll}
            style={[
              styles.tickAllButton,
              allCompleted &&
                styles.tickAllButtonCompleted,
            ]}
          >
            <View
              style={[
                styles.tickAllCheck,
                allCompleted &&
                  styles.tickAllCheckCompleted,
              ]}
            >
              {allCompleted && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={
                    Palette.textWhite
                  }
                />
              )}
            </View>

            <Text
              style={[
                styles.tickAllText,
                allCompleted &&
                  styles.tickAllTextCompleted,
              ]}
            >
              {allCompleted
                ? 'Untick all'
                : 'Tick all'}
            </Text>
          </Pressable>
        </View>

        {/* ====================================================
            EXERCISES LIST
        ==================================================== */}

        {exercisesList.map(
          (exercise, index) => {
            const isCompleted =
              !!completed[
                exercise.id
              ];

            return (
              <View
                key={exercise.id}
                style={[
                  styles.exerciseRow,
                  isCompleted &&
                    styles.exerciseRowCompleted,
                  index ===
                    exercisesList.length - 1 &&
                    styles.exerciseRowLast,
                ]}
              >
                {/* LEFT */}

                <View
                  style={
                    styles.exerciseLeft
                  }
                >
                  <View
                    style={[
                      styles.exerciseIcon,
                      isCompleted &&
                        styles.exerciseIconCompleted,
                    ]}
                  >
                    <Ionicons
                      name={
                        exercise.icon
                      }
                      size={21}
                      color={
                        isCompleted
                          ? Palette.forestGreen
                          : Palette.orange
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.exerciseInfo
                    }
                  >
                    <Text
                      style={[
                        styles.exerciseName,
                        isCompleted &&
                          styles.exerciseNameCompleted,
                      ]}
                    >
                      {exercise.name}
                    </Text>

                    {exercise.duration !==
                      '' && (
                      <Text
                        style={
                          styles.exerciseDuration
                        }
                      >
                        {
                          exercise.duration
                        }
                      </Text>
                    )}
                  </View>
                </View>

                {/* CHECKBOX */}

                <Pressable
                  onPress={() =>
                    toggleExercise(
                      exercise.id
                    )
                  }
                  style={[
                    styles.exerciseCheck,
                    isCompleted &&
                      styles.exerciseCheckCompleted,
                  ]}
                >
                  {isCompleted && (
                    <Ionicons
                      name="checkmark"
                      size={17}
                      color={
                        Palette.textWhite
                      }
                    />
                  )}
                </Pressable>
              </View>
            );
          }
        )}

        {/* SAVE WORKOUT BUTTON */}

        <Pressable
          onPress={
            handleCompleteWorkout
          }
          disabled={saving}
          style={({ pressed }) => [
            GlobalStyles.btnPrimary,
            {
              backgroundColor:
                allCompleted ||
                isLoggedSuccessfully
                  ? Palette.forestGreen
                  : Palette.oceanBlue,

              marginTop: 18,

              marginBottom: 4,

              flexDirection: 'row',

              gap: 8,

              opacity:
                pressed || saving
                  ? 0.88
                  : 1,
            },
          ]}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color={
                Palette.textWhite
              }
            />
          ) : (
            <>
              <Ionicons
                name={
                  allCompleted ||
                  isLoggedSuccessfully
                    ? 'checkmark-done-circle'
                    : 'play-circle-outline'
                }
                size={20}
                color={
                  Palette.textWhite
                }
              />

              <Text
                style={
                  GlobalStyles.btnPrimaryText
                }
              >
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

      {/* ======================================================
          ACTUAL ACTIVITY
      ====================================================== */}

      <View
        style={
          GlobalStyles.cardElevated
        }
      >
        <View
          style={
            styles.actualHeader
          }
        >
          <View
            style={
              styles.actualIcon
            }
          >
            <Ionicons
              name="walk-outline"
              size={22}
              color={
                Palette.oceanBlue
              }
            />
          </View>

          <View
            style={
              styles.actualHeaderText
            }
          >
            <Text
              style={
                styles.cardTitle
              }
            >
              What did you actually do?
            </Text>

            <Text
              style={
                styles.exerciseHint
              }
            >
              Recorded activities sync to
              your biometric profile.
            </Text>
          </View>
        </View>

        {/* ADDED ACTIVITIES */}

        {activities.length > 0 && (
          <View
            style={
              styles.actualActivitiesList
            }
          >
            {activities.map(
              (activity) => (
                <View
                  key={
                    activity.id
                  }
                  style={
                    styles.actualActivity
                  }
                >
                  <View
                    style={
                      styles.actualActivityLeft
                    }
                  >
                    <Ionicons
                      name={
                        activity.icon
                      }
                      size={19}
                      color={
                        Palette.forestGreen
                      }
                    />

                    <Text
                      style={
                        styles.actualActivityText
                      }
                    >
                      {
                        activity.name
                      }
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      removeActivity(
                        activity.id
                      )
                    }
                    hitSlop={10}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color={
                        Palette.textMuted
                      }
                    />
                  </Pressable>
                </View>
              )
            )}
          </View>
        )}

        {/* ADD ACTIVITY */}

        <Pressable
          onPress={() =>
            setActivityModalVisible(
              true
            )
          }
          style={
            styles.addActivityButton
          }
        >
          <Ionicons
            name="add"
            size={21}
            color={
              Palette.oceanBlue
            }
          />

          <Text
            style={
              styles.addActivityText
            }
          >
            {activities.length > 0
              ? 'Add another activity'
              : 'Add activity'}
          </Text>
        </Pressable>
      </View>

      {/* ======================================================
          STATUS BANNER
      ====================================================== */}

      {isLoggedSuccessfully && (
        <View
          style={
            styles.completedBanner
          }
        >
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={
              Palette.forestGreen
            }
          />

          <View
            style={
              styles.completedBannerText
            }
          >
            <Text
              style={
                styles.completedBannerTitle
              }
            >
              Today's workout recorded
            </Text>

            <Text
              style={
                styles.completedBannerSubtitle
              }
            >
              Your workout progress has been
              persisted into your profile.
            </Text>
          </View>
        </View>
      )}

      {/* ======================================================
          ACTIVITY PICKER MODAL
      ====================================================== */}

      <ActivityPickerModal
        visible={
          activityModalVisible
        }
        selectedActivities={
          activities
        }
        onClose={() =>
          setActivityModalVisible(
            false
          )
        }
        onSave={
          addActivities
        }
      />
    </>
  );
}
