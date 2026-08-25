import React, { useState } from 'react';

import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles, Palette } from '@/constants/Styles';

import {
  FlowRate,
  LoggedSymptom,
  SymptomCategory,
} from './types';

import { styles } from './styles';

type Props = {
  symptoms?: LoggedSymptom[];

  activePeriod?: {
    isPeriodActive: boolean;
    currentFlow?: FlowRate;
    startDate?: string;
  };

  onRecordSave?: (data: {
    symptoms: LoggedSymptom[];

    period: {
      isPeriodActive: boolean;
      flowRate?: FlowRate;
      endedToday?: boolean;
      startDate?: string;
      estimatedEndDate?: string;
    };
  }) => void;
};

type SymptomOption = {
  id: string;
  name: string;
  category: SymptomCategory;
  icon: keyof typeof Ionicons.glyphMap;
};

const MOCK_PERIOD_DURATION_DAYS = 5;

const FLOW_OPTIONS: FlowRate[] = [
  'Spotting',
  'Light',
  'Medium',
  'Heavy',
];

const SYMPTOMS: SymptomOption[] = [
  /* PAIN */
  {
    id: 'cramps',
    name: 'Cramps',
    category: 'Pain',
    icon: 'flash-outline',
  },
  {
    id: 'headache',
    name: 'Headache',
    category: 'Pain',
    icon: 'headset-outline',
  },
  {
    id: 'back-pain',
    name: 'Lower back pain',
    category: 'Pain',
    icon: 'body-outline',
  },
  {
    id: 'pelvic-pain',
    name: 'Pelvic pain',
    category: 'Pain',
    icon: 'fitness-outline',
  },

  /* ENERGY */
  {
    id: 'fatigue',
    name: 'Fatigue',
    category: 'Energy',
    icon: 'battery-half-outline',
  },
  {
    id: 'low-energy',
    name: 'Low energy',
    category: 'Energy',
    icon: 'battery-dead-outline',
  },
  {
    id: 'sleepy',
    name: 'Sleepiness',
    category: 'Energy',
    icon: 'moon-outline',
  },

  /* DIGESTIVE */
  {
    id: 'bloating',
    name: 'Bloating',
    category: 'Digestive',
    icon: 'water-outline',
  },
  {
    id: 'nausea',
    name: 'Nausea',
    category: 'Digestive',
    icon: 'medical-outline',
  },
  {
    id: 'constipation',
    name: 'Constipation',
    category: 'Digestive',
    icon: 'remove-circle-outline',
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    category: 'Digestive',
    icon: 'water-outline',
  },

  /* APPETITE */
  {
    id: 'cravings',
    name: 'Food cravings',
    category: 'Appetite',
    icon: 'restaurant-outline',
  },
  {
    id: 'increased-appetite',
    name: 'Increased appetite',
    category: 'Appetite',
    icon: 'fast-food-outline',
  },
  {
    id: 'low-appetite',
    name: 'Low appetite',
    category: 'Appetite',
    icon: 'nutrition-outline',
  },

  /* MOOD */
  {
    id: 'irritable',
    name: 'Irritability',
    category: 'Mood',
    icon: 'alert-circle-outline',
  },
  {
    id: 'anxious',
    name: 'Feeling anxious',
    category: 'Mood',
    icon: 'pulse-outline',
  },
  {
    id: 'low-mood',
    name: 'Low mood',
    category: 'Mood',
    icon: 'cloud-outline',
  },
  {
    id: 'mood-swings',
    name: 'Mood swings',
    category: 'Mood',
    icon: 'swap-vertical-outline',
  },

  /* PHYSICAL */
  {
    id: 'breast-tenderness',
    name: 'Breast tenderness',
    category: 'Physical',
    icon: 'heart-outline',
  },
  {
    id: 'soreness',
    name: 'Muscle soreness',
    category: 'Physical',
    icon: 'barbell-outline',
  },
  {
    id: 'dizziness',
    name: 'Dizziness',
    category: 'Physical',
    icon: 'refresh-outline',
  },
  {
    id: 'hot-flashes',
    name: 'Feeling unusually warm',
    category: 'Physical',
    icon: 'sunny-outline',
  },
];

const CATEGORIES: SymptomCategory[] = [
  'Pain',
  'Energy',
  'Digestive',
  'Appetite',
  'Mood',
  'Physical',
];

