import React, { useEffect, useState } from "react";

import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  GlobalStyles,
  Palette,
} from "@/constants/Styles";

import { styles } from "./styles";

import {
  DailyState,
} from "@/services/api";

import { useAzuka } from "@/contexts/AzukaContext";

// ============================================================
// TYPES
// ============================================================

type SymptomCategory =
  | "Pain"
  | "Energy"
  | "Digestive"
  | "Appetite"
  | "Mood"
  | "Physical";

type FlowRate =
  | "Spotting"
  | "Light"
  | "Medium"
  | "Heavy";

type SymptomOption = {
  id: string;
  name: string;
  category: SymptomCategory;
  icon: keyof typeof Ionicons.glyphMap;
};

// ============================================================
// SYMPTOMS
// ============================================================

const SYMPTOMS: SymptomOption[] = [
  // PAIN
  {
    id: "cramps",
    name: "Cramps",
    category: "Pain",
    icon: "flash-outline",
  },
  {
    id: "headache",
    name: "Headache",
    category: "Pain",
    icon: "headset-outline",
  },
  {
    id: "back-pain",
    name: "Lower back pain",
    category: "Pain",
    icon: "body-outline",
  },
  {
    id: "pelvic-pain",
    name: "Pelvic pain",
    category: "Pain",
    icon: "fitness-outline",
  },

  // ENERGY
  {
    id: "fatigue",
    name: "Fatigue",
    category: "Energy",
    icon: "battery-half-outline",
  },
  {
    id: "low-energy",
    name: "Low energy",
    category: "Energy",
    icon: "battery-dead-outline",
  },
  {
    id: "sleepy",
    name: "Sleepiness",
    category: "Energy",
    icon: "moon-outline",
  },

  // DIGESTIVE
  {
    id: "bloating",
    name: "Bloating",
    category: "Digestive",
    icon: "water-outline",
  },
  {
    id: "nausea",
    name: "Nausea",
    category: "Digestive",
    icon: "medical-outline",
  },
  {
    id: "constipation",
    name: "Constipation",
    category: "Digestive",
    icon: "remove-circle-outline",
  },
  {
    id: "diarrhea",
    name: "Diarrhea",
    category: "Digestive",
    icon: "water-outline",
  },

  // APPETITE
  {
    id: "cravings",
    name: "Food cravings",
    category: "Appetite",
    icon: "restaurant-outline",
  },
  {
    id: "increased-appetite",
    name: "Increased appetite",
    category: "Appetite",
    icon: "fast-food-outline",
  },
  {
    id: "low-appetite",
    name: "Low appetite",
    category: "Appetite",
    icon: "nutrition-outline",
  },

  // MOOD
  {
    id: "irritable",
    name: "Irritability",
    category: "Mood",
    icon: "alert-circle-outline",
  },
  {
    id: "anxious",
    name: "Feeling anxious",
    category: "Mood",
    icon: "pulse-outline",
  },
  {
    id: "low-mood",
    name: "Low mood",
    category: "Mood",
    icon: "cloud-outline",
  },
  {
    id: "mood-swings",
    name: "Mood swings",
    category: "Mood",
    icon: "swap-vertical-outline",
  },

  // PHYSICAL
  {
    id: "breast-tenderness",
    name: "Breast tenderness",
    category: "Physical",
    icon: "heart-outline",
  },
  {
    id: "soreness",
    name: "Muscle soreness",
    category: "Physical",
    icon: "barbell-outline",
  },
  {
    id: "dizziness",
    name: "Dizziness",
    category: "Physical",
    icon: "refresh-outline",
  },
  {
    id: "hot-flashes",
    name: "Feeling unusually warm",
    category: "Physical",
    icon: "sunny-outline",
  },
];

// ============================================================
// CATEGORIES
// ============================================================

const CATEGORIES: SymptomCategory[] = [
  "Pain",
  "Energy",
  "Digestive",
  "Appetite",
  "Mood",
  "Physical",
];

const CATEGORY_ICONS: Record<
  SymptomCategory,
  keyof typeof Ionicons.glyphMap
> = {
  Pain: "bandage-outline",
  Energy: "battery-half-outline",
  Digestive: "water-outline",
  Appetite: "restaurant-outline",
  Mood: "happy-outline",
  Physical: "body-outline",
};

