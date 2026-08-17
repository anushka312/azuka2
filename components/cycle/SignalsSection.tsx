import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  GlobalStyles,
  Palette,
} from '@/constants/Styles';

import {
  LoggedSymptom,
  SymptomCategory,
  SymptomSeverity,
} from './types';

import { styles } from './styles';

type Props = {
  symptoms?: LoggedSymptom[];

  onSymptomsChange?: (
    symptoms: LoggedSymptom[],
  ) => void;
};

type SymptomOption = {
  id: string;
  name: string;
  category: SymptomCategory;
  icon: keyof typeof Ionicons.glyphMap;
};

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
};

export default function SignalsSection({
  symptoms = [],
  onSymptomsChange,
}: Props) {

  const [modalVisible, setModalVisible] =
    useState(false);

  const [
    selectedSymptoms,
    setSelectedSymptoms,
  ] = useState<LoggedSymptom[]>(symptoms);

  const [activeCategory, setActiveCategory] =
    useState<SymptomCategory>('Pain');

  const [editingSymptom, setEditingSymptom] =
    useState<LoggedSymptom | null>(null);

  const [severity, setSeverity] =
    useState<SymptomSeverity>('Moderate');

  const [detail, setDetail] =
    useState('');

  /* =========================
     OPEN LOGGER
  ========================== */

  const openLogger = () => {
    setSelectedSymptoms(symptoms);
    setModalVisible(true);
  };

  /* =========================
     TOGGLE SYMPTOM
  ========================== */

  const toggleSymptom = (
    symptom: SymptomOption,
  ) => {

    const existing =
      selectedSymptoms.find(
        item => item.id === symptom.id,
      );

    /*
     * If already selected,
     * open its detail editor.
     */
    if (existing) {
      setEditingSymptom(existing);
      setSeverity(existing.severity);
      setDetail(
        existing.detail ?? '',
      );

      return;
    }

    /*
     * Otherwise add it.
     */
    const newSymptom: LoggedSymptom = {
      id: symptom.id,
      name: symptom.name,
      category: symptom.category,
      severity: 'Moderate',
    };

    setSelectedSymptoms([
      ...selectedSymptoms,
      newSymptom,
    ]);
  };

  /* =========================
     SAVE SYMPTOM DETAIL
  ========================== */

  const saveSymptomDetail = () => {

    if (!editingSymptom) {
      return;
    }

    const updated =
      selectedSymptoms.map(
        symptom =>
          symptom.id === editingSymptom.id
            ? {
                ...symptom,
                severity,
                detail:
                  detail.trim() ||
                  undefined,
              }
            : symptom,
      );

    setSelectedSymptoms(updated);

    setEditingSymptom(null);
    setDetail('');
  };

  /* =========================
     REMOVE SYMPTOM
  ========================== */

  const removeSymptom = (
    id: string,
  ) => {

    setSelectedSymptoms(
      selectedSymptoms.filter(
        symptom =>
          symptom.id !== id,
      ),
    );

    setEditingSymptom(null);
  };

  /* =========================
     SAVE RECORD
  ========================== */

  const saveRecord = () => {

    onSymptomsChange?.(
      selectedSymptoms,
    );

    setModalVisible(false);
  };

  const categorySymptoms =
    SYMPTOMS.filter(
      symptom =>
        symptom.category ===
        activeCategory,
    );

  return (
    <>
      {/* =========================
          MAIN CARD
      ========================== */}

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
              style={styles.sectionTitle}
            >
              Today's body check-in
            </Text>

            <Text
              style={styles.sectionSubtitle}
            >
              Track what you're experiencing
            </Text>
          </View>

          <View
            style={styles.loggerIcon}
          >
            <Ionicons
              name="body-outline"
              size={20}
              color={
                Palette.oceanBlue
              }
            />
          </View>

        </View>


        {/* =========================
            EMPTY STATE
        ========================== */}

        {selectedSymptoms.length === 0 ? (

          <View
            style={styles.loggerEmpty}
          >

            <View
              style={styles.loggerEmptyIcon}
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
              style={styles.loggerEmptyTitle}
            >
              No symptoms logged
            </Text>

            <Text
              style={styles.loggerEmptyText}
            >
              Take a moment to check in
              with your body today.
            </Text>

            <TouchableOpacity
              style={styles.logButton}
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
                style={styles.logButtonText}
              >
                Log a new record
              </Text>
            </TouchableOpacity>

          </View>

        ) : (

          /* =========================
             LOGGED STATE
          ========================== */

          <View>

            <View
              style={styles.loggedSummary}
            >

              <View
                style={styles.loggedSummaryLeft}
              >

                <View
                  style={styles.loggedCheck}
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
                    {selectedSymptoms.length}{' '}
                    {selectedSymptoms.length === 1
                      ? 'symptom'
                      : 'symptoms'}{' '}
                    logged
                  </Text>

                  <Text
                    style={
                      styles.loggedSummarySubtitle
                    }
                  >
                    Today's body check-in
                  </Text>
                </View>

              </View>

              <TouchableOpacity
                onPress={openLogger}
                activeOpacity={0.7}
              >
                <Text
                  style={styles.editText}
                >
                  Edit
                </Text>
              </TouchableOpacity>

            </View>


            {/* QUICK SUMMARY */}

            <View
              style={styles.loggedSymptoms}
            >

              {selectedSymptoms
                .slice(0, 4)
                .map(symptom => (
                  <View
                    key={symptom.id}
                    style={styles.loggedChip}
                  >

                    <View
                      style={[
                        styles.loggedChipDot,
                        {
                          backgroundColor:
                            symptom.severity ===
                            'Severe'
                              ? Palette.crimson
                              : symptom.severity ===
                                'Moderate'
                              ? Palette.orange
                              : Palette.forestGreen,
                        },
                      ]}
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

              {selectedSymptoms.length > 4 && (
                <View
                  style={styles.moreChip}
                >
                  <Text
                    style={
                      styles.moreChipText
                    }
                  >
                    +{selectedSymptoms.length - 4}
                  </Text>
                </View>
              )}

            </View>


            <TouchableOpacity
              style={styles.viewRecordButton}
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


      {/* =========================
          LOGGER MODAL
      ========================== */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setModalVisible(false)
        }
      >

        <View
          style={styles.modalOverlay}
        >

          <View
            style={styles.symptomModal}
          >

            {/* HANDLE */}

            <View
              style={styles.sheetHandle}
            />


            {/* HEADER */}

            <View
              style={styles.sheetHeader}
            >

              <View>
                <Text
                  style={styles.sheetDate}
                >
                  Today's check-in
                </Text>

                <Text
                  style={styles.sheetSubtitle}
                >
                  Tell Azuka what your body is
                  experiencing
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

              {/* =====================
                  CURRENT RECORD
              ====================== */}

              {selectedSymptoms.length >
                0 && (

                <View
                  style={styles.currentRecord}
                >

                  <Text
                    style={
                      styles.currentRecordTitle
                    }
                  >
                    Today's record
                  </Text>

                  {selectedSymptoms.map(
                    symptom => (
                      <TouchableOpacity
                        key={symptom.id}
                        style={
                          styles.recordRow
                        }
                        onPress={() =>
                          toggleSymptom({
                            id: symptom.id,
                            name:
                              symptom.name,
                            category:
                              symptom.category,
                            icon:
                              CATEGORY_ICONS[
                                symptom.category
                              ],
                          })
                        }
                      >

                        <View
                          style={
                            styles.recordIcon
                          }
                        >
                          <Ionicons
                            name={
                              CATEGORY_ICONS[
                                symptom.category
                              ]
                            }
                            size={16}
                            color={
                              Palette.oceanBlue
                            }
                          />
                        </View>

                        <View
                          style={
                            styles.recordContent
                          }
                        >

                          <Text
                            style={
                              styles.recordName
                            }
                          >
                            {symptom.name}
                          </Text>

                          <Text
                            style={
                              styles.recordMeta
                            }
                          >
                            {symptom.severity}
                            {symptom.detail
                              ? ` • ${symptom.detail}`
                              : ''}
                          </Text>

                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={15}
                          color={
                            Palette.textSubtle
                          }
                        />

                      </TouchableOpacity>
                    ),
                  )}

                </View>
              )}


              {/* =====================
                  CATEGORY TABS
              ====================== */}

              <Text
                style={
                  styles.modalSectionTitle
                }
              >
                What are you experiencing?
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
                            category,
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
                  },
                )}

              </ScrollView>


              {/* =====================
                  SYMPTOM OPTIONS
              ====================== */}

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
                          symptom.id,
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
                            symptom,
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
                  },
                )}

              </View>


              {/* =====================
                  SAVE
              ====================== */}

              <TouchableOpacity
                style={[
                  styles.saveRecordButton,

                  selectedSymptoms.length ===
                    0 &&
                    styles.saveRecordButtonDisabled,
                ]}
                disabled={
                  selectedSymptoms.length ===
                  0
                }
                onPress={saveRecord}
                activeOpacity={0.8}
              >

                <Text
                  style={
                    styles.saveRecordText
                  }
                >
                  Save today's record
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
                style={styles.modalBottomSpace}
              />

            </ScrollView>

          </View>

        </View>

      </Modal>


      {/* =========================
          SYMPTOM DETAIL MODAL
      ========================== */}

      <Modal
        visible={
          editingSymptom !== null
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setEditingSymptom(null)
        }
      >

        <View
          style={styles.detailModalOverlay}
        >

          <View
            style={styles.detailModal}
          >

            <Text
              style={styles.detailTitle}
            >
              {editingSymptom?.name}
            </Text>

            <Text
              style={styles.detailSubtitle}
            >
              How noticeable is it today?
            </Text>


            {/* SEVERITY */}

            <View
              style={styles.severityRow}
            >

              {(
                [
                  'Mild',
                  'Moderate',
                  'Severe',
                ] as SymptomSeverity[]
              ).map(level => {

                const active =
                  severity === level;

                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.severityChip,

                      active && {
                        backgroundColor:
                          level === 'Severe'
                            ? '#FCEEEE'
                            : level ===
                              'Moderate'
                            ? '#FFF5E8'
                            : '#EEF7F1',

                        borderColor:
                          level === 'Severe'
                            ? Palette.crimson
                            : level ===
                              'Moderate'
                            ? Palette.orange
                            : Palette.forestGreen,
                      },
                    ]}
                    onPress={() =>
                      setSeverity(level)
                    }
                  >

                    <Text
                      style={[
                        styles.severityText,

                        active && {
                          color:
                            level === 'Severe'
                              ? Palette.crimson
                              : level ===
                                'Moderate'
                              ? Palette.orange
                              : Palette.forestGreen,
                        },
                      ]}
                    >
                      {level}
                    </Text>

                  </TouchableOpacity>
                );
              })}

            </View>


            {/* DELETE */}

            <TouchableOpacity
              style={
                styles.removeSymptomButton
              }
              onPress={() =>
                editingSymptom &&
                removeSymptom(
                  editingSymptom.id,
                )
              }
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color={
                  Palette.crimson
                }
              />

              <Text
                style={
                  styles.removeSymptomText
                }
              >
                Remove symptom
              </Text>
            </TouchableOpacity>


            {/* SAVE */}

            <TouchableOpacity
              style={
                styles.detailSaveButton
              }
              onPress={
                saveSymptomDetail
              }
            >
              <Text
                style={
                  styles.detailSaveText
                }
              >
                Done
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>
    </>
  );
}