const CATEGORY_ICONS: Record<
  SymptomCategory,
  keyof typeof Ionicons.glyphMap
> = {
  Pain: 'bandage-outline',
  Energy: 'battery-half-outline',
  Digestive: 'water-outline',
  Appetite: 'restaurant-outline',
  Mood: 'happy-outline',
  Physical: 'body-outline',
  Other: 'help-circle-outline',
};

/**
 * Makes sure only ONE Appetite symptom can exist.
 *
 * All other symptoms remain untouched.
 */
const normalizeSymptoms = (
  symptoms: LoggedSymptom[]
): LoggedSymptom[] => {
  const nonAppetiteSymptoms = symptoms.filter(
    symptom => symptom.category !== 'Appetite'
  );

  const appetiteSymptoms = symptoms.filter(
    symptom => symptom.category === 'Appetite'
  );

  // Keep only the first Appetite option if old data
  // happens to contain multiple appetite symptoms.
  const selectedAppetite = appetiteSymptoms[0];

  return selectedAppetite
    ? [...nonAppetiteSymptoms, selectedAppetite]
    : nonAppetiteSymptoms;
};

export default function SignalsSection({
  symptoms = [],
  activePeriod = { isPeriodActive: false },
  onRecordSave,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<LoggedSymptom[]>(
      normalizeSymptoms(symptoms)
    );

  // --------------------------------------------------
  // PERIOD TRACKING STATE
  // --------------------------------------------------

  const [periodStartDate, setPeriodStartDate] =
    useState<Date | null>(
      activePeriod.startDate
        ? new Date(activePeriod.startDate)
        : null
    );

  const [isPeriodActive, setIsPeriodActive] =
    useState(activePeriod.isPeriodActive);

  const [flowRate, setFlowRate] =
    useState<FlowRate | undefined>(
      activePeriod.currentFlow ?? 'Medium'
    );

  const [endedToday, setEndedToday] = useState(false);

  // --------------------------------------------------
  // MODAL CATEGORY & SYMPTOM DETAIL STATES
  // --------------------------------------------------

  const [activeCategory, setActiveCategory] =
    useState<SymptomCategory>('Pain');

  const [editingSymptom, setEditingSymptom] =
    useState<LoggedSymptom | null>(null);

  const [detail, setDetail] = useState('');

  // --------------------------------------------------
  // OPEN LOGGER
  // --------------------------------------------------

  const openLogger = () => {
    // Normalize existing symptoms here too.
    // This protects against old data containing
    // multiple Appetite selections.
    setSelectedSymptoms(
      normalizeSymptoms(symptoms)
    );

    setIsPeriodActive(
      activePeriod.isPeriodActive
    );

    setFlowRate(
      activePeriod.currentFlow ?? 'Medium'
    );

    setPeriodStartDate(
      activePeriod.startDate
        ? new Date(activePeriod.startDate)
        : null
    );

    setEndedToday(false);

    setModalVisible(true);
  };

  // --------------------------------------------------
  // TOGGLE SYMPTOM
  // --------------------------------------------------

  const toggleSymptom = (symptom: SymptomOption) => {
  const existing = selectedSymptoms.find(
    item => item.id === symptom.id
  );

  // ----------------------------------------------
  // IF ALREADY SELECTED -> DESELECT IT
  // ----------------------------------------------
  if (existing) {
    setSelectedSymptoms(
      selectedSymptoms.filter(
        item => item.id !== symptom.id
      )
    );
    
    // Clear editing state if this was the one being edited
    if (editingSymptom?.id === symptom.id) {
      setEditingSymptom(null);
      setDetail('');
    }
    return;
  }

  // ----------------------------------------------
  // CREATE NEW SYMPTOM
  // ----------------------------------------------
  const newSymptom: LoggedSymptom = {
    id: symptom.id,
    name: symptom.name,
    category: symptom.category,
  };

  // ----------------------------------------------
  // APPETITE = SINGLE SELECT
  // ----------------------------------------------
  if (symptom.category === 'Appetite') {
    setSelectedSymptoms([
      ...selectedSymptoms.filter(
        item => item.category !== 'Appetite'
      ),
      newSymptom,
    ]);
    return;
  }

  // ----------------------------------------------
  // EVERYTHING ELSE = MULTI SELECT
  // ----------------------------------------------
  setSelectedSymptoms([
    ...selectedSymptoms,
    newSymptom,
  ]);
};

  // --------------------------------------------------
  // SAVE SYMPTOM DETAIL
  // --------------------------------------------------

  const saveSymptomDetail = () => {
    if (!editingSymptom) return;

    const updated = selectedSymptoms.map(
      symptom =>
        symptom.id === editingSymptom.id
          ? {
              ...symptom,
              detail:
                detail.trim() || undefined,
            }
          : symptom
    );

    setSelectedSymptoms(updated);

    setEditingSymptom(null);
    setDetail('');
  };

  // --------------------------------------------------
  // REMOVE SYMPTOM
  // --------------------------------------------------

  const removeSymptom = (id: string) => {
    setSelectedSymptoms(
      selectedSymptoms.filter(
        symptom => symptom.id !== id
      )
    );

    setEditingSymptom(null);
  };

  // --------------------------------------------------
  // START PERIOD
  // --------------------------------------------------

  const handleStartPeriod = () => {
    const today = new Date();

    setPeriodStartDate(today);
    setIsPeriodActive(true);
    setEndedToday(false);

    if (!flowRate) {
      setFlowRate('Medium');
    }
  };

  // --------------------------------------------------
  // END PERIOD
  // --------------------------------------------------

  const handleEndPeriod = () => {
    setIsPeriodActive(false);
    setEndedToday(true);
    setFlowRate(undefined);
    setPeriodStartDate(null);
  };

  // --------------------------------------------------
  // SAVE RECORD
  // --------------------------------------------------

  const saveRecord = () => {
    const estimatedEnd = periodStartDate
      ? new Date(
          periodStartDate.getTime() +
            (MOCK_PERIOD_DURATION_DAYS - 1) *
              86400000
        )
      : undefined;

    onRecordSave?.({
      symptoms: selectedSymptoms,

      period: {
        isPeriodActive,
        flowRate: isPeriodActive
          ? flowRate
          : undefined,
        endedToday,
        startDate: periodStartDate
          ? periodStartDate.toISOString()
          : undefined,
        estimatedEndDate: estimatedEnd
          ? estimatedEnd.toISOString()
          : undefined,
      },
    });

    setModalVisible(false);
  };

  // --------------------------------------------------
  // CURRENT CATEGORY SYMPTOMS
  // --------------------------------------------------

  const categorySymptoms = SYMPTOMS.filter(
    symptom =>
      symptom.category === activeCategory
  );

  // --------------------------------------------------
  // HAS LOGGED DATA
  // --------------------------------------------------

  const hasLoggedData =
    selectedSymptoms.length > 0 ||
    isPeriodActive ||
    endedToday;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <>
      {/* ==================================================
          MAIN DASHBOARD CARD
          ================================================== */}

      <View
        style={[
          GlobalStyles.cardElevated,
          styles.sectionCard,
        ]}
      >
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Today's body check-in
            </Text>

            <Text style={styles.sectionSubtitle}>
              Track flow & symptoms
            </Text>
          </View>

          <View style={styles.loggerIcon}>
            <Ionicons
              name="body-outline"
              size={20}
              color={Palette.oceanBlue}
            />
          </View>
        </View>

        {!hasLoggedData ? (
          <View style={styles.loggerEmpty}>
            <View style={styles.loggerEmptyIcon}>
              <Ionicons
                name="leaf-outline"
                size={25}
                color={Palette.forestGreen}
              />
            </View>

            <Text style={styles.loggerEmptyTitle}>
              No record logged
            </Text>

            <Text style={styles.loggerEmptyText}>
              Take a moment to check in with your body
              today.
            </Text>

            <TouchableOpacity
              style={styles.logButton}
              onPress={openLogger}
              activeOpacity={0.8}
            >
              <Ionicons
                name="add"
                size={17}
                color={Palette.surfaceWhite}
              />

              <Text style={styles.logButtonText}>
                Log today's check-in
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.loggedSummary}>
              <View style={styles.loggedSummaryLeft}>
                <View style={styles.loggedCheck}>
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color={Palette.forestGreen}
                  />
                </View>

                <View>
                  <Text
                    style={
                      styles.loggedSummaryTitle
                    }
                  >
                    {isPeriodActive
                      ? 'Period Active'
                      : endedToday
                      ? 'Period Ended'
                      : ''}

                    {(isPeriodActive ||
                      endedToday) &&
                    selectedSymptoms.length > 0
                      ? ' • '
                      : ''}

                    {selectedSymptoms.length > 0
                      ? `${selectedSymptoms.length} ${
                          selectedSymptoms.length === 1
                            ? 'symptom'
                            : 'symptoms'
                        }`
                      : ''}
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
                <Text style={styles.editText}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            {/* SYMPTOM & FLOW CHIPS */}

            <View style={styles.loggedSymptoms}>
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
                    color={Palette.crimson}
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
                    Flow: {flowRate ?? 'Logged'}
                  </Text>
                </View>
              )}

              {selectedSymptoms
                .slice(0, 3)
                .map(symptom => (
                  <View
                    key={symptom.id}
                    style={styles.loggedChip}
                  >
                    <Ionicons
                      name={
                        SYMPTOMS.find(
                          option =>
                            option.id ===
                            symptom.id
                        )?.icon ??
                        'ellipse-outline'
                      }
                      size={12}
                      color={Palette.oceanBlue}
                    />

                    <Text
                      style={
                        styles.loggedChipText
                      }
                    >
                      {symptom.name}
                    </Text>
                  </View>
                ))}

              {selectedSymptoms.length > 3 && (
                <View style={styles.moreChip}>
                  <Text
                    style={
                      styles.moreChipText
                    }
                  >
                    +{selectedSymptoms.length - 3}
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
                color={Palette.oceanBlue}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ==================================================
          DAILY CHECK-IN MODAL
          ================================================== */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.symptomModal}>
            <View style={styles.sheetHandle} />

            {/* HEADER */}

            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetDate}>
                  Daily Check-in
                </Text>

                <Text
                  style={styles.sheetSubtitle}
                >
                  Log flow and body signals
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() =>
                  setModalVisible(false)
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
              {/* ==================================================
                  MENSTRUAL FLOW
                  ================================================== */}

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
                    color={Palette.crimson}
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
                    Period started today
                  </Text>

                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color={Palette.crimson}
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
                    Select today's flow
                    intensity:
                  </Text>

                  {/* FLOW SELECTION */}

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    {FLOW_OPTIONS.map(
                      rate => {
                        const active =
                          flowRate === rate;

                        return (
                          <TouchableOpacity
                            key={rate}
                            style={[
                              styles.severityChip,
                              {
                                flex: 1,
                                paddingVertical: 10,
                              },
                              active && {
                                backgroundColor:
                                  '#FCEEEE',
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
                                    '600',
                                },
                              ]}
                            >
                              {rate}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>

                  {/* END PERIOD */}

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
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
                      Period ended today
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ==================================================
                  SYMPTOM CATEGORIES
                  ================================================== */}

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
                  category => {
                    const active =
                      category ===
                      activeCategory;

                    return (
                      <TouchableOpacity
                        key={category}
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

              {/* ==================================================
                  SYMPTOM OPTIONS
                  ================================================== */}

              <View
                style={
                  styles.symptomOptionGrid
                }
              >
                {categorySymptoms.map(
                  symptom => {
                    const selected =
                      selectedSymptoms.some(
                        item =>
                          item.id ===
                          symptom.id
                      );

                    return (
                      <TouchableOpacity
                        key={symptom.id}
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

              {/* ==================================================
                  APPETITE HELPER TEXT
                  ================================================== */}

              {activeCategory ===
                'Appetite' && (
                <Text
                  style={{
                    fontSize: 12,
                    color:
                      Palette.textSecondary,
                    marginTop: 4,
                    marginBottom: 8,
                    textAlign: 'center',
                  }}
                >
                  Select one appetite
                  signal
                </Text>
              )}

              {/* ==================================================
                  SAVE BUTTON
                  ================================================== */}

              <TouchableOpacity
                style={[
                  styles.saveRecordButton,
                  !hasLoggedData &&
                    styles.saveRecordButtonDisabled,
                ]}
                disabled={!hasLoggedData}
                onPress={saveRecord}
                activeOpacity={0.8}
              >
                <Text
                  style={
                    styles.saveRecordText
                  }
                >
                  Save Check-in
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

      {/* ==================================================
          SEVERITY ADJUSTMENT MODAL
          ================================================== */}

      {/* 
        Your original file has this section commented/empty.
        The editing state is still preserved above so you can
        add the detail modal here if needed.
      */}
    </>
  );
}