// ============================================================
// HELPERS
// ============================================================

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Convert MongoDB/context symptom object
// into an array of symptom IDs for UI selection.
const getSelectedSymptomIds = (
  symptoms?: DailyState["symptoms"]
): string[] => {
  if (!symptoms) {
    return [];
  }

  return [
    ...(symptoms.pain ?? []),
    ...(symptoms.energy ?? []),
    ...(symptoms.digestive ?? []),
    ...(symptoms.appetite
      ? [symptoms.appetite]
      : []),
    ...(symptoms.mood ?? []),
    ...(symptoms.physical ?? []),
  ];
};

// ============================================================
// COMPONENT
// ============================================================

export default function SignalsSection() {
  // ==========================================================
  // AZUKA CONTEXT
  // ==========================================================

  const {
    dailyState,
    saveDailyCheckIn,
  } = useAzuka();

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [modalVisible, setModalVisible] =
    useState(false);

  const [activeCategory, setActiveCategory] =
    useState<SymptomCategory>("Pain");

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([]);

  const [flowRate, setFlowRate] =
    useState<FlowRate | undefined>(
      undefined
    );

  const [isPeriodActive, setIsPeriodActive] =
    useState(false);

  const [endedToday, setEndedToday] =
    useState(false);

  const [periodStartDate, setPeriodStartDate] =
    useState<string | undefined>(undefined);

  const [saving, setSaving] =
    useState(false);

  // ==========================================================
  // CONTEXT → UI
  //
  // Whenever dailyState changes, update the
  // temporary modal state from Context.
  // ==========================================================

  useEffect(() => {
    setSelectedSymptoms(
      getSelectedSymptomIds(
        dailyState?.symptoms
      )
    );

    setIsPeriodActive(
      dailyState?.period
        ?.is_period_active ?? false
    );

    setFlowRate(
      dailyState?.period
        ?.flow_rate as FlowRate | undefined
    );

    setEndedToday(
      dailyState?.period
        ?.ended_today ?? false
    );

    setPeriodStartDate(
      dailyState?.period?.start_date
    );
  }, [dailyState]);

  // ==========================================================
  // OPEN LOGGER
  // ==========================================================

  const openLogger = () => {
    // Re-read everything from Context
    // when opening the modal.

    setSelectedSymptoms(
      getSelectedSymptomIds(
        dailyState?.symptoms
      )
    );

    setIsPeriodActive(
      dailyState?.period
        ?.is_period_active ?? false
    );

    setFlowRate(
      dailyState?.period
        ?.flow_rate as FlowRate | undefined
    );

    setEndedToday(
      dailyState?.period
        ?.ended_today ?? false
    );

    setPeriodStartDate(
      dailyState?.period?.start_date
    );

    setModalVisible(true);
  };

  // ==========================================================
  // TOGGLE SYMPTOM
  // ==========================================================

  const toggleSymptom = (
    symptom: SymptomOption
  ) => {
    const alreadySelected =
      selectedSymptoms.includes(
        symptom.id
      );

    // Remove
    if (alreadySelected) {
      setSelectedSymptoms(
        selectedSymptoms.filter(
          (id) => id !== symptom.id
        )
      );

      return;
    }

    // Appetite is single-select.
    if (
      symptom.category === "Appetite"
    ) {
      const nonAppetite =
        selectedSymptoms.filter(
          (id) => {
            const option =
              SYMPTOMS.find(
                (item) =>
                  item.id === id
              );

            return (
              option?.category !==
              "Appetite"
            );
          }
        );

      setSelectedSymptoms([
        ...nonAppetite,
        symptom.id,
      ]);

      return;
    }

    // All other categories are multi-select.
    setSelectedSymptoms([
      ...selectedSymptoms,
      symptom.id,
    ]);
  };

  // ==========================================================
  // START PERIOD
  // ==========================================================

  const handleStartPeriod = () => {
    const today =
      getTodayDate();

    setIsPeriodActive(true);

    setEndedToday(false);

    setFlowRate(
      flowRate ?? "Medium"
    );

    setPeriodStartDate(today);
  };

  // ==========================================================
  // END PERIOD
  // ==========================================================

  const handleEndPeriod = () => {
    setIsPeriodActive(false);

    setEndedToday(true);

    setFlowRate(undefined);
  };

  // ==========================================================
  // BUILD SYMPTOMS OBJECT
  //
  // Converts UI IDs into the exact structure
  // used by DAILY_STATES.
  // ==========================================================

  const buildSymptomsObject =
    (): NonNullable<
      DailyState["symptoms"]
    > => {
      const result: NonNullable<
        DailyState["symptoms"]
      > = {};

      selectedSymptoms.forEach(
        (id) => {
          const symptom =
            SYMPTOMS.find(
              (item) =>
                item.id === id
            );

          if (!symptom) {
            return;
          }

          switch (
            symptom.category
          ) {
            case "Pain":
              result.pain = [
                ...(result.pain ?? []),
                id,
              ];
              break;

            case "Energy":
              result.energy = [
                ...(result.energy ?? []),
                id,
              ];
              break;

            case "Digestive":
              result.digestive = [
                ...(result.digestive ?? []),
                id,
              ];
              break;

            case "Appetite":
              result.appetite = id;
              break;

            case "Mood":
              result.mood = [
                ...(result.mood ?? []),
                id,
              ];
              break;

            case "Physical":
              result.physical = [
                ...(result.physical ?? []),
                id,
              ];
              break;
          }
        }
      );

      return result;
    };

  // ==========================================================
  // SAVE
  // ==========================================================

  const saveRecord = async () => {
    if (saving) {
      return;
    }

    try {
      setSaving(true);

      const symptoms =
        buildSymptomsObject();

      const today =
        getTodayDate();

      await saveDailyCheckIn(
        {
          symptoms,

          period: {
            is_period_active:
              isPeriodActive,

            flow_rate:
              isPeriodActive
                ? flowRate
                : undefined,

            started_today:
              periodStartDate ===
              today,

            ended_today:
              endedToday,

            start_date:
              periodStartDate,

            estimated_end_date:
              dailyState?.period
                ?.estimated_end_date,
          },
        },
        today
      );

      setModalVisible(false);
    } catch (error) {
      console.error(
        "Failed to save check-in:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // DERIVED DATA FROM CONTEXT
  // ==========================================================

  const hasLoggedData =
    selectedSymptoms.length > 0 ||
    isPeriodActive ||
    endedToday;

  const categorySymptoms =
    SYMPTOMS.filter(
      (symptom) =>
        symptom.category ===
        activeCategory
    );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ================================================== */}
      {/* MAIN DASHBOARD CARD */}
      {/* ================================================== */}

      <View
        style={[
          GlobalStyles.cardElevated,
          styles.sectionCard,
        ]}
      >
        <View
          style={styles.sectionHeader}
        >
          <View>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Today's body check-in
            </Text>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Track flow & symptoms
            </Text>
          </View>

          <View
            style={styles.loggerIcon}
          >
            <Ionicons
              name="body-outline"
              size={20}
              color={Palette.oceanBlue}
            />
          </View>
        </View>

        {!hasLoggedData ? (
          <View
            style={
              styles.loggerEmpty
            }
          >
            <View
              style={
                styles.loggerEmptyIcon
              }
            >
              <Ionicons
                name="leaf-outline"
                size={25}
                color={
                  Palette.forestGreen
                }
              />
            </View>

            <Text
              style={
                styles.loggerEmptyTitle
              }
            >
              No record logged
            </Text>

            <Text
              style={
                styles.loggerEmptyText
              }
            >
              Take a moment to check
              in with your body today.
            </Text>

            <TouchableOpacity
              style={
                styles.logButton
              }
              onPress={openLogger}
              activeOpacity={0.8}
            >
              <Ionicons
                name="add"
                size={17}
                color={
                  Palette.surfaceWhite
                }
              />

              <Text
                style={
                  styles.logButtonText
                }
              >
                Log today's check-in
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View
              style={
                styles.loggedSummary
              }
            >
              <View
                style={
                  styles.loggedSummaryLeft
                }
              >
                <View
                  style={
                    styles.loggedCheck
                  }
                >
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color={
                      Palette.forestGreen
                    }
                  />
                </View>

                <View>
                  <Text
                    style={
                      styles.loggedSummaryTitle
                    }
                  >
                    {isPeriodActive
                      ? "Period Active"
                      : endedToday
                      ? "Period Ended"
                      : ""}
                    {(isPeriodActive ||
                      endedToday) &&
                    selectedSymptoms.length >
                      0
                      ? " • "
                      : ""}
                    {selectedSymptoms.length >
                    0
                      ? `${selectedSymptoms.length} ${
                          selectedSymptoms.length ===
                          1
                            ? "symptom"
                            : "symptoms"
                        }`
                      : ""}
                  </Text>

                  <Text
                    style={
                      styles.loggedSummarySubtitle
                    }
                  >
                    Logged for today
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={openLogger}
                activeOpacity={0.7}
              >
                <Text
                  style={
                    styles.editText
                  }
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={
                styles.loggedSymptoms
              }
            >
              {isPeriodActive && (
                <View
                  style={[
                    styles.loggedChip,
                    {
                      borderColor:
                        Palette.crimson,
                    },
                  ]}
                >
                  <Ionicons
                    name="water"
                    size={12}
                    color={
                      Palette.crimson
                    }
                  />

                  <Text
                    style={[
                      styles.loggedChipText,
                      {
                        color:
                          Palette.crimson,
                      },
                    ]}
                  >
                    Flow:{" "}
                    {flowRate ??
                      "Logged"}
                  </Text>
                </View>
              )}

              {selectedSymptoms
                .slice(0, 3)
                .map((id) => {
                  const symptom =
                    SYMPTOMS.find(
                      (item) =>
                        item.id === id
                    );

                  if (!symptom) {
                    return null;
                  }

                  return (
                    <View
                      key={id}
                      style={
                        styles.loggedChip
                      }
                    >
                      <Ionicons
                        name={
                          symptom.icon
                        }
                        size={12}
                        color={
                          Palette.oceanBlue
                        }
                      />

                      <Text
                        style={
                          styles.loggedChipText
                        }
                      >
                        {symptom.name}
                      </Text>
                    </View>
                  );
                })}

              {selectedSymptoms.length >
                3 && (
                <View
                  style={
                    styles.moreChip
                  }
                >
                  <Text
                    style={
                      styles.moreChipText
                    }
                  >
                    +
                    {selectedSymptoms.length -
                      3}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={
                styles.viewRecordButton
              }
              onPress={openLogger}
              activeOpacity={0.75}
            >
              <Text
                style={
                  styles.viewRecordText
                }
              >
                View today's record
              </Text>

              <Ionicons
                name="chevron-forward"
                size={16}
                color={
                  Palette.oceanBlue
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ================================================== */}
      {/* CHECK-IN MODAL */}
      {/* ================================================== */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.symptomModal
            }
          >
            <View
              style={
                styles.sheetHandle
              }
            />

            {/* HEADER */}

            <View
              style={
                styles.sheetHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.sheetDate
                  }
                >
                  Daily Check-in
                </Text>

                <Text
                  style={
                    styles.sheetSubtitle
                  }
                >
                  Log flow and body
                  signals
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.closeButton
                }
                onPress={() =>
                  setModalVisible(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={
                    Palette.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >
              {/* ================================================== */}
              {/* MENSTRUAL FLOW */}
              {/* ================================================== */}

              <Text
                style={
                  styles.modalSectionTitle
                }
              >
                Menstrual Flow
              </Text>

              {!isPeriodActive ? (
                <TouchableOpacity
                  style={[
                    styles.symptomOption,
                    {
                      marginBottom: 16,
                    },
                  ]}
                  onPress={
                    handleStartPeriod
                  }
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="water-outline"
                    size={20}
                    color={
                      Palette.crimson
                    }
                  />

                  <Text
                    style={[
                      styles.symptomOptionText,
                      {
                        marginLeft: 10,
                        flex: 1,
                      },
                    ]}
                  >
                    Period started
                    today
                  </Text>

                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color={
                      Palette.crimson
                    }
                  />
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color:
                        Palette.textSecondary,
                      marginBottom: 8,
                    }}
                  >
                    Select today's
                    flow intensity:
                  </Text>

                  <View
                    style={{
                      flexDirection:
                        "row",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    {(
                      [
                        "Spotting",
                        "Light",
                        "Medium",
                        "Heavy",
                      ] as FlowRate[]
                    ).map((rate) => {
                      const active =
                        flowRate ===
                        rate;

                      return (
                        <TouchableOpacity
                          key={rate}
                          style={[
                            styles.severityChip,
                            {
                              flex: 1,
                              paddingVertical:
                                10,
                            },
                            active && {
                              backgroundColor:
                                "#FCEEEE",
                              borderColor:
                                Palette.crimson,
                            },
                          ]}
                          onPress={() =>
                            setFlowRate(
                              rate
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.severityText,
                              active && {
                                color:
                                  Palette.crimson,
                                fontWeight:
                                  "600",
                              },
                            ]}
                          >
                            {rate}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    style={{
                      flexDirection:
                        "row",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      paddingVertical: 8,
                    }}
                    onPress={
                      handleEndPeriod
                    }
                  >
                    <Ionicons
                      name="checkmark-done-outline"
                      size={16}
                      color={
                        Palette.textSecondary
                      }
                    />

                    <Text
                      style={{
                        fontSize: 13,
                        color:
                          Palette.textSecondary,
                        marginLeft: 6,
                      }}
                    >
                      Period ended
                      today
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ================================================== */}
              {/* SYMPTOMS */}
              {/* ================================================== */}

              <Text
                style={
                  styles.modalSectionTitle
                }
              >
                Symptoms & Signals
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                style={
                  styles.categoryScroll
                }
              >
                {CATEGORIES.map(
                  (category) => {
                    const active =
                      category ===
                      activeCategory;

                    return (
                      <TouchableOpacity
                        key={
                          category
                        }
                        style={[
                          styles.categoryChip,
                          active &&
                            styles.categoryChipActive,
                        ]}
                        onPress={() =>
                          setActiveCategory(
                            category
                          )
                        }
                      >
                        <Ionicons
                          name={
                            CATEGORY_ICONS[
                              category
                            ]
                          }
                          size={14}
                          color={
                            active
                              ? Palette.orange
                              : Palette.textSecondary
                          }
                        />

                        <Text
                          style={[
                            styles.categoryText,
                            active &&
                              styles.categoryTextActive,
                          ]}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </ScrollView>

              <View
                style={
                  styles.symptomOptionGrid
                }
              >
                {categorySymptoms.map(
                  (symptom) => {
                    const selected =
                      selectedSymptoms.includes(
                        symptom.id
                      );

                    return (
                      <TouchableOpacity
                        key={
                          symptom.id
                        }
                        style={[
                          styles.symptomOption,
                          selected &&
                            styles.symptomOptionSelected,
                        ]}
                        onPress={() =>
                          toggleSymptom(
                            symptom
                          )
                        }
                        activeOpacity={0.75}
                      >
                        <Ionicons
                          name={
                            symptom.icon
                          }
                          size={18}
                          color={
                            selected
                              ? Palette.crimson
                              : Palette.textSecondary
                          }
                        />

                        <Text
                          style={[
                            styles.symptomOptionText,
                            selected &&
                              styles.symptomOptionTextSelected,
                          ]}
                        >
                          {symptom.name}
                        </Text>

                        {selected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={
                              Palette.crimson
                            }
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>

              {activeCategory ===
                "Appetite" && (
                <Text
                  style={{
                    fontSize: 12,
                    color:
                      Palette.textSecondary,
                    marginTop: 4,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Select one appetite
                  signal
                </Text>
              )}

              {/* ================================================== */}
              {/* SAVE */}
              {/* ================================================== */}

              <TouchableOpacity
                style={[
                  styles.saveRecordButton,
                  (!hasLoggedData ||
                    saving) &&
                    styles.saveRecordButtonDisabled,
                ]}
                disabled={
                  !hasLoggedData ||
                  saving
                }
                onPress={
                  saveRecord
                }
                activeOpacity={0.8}
              >
                <Text
                  style={
                    styles.saveRecordText
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save Check-in"}
                </Text>

                <Ionicons
                  name="checkmark"
                  size={18}
                  color={
                    Palette.surfaceWhite
                  }
                />
              </TouchableOpacity>

              <View
                style={
                  styles.modalBottomSpace
                }
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}