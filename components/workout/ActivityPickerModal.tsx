import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/Styles';
import { Activity } from './TodayWorkout';
import { styles } from './workoutStyles';

type Props = {
  visible: boolean;
  selectedActivities: Activity[];
  onClose: () => void;
  onSave: (activities: Activity[]) => void;
};

type Intensity = 'Easy' | 'Moderate' | 'Hard';

type ActivityMetric = 'duration' | 'sets';

type ActivityOption = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  metric: ActivityMetric;
  caloriesPerMinute: number;
};

const activityOptions: ActivityOption[] = [
  {
    id: 'walking',
    name: 'Walking',
    icon: 'walk-outline',
    metric: 'duration',
    caloriesPerMinute: 4,
  },
  {
    id: 'yoga',
    name: 'Yoga',
    icon: 'body-outline',
    metric: 'duration',
    caloriesPerMinute: 3,
  },
  {
    id: 'stretching',
    name: 'Stretching',
    icon: 'accessibility-outline',
    metric: 'duration',
    caloriesPerMinute: 2.5,
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: 'bicycle-outline',
    metric: 'duration',
    caloriesPerMinute: 7,
  },
  {
    id: 'running',
    name: 'Running',
    icon: 'speedometer-outline',
    metric: 'duration',
    caloriesPerMinute: 10,
  },
  {
    id: 'strength',
    name: 'Strength training',
    icon: 'barbell-outline',
    metric: 'sets',
    caloriesPerMinute: 7,
  },
  {
    id: 'pilates',
    name: 'Pilates',
    icon: 'fitness-outline',
    metric: 'duration',
    caloriesPerMinute: 4,
  },
  {
    id: 'swimming',
    name: 'Swimming',
    icon: 'water-outline',
    metric: 'duration',
    caloriesPerMinute: 8,
  },
  {
    id: 'dance',
    name: 'Dance',
    icon: 'musical-notes-outline',
    metric: 'duration',
    caloriesPerMinute: 7,
  },
  {
    id: 'meditation',
    name: 'Meditation',
    icon: 'leaf-outline',
    metric: 'duration',
    caloriesPerMinute: 1.5,
  },
];

const INTENSITY_MULTIPLIER: Record<Intensity, number> = {
  Easy: 0.8,
  Moderate: 1,
  Hard: 1.25,
};

const DEFAULT_DURATION = 30;
const DEFAULT_SETS = 3;
const DEFAULT_REPS = 10;
const DEFAULT_INTENSITY: Intensity = 'Moderate';

// Reps below this are treated as heavy/near-maximal effort (higher intensity),
// reps above this are treated as lighter, endurance-style work (lower intensity).
const HARD_REPS_THRESHOLD = 5;
const MODERATE_REPS_THRESHOLD = 12;
// A high set count on top of a given rep range is treated as extra fatigue,
// which bumps the derived intensity up one notch.
const HIGH_SET_COUNT = 5;

export default function ActivityPickerModal({
  visible,
  selectedActivities,
  onClose,
  onSave,
}: Props) {
  const [selected, setSelected] = useState<Activity[]>([]);
  const [customActivity, setCustomActivity] = useState('');

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(600)).current;

  // Tracks whether the modal was already open on the previous render, so the
  // "load activities from props" effect only runs on the closed -> open
  // transition instead of every time the `selectedActivities` prop changes.
  const wasVisible = useRef(false);

  // --------------------------------------------------
  // OPEN MODAL
  // --------------------------------------------------

  useEffect(() => {
    if (!visible) {
      wasVisible.current = false;
      return;
    }

    // Only reseed local state when the modal is actually being opened.
    // Previously this effect also re-ran whenever `selectedActivities`
    // changed identity (e.g. because the parent re-rendered for an
    // unrelated reason while the sheet was already open), which wiped out
    // whatever the user had just typed into duration/sets/reps fields.
    if (wasVisible.current) {
      return;
    }

    wasVisible.current = true;

    setSelected(
      selectedActivities.map(activity => ({
        ...activity,
      }))
    );

    setCustomActivity('');

    backdropOpacity.setValue(0);
    sheetY.setValue(600);

    Animated.timing(backdropOpacity, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(sheetY, {
        toValue: 0,
        damping: 22,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: true,
      }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // --------------------------------------------------
  // FIND ACTIVITY
  // --------------------------------------------------

  const getActivityOption = (id: string): ActivityOption | undefined => {
    return activityOptions.find(activity => activity.id === id);
  };

  // --------------------------------------------------
  // CHECK IF SELECTED
  // --------------------------------------------------

  const isSelected = (id: string) => {
    return selected.some(activity => activity.id === id);
  };

  // --------------------------------------------------
  // DERIVE INTENSITY FROM SETS + REPS
  // --------------------------------------------------
  // Lower rep ranges generally mean a heavier load (higher intensity),
  // higher rep ranges mean a lighter, more endurance-focused load (lower
  // intensity). A high number of sets on top of that is treated as extra
  // fatigue and bumps the result up one notch.

  const deriveIntensityFromSets = (
    sets: number,
    reps: number
  ): Intensity => {
    let intensity: Intensity;

    if (reps <= HARD_REPS_THRESHOLD) {
      intensity = 'Hard';
    } else if (reps <= MODERATE_REPS_THRESHOLD) {
      intensity = 'Moderate';
    } else {
      intensity = 'Easy';
    }

    if (sets >= HIGH_SET_COUNT) {
      if (intensity === 'Easy') intensity = 'Moderate';
      else if (intensity === 'Moderate') intensity = 'Hard';
    }

    return intensity;
  };

  // --------------------------------------------------
  // CALCULATE ESTIMATED CALORIES
  // --------------------------------------------------

  const calculateCalories = (
    activity: Activity,
    intensity: Intensity = DEFAULT_INTENSITY
  ) => {
    const option = getActivityOption(activity.id);

    if (!option) {
      return activity.caloriesBurned ?? 0;
    }

    const multiplier = INTENSITY_MULTIPLIER[intensity];

    if (option.metric === 'duration') {
      const duration = activity.durationMinutes ?? DEFAULT_DURATION;

      return Math.round(
        duration *
          option.caloriesPerMinute *
          multiplier
      );
    }

    const sets = activity.sets ?? DEFAULT_SETS;
    const estimatedMinutes = sets * 3;

    return Math.round(
      estimatedMinutes *
        option.caloriesPerMinute *
        multiplier
    );
  };

  // --------------------------------------------------
  // CREATE ACTIVITY WITH DEFAULT VALUES
  // --------------------------------------------------

  const createActivity = (
    option: ActivityOption
  ): Activity => {
    if (option.metric === 'sets') {
      const activity: Activity = {
        id: option.id,
        name: option.name,
        icon: option.icon,
        metric: 'sets',
        sets: DEFAULT_SETS,
        reps: DEFAULT_REPS,
        intensity: deriveIntensityFromSets(
          DEFAULT_SETS,
          DEFAULT_REPS
        ),
      };

      return {
        ...activity,
        caloriesBurned: calculateCalories(activity, activity.intensity),
      };
    }

    const activity: Activity = {
      id: option.id,
      name: option.name,
      icon: option.icon,
      metric: 'duration',
      durationMinutes: DEFAULT_DURATION,
      intensity: DEFAULT_INTENSITY,
    };

    return {
      ...activity,
      caloriesBurned: calculateCalories(activity),
    };
  };

  // --------------------------------------------------
  // SELECT / DESELECT ACTIVITY
  // --------------------------------------------------

  const toggleActivity = (
    option: ActivityOption
  ) => {
    setSelected(prev => {
      const alreadySelected = prev.some(
        activity => activity.id === option.id
      );

      if (alreadySelected) {
        return prev.filter(
          activity => activity.id !== option.id
        );
      }

      return [
        ...prev,
        createActivity(option),
      ];
    });
  };

  // --------------------------------------------------
  // UPDATE ACTIVITY
  // --------------------------------------------------

  const updateActivity = (
    id: string,
    updates: Partial<Activity>
  ) => {
    setSelected(prev =>
      prev.map(activity => {
        if (activity.id !== id) {
          return activity;
        }

        const updated: Activity = {
          ...activity,
          ...updates,
        };

        return {
          ...updated,
          caloriesBurned: calculateCalories(
            updated,
            updated.intensity ??
              DEFAULT_INTENSITY
          ),
        };
      })
    );
  };

  // --------------------------------------------------
  // UPDATE DURATION
  // --------------------------------------------------

  const updateDuration = (activity: Activity, value: string) => {
  // Remove non-numeric characters
  const cleaned = value.replace(/\D/g, '');

  // Convert to number or set to undefined if empty
  const number = cleaned === '' ? undefined : Number(cleaned);

  updateActivity(activity.id, {
    durationMinutes: number,
  });

  };

  // --------------------------------------------------
  // UPDATE SETS
  // --------------------------------------------------

  const updateSets = (
    activity: Activity,
    value: string
  ) => {
    const cleaned = value.replace(
      /[^0-9]/g,
      ''
    );

    const number = cleaned === '' ? undefined : parseInt(cleaned, 10);
    const reps = activity.reps ?? DEFAULT_REPS;

    updateActivity(activity.id, {
      sets: number,
      // Re-derive intensity any time sets changes, using the freshest
      // sets value together with whatever reps is currently set.
      intensity:
        number !== undefined
          ? deriveIntensityFromSets(number, reps)
          : activity.intensity,
    });
  };

  // --------------------------------------------------
  // UPDATE REPS
  // --------------------------------------------------

  const updateReps = (
    activity: Activity,
    value: string
  ) => {
    const cleaned = value.replace(
      /[^0-9]/g,
      ''
    );

    const number = cleaned === '' ? undefined : parseInt(cleaned, 10);
    const sets = activity.sets ?? DEFAULT_SETS;

    updateActivity(activity.id, {
      reps: number,
      // Re-derive intensity any time reps changes, using the freshest
      // reps value together with whatever sets is currently set.
      intensity:
        number !== undefined
          ? deriveIntensityFromSets(sets, number)
          : activity.intensity,
    });
  };

  // --------------------------------------------------
  // UPDATE INTENSITY
  // --------------------------------------------------

  const updateIntensity = (
    activity: Activity,
    intensity: Intensity
  ) => {
    updateActivity(activity.id, {
      intensity,
    });
  };

  // --------------------------------------------------
  // REMOVE ACTIVITY
  // --------------------------------------------------

  const removeActivity = (id: string) => {
    setSelected(prev =>
      prev.filter(
        activity => activity.id !== id
      )
    );
  };

  // --------------------------------------------------
  // ADD CUSTOM ACTIVITY
  // --------------------------------------------------

  const addCustomActivity = () => {
    const name = customActivity.trim();

    if (!name) return;

    const custom: Activity = {
      id: `custom-${Date.now()}`,
      name,
      icon: 'create-outline',
      metric: 'duration',
      durationMinutes: DEFAULT_DURATION,
      intensity: DEFAULT_INTENSITY,
      caloriesBurned: 0,
    };

    setSelected(prev => [
      ...prev,
      custom,
    ]);

    setCustomActivity('');
  };

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  const handleSave = () => {
    const finalized = selected.map(item => {
      if (item.metric === 'sets') {
        return {
          ...item,
          sets: item.sets ?? DEFAULT_SETS,
          reps: item.reps ?? DEFAULT_REPS,
        };
      }

      return {
        ...item,
        durationMinutes: item.durationMinutes ?? DEFAULT_DURATION,
      };
    });
    onSave(finalized);
    onClose();
  };

  // --------------------------------------------------
  // RENDER DETAILS
  // --------------------------------------------------

  const renderActivityDetails = (
    activity: Activity
  ) => {
    const option = getActivityOption(
      activity.id
    );

    const metric: ActivityMetric =
      activity.metric ??
      option?.metric ??
      'duration';

    const intensity =
      activity.intensity ??
      DEFAULT_INTENSITY;

    const calories =
      activity.caloriesBurned ??
      calculateCalories(
        activity,
        intensity
      );

    return (
      <View style={styles.activityDetails}>
        {/* ------------------------------------------
            DURATION
        ------------------------------------------ */}

        {metric === 'duration' && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Duration
            </Text>

            <View
              style={
                styles.numberInputWrapper
              }
            >
              <TextInput
                value={
                  activity.durationMinutes !== undefined
                    ? String(activity.durationMinutes)
                    : ''
                }
                onChangeText={value =>
                  updateDuration(
                    activity,
                    value
                  )
                }
                keyboardType="number-pad"
                style={
                  [styles.numberInput, {color: Palette.textPrimary}]
                }
                maxLength={3}
                selectTextOnFocus
              />

              <Text
                style={styles.inputSuffix}
              >
                min
              </Text>
            </View>
          </View>
        )}

        {/* ------------------------------------------
            SETS + REPS
        ------------------------------------------ */}

        {metric === 'sets' && (
          <View style={styles.setsRow}>
            <View
              style={styles.setInputGroup}
            >
              <Text
                style={styles.detailLabel}
              >
                Sets
              </Text>

              <View
                style={
                  styles.numberInputWrapper
                }
              >
                <TextInput
                  value={
                    activity.sets !== undefined
                      ? String(activity.sets)
                      : ''
                  }
                  onChangeText={value =>
                    updateSets(
                      activity,
                      value
                    )
                  }
                  keyboardType="number-pad"
                  style={
                    styles.numberInput
                  }
                  maxLength={2}
                  selectTextOnFocus
                />
              </View>
            </View>

            <View
              style={styles.setInputGroup}
            >
              <Text
                style={styles.detailLabel}
              >
                Reps
              </Text>

              <View
                style={
                  styles.numberInputWrapper
                }
              >
                <TextInput
                  value={
                    activity.reps !== undefined
                      ? String(activity.reps)
                      : ''
                  }
                  onChangeText={value =>
                    updateReps(
                      activity,
                      value
                    )
                  }
                  keyboardType="number-pad"
                  style={
                    styles.numberInput
                  }
                  maxLength={3}
                  selectTextOnFocus
                />
              </View>
            </View>
          </View>
        )}

        {/* ------------------------------------------
            INTENSITY
        ------------------------------------------ */}

        <View
          style={styles.intensitySection}
        >
          <Text style={styles.detailLabel}>
            {metric === 'sets'
              ? 'Intensity (auto)'
              : 'Intensity'}
          </Text>

          <View
            style={styles.intensityRow}
          >
            {(
              [
                'Easy',
                'Moderate',
                'Hard',
              ] as Intensity[]
            ).map(level => {
              const active =
                intensity === level;

              return (
                <Pressable
                  key={level}
                  onPress={() =>
                    updateIntensity(
                      activity,
                      level
                    )
                  }
                  style={[
                    styles.intensityButton,
                    active &&
                      styles.intensityButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.intensityText,
                      active &&
                        styles.intensityTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ------------------------------------------
            CALORIES
        ------------------------------------------ */}

        <View
          style={styles.caloriesRow}
        >
          <View
            style={styles.caloriesIcon}
          >
            <Ionicons
              name="flame-outline"
              size={16}
              color={Palette.orange}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={
                styles.caloriesLabel
              }
            >
              Estimated calories
            </Text>

            <Text
              style={
                styles.caloriesSubtext
              }
            >
              Approximate based on activity
              and intensity
            </Text>
          </View>

          <Text
            style={
              styles.caloriesValue
            }
          >
            ~{calories} kcal
          </Text>
        </View>
      </View>
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* BACKDROP */}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.modalOverlay,
            {
              opacity:
                backdropOpacity,
            },
          ]}
        />

        {/* TAP OUTSIDE TO CLOSE */}

        <Pressable
          style={styles.modalTouchArea}
          onPress={onClose}
        />

        {/* BOTTOM SHEET */}

        <Animated.View
          style={[
            styles.activityModal,
            {
              transform: [
                {
                  translateY: sheetY,
                },
              ],
            },
          ]}
        >
          {/* HANDLE */}

          <View
            style={styles.modalHandle}
          />

          {/* HEADER */}

          <View
            style={styles.modalHeader}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={styles.modalTitle}
              >
                Add activities
              </Text>

              <Text
                style={
                  styles.modalSubtitle
                }
              >
                Log what you did and how much.
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={
                styles.closeButton
              }
            >
              <Ionicons
                name="close"
                size={21}
                color={
                  Palette.textSecondary
                }
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: 20,
            }}
          >
            {/* ==========================================
                ACTIVITY SELECTION
            ========================================== */}

            <View
              style={
                styles.activityGrid
              }
            >
              {activityOptions.map(
                option => {
                  const active =
                    isSelected(
                      option.id
                    );

                  return (
                    <Pressable
                      key={option.id}
                      onPress={() =>
                        toggleActivity(
                          option
                        )
                      }
                      style={[
                        styles.activityOption,
                        active &&
                          styles.activityOptionSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.activityIcon,
                          active &&
                            styles.activityIconSelected,
                        ]}
                      >
                        <Ionicons
                          name={
                            option.icon
                          }
                          size={20}
                          color={
                            active
                              ? Palette.forestGreen
                              : Palette.textSecondary
                          }
                        />
                      </View>

                      <Text
                        style={[
                          styles.activityName,
                          active &&
                            styles.activityNameSelected,
                        ]}
                      >
                        {option.name}
                      </Text>

                      {active && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={
                            Palette.forestGreen
                          }
                        />
                      )}
                    </Pressable>
                  );
                }
              )}
            </View>

            {/* ==========================================
                SELECTED ACTIVITY DETAILS
            ========================================== */}

            {selected.length > 0 && (
              <View
                style={
                  styles.selectedDetailsSection
                }
              >
                <Text
                  style={
                    styles.modalSectionTitle
                  }
                >
                  Activity details
                </Text>

                {selected.map(
                  activity => (
                    <View
                      key={activity.id}
                      style={
                        styles.activityDetailCard
                      }
                    >
                      {/* CARD HEADER */}

                      <View
                        style={
                          styles.activityDetailHeader
                        }
                      >
                        <View
                          style={
                            styles.activityDetailTitleRow
                          }
                        >
                          <View
                            style={
                              styles.smallActivityIcon
                            }
                          >
                            <Ionicons
                              name={
                                activity.icon
                              }
                              size={17}
                              color={
                                Palette.forestGreen
                              }
                            />
                          </View>

                          <Text
                            style={
                              styles.activityDetailName
                            }
                          >
                            {activity.name}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() =>
                            removeActivity(
                              activity.id
                            )
                          }
                          hitSlop={8}
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

                      {/* ACTIVITY DETAILS */}

                      {renderActivityDetails(
                        activity
                      )}
                    </View>
                  )
                )}
              </View>
            )}

            {/* ==========================================
                CUSTOM ACTIVITY
            ========================================== */}

            <View
              style={
                styles.customActivity
              }
            >
              <Text
                style={
                  styles.modalSectionTitle
                }
              >
                Did something else?
              </Text>

              <TextInput
                value={
                  customActivity
                }
                onChangeText={
                  setCustomActivity
                }
                placeholder="e.g. 30 min badminton"
                placeholderTextColor={
                  Palette.textSubtle
                }
                style={
                  styles.customInput
                }
                multiline
              />

              <Pressable
                onPress={
                  addCustomActivity
                }
                disabled={
                  !customActivity.trim()
                }
                style={[
                  styles.addCustomButton,
                  !customActivity.trim() &&
                    styles.addCustomButtonDisabled,
                ]}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color={
                    customActivity.trim()
                      ? Palette.forestGreen
                      : Palette.textMuted
                  }
                />

                <Text
                  style={[
                    styles.addCustomText,
                    !customActivity.trim() &&
                      styles.addCustomTextDisabled,
                  ]}
                >
                  Add custom activity
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* ==========================================
              ACTION BUTTONS
          ========================================== */}

          <View
            style={
              styles.customActions
            }
          >
            <Pressable
              onPress={onClose}
              style={
                styles.cancelButton
              }
            >
              <Text
                style={
                  styles.cancelText
                }
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={
                styles.saveActivityButton
              }
            >
              <Text
                style={
                  styles.saveActivityText
                }
              >
                Save
                {selected.length > 0
                  ? ` (${selected.length})`
                  : ''}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}