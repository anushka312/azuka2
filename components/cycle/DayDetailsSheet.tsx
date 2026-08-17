import React, {
  useEffect,
  useRef,
} from 'react';

import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  Palette,
} from '@/constants/Styles';

import {
  DayInfo,
} from './types';

import {
  styles,
} from './styles';

type Props = {
  visible: boolean;
  selectedDate: string | null;
  selectedInfo?: DayInfo;
  onClose: () => void;
};

const getPhaseColor = (
  phase?: string
) => {
  if (!phase) {
    return Palette.oceanBlue;
  }

  if (phase.includes('Menstrual')) {
    return Palette.crimson;
  }

  if (phase.includes('Follicular')) {
    return Palette.forestGreen;
  }

  if (phase.includes('Ovulation')) {
    return Palette.skyBlue;
  }

  return Palette.orange;
};

const getPhaseBackground = (
  phase?: string
) => {
  if (!phase) {
    return Palette.cream;
  }

  if (phase.includes('Menstrual')) {
    return Palette.surfaceCrimsonMuted;
  }

  if (phase.includes('Follicular')) {
    return Palette.surfaceGreenMuted;
  }

  if (phase.includes('Ovulation')) {
    return Palette.surfaceBlueMuted;
  }

  return Palette.surfaceOrangeMuted;
};

export default function DayDetailsSheet({
  visible,
  selectedDate,
  selectedInfo,
  onClose,
}: Props) {

  const slideAnim =
    useRef(
      new Animated.Value(400)
    ).current;

  const fadeAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {

    if (visible) {

      Animated.parallel([
        Animated.spring(
          slideAnim,
          {
            toValue: 0,
            damping: 22,
            stiffness: 180,
            mass: 0.8,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }
        ),
      ]).start();

    } else {

      Animated.parallel([
        Animated.timing(
          slideAnim,
          {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          fadeAnim,
          {
            toValue: 0,
            duration: 160,
            useNativeDriver: true,
          }
        ),
      ]).start();

    }

  }, [
    visible,
    slideAnim,
    fadeAnim,
  ]);

  const formattedDate =
    selectedDate
      ? new Date(
          `${selectedDate}T12:00:00`
        ).toLocaleDateString(
          'en-US',
          {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }
        )
      : '';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >

      <View
        style={styles.modalOverlay}
      >

        {/* BACKDROP */}

        <Animated.View
          style={[
            styles.modalBackdrop,
            {
              opacity:
                fadeAnim,
            },
          ]}
        >
          <Pressable
            style={styles.backdropPress}
            onPress={onClose}
          />
        </Animated.View>


        {/* SHEET */}

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [
                {
                  translateY:
                    slideAnim,
                },
              ],
            },
          ]}
        >

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
                {formattedDate}
              </Text>

              <Text
                style={styles.sheetSubtitle}
              >
                Daily cycle information
              </Text>

            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={21}
                color={
                  Palette.textSecondary
                }
              />
            </TouchableOpacity>

          </View>


          {selectedInfo ? (

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={{
                paddingBottom: 30,
              }}
            >

              {/* PHASE */}

              <View
                style={[
                  styles.infoCard,
                  {
                    backgroundColor:
                      getPhaseBackground(
                        selectedInfo.phase
                      ),
                  },
                ]}
              >

                <View
                  style={
                    styles.infoCardIcon
                  }
                >
                  <Ionicons
                    name="calendar-outline"
                    size={21}
                    color={
                      getPhaseColor(
                        selectedInfo.phase
                      )
                    }
                  />
                </View>

                <View>

                  <Text
                    style={styles.infoLabel}
                  >
                    Cycle phase
                  </Text>

                  <Text
                    style={[
                      styles.infoValue,
                      {
                        color:
                          getPhaseColor(
                            selectedInfo.phase
                          ),
                      },
                    ]}
                  >
                    {selectedInfo.phase}
                  </Text>

                </View>

              </View>


              {/* SIGNALS */}

              <Text
                style={
                  styles.sheetSectionTitle
                }
              >
                Body signals
              </Text>

              <View
                style={styles.sheetGrid}
              >

                <InfoTile
                  label="Energy"
                  value={
                    selectedInfo.energy
                  }
                />

                <InfoTile
                  label="Stress"
                  value={
                    selectedInfo.stress
                  }
                />

                <InfoTile
                  label="HRV"
                  value={
                    selectedInfo.hrv
                  }
                />

                <InfoTile
                  label="Sleep"
                  value={
                    selectedInfo.sleep
                  }
                />

              </View>


              {/* SYMPTOMS */}

              <Text
                style={
                  styles.sheetSectionTitle
                }
              >
                Symptoms
              </Text>

              {selectedInfo.symptoms.length >
              0 ? (

                <View
                  style={
                    styles.symptomRow
                  }
                >

                  {selectedInfo.symptoms.map(
                    symptom => (
                      <View
                        key={symptom}
                        style={
                          styles.symptomChip
                        }
                      >
                        <Text
                          style={
                            styles.symptomText
                          }
                        >
                          {symptom}
                        </Text>
                      </View>
                    )
                  )}

                </View>

              ) : (

                <Text
                  style={
                    styles.noDataText
                  }
                >
                  No symptoms recorded
                </Text>

              )}


              {/* RECOVERY */}

              <Text
                style={
                  styles.sheetSectionTitle
                }
              >
                Recovery
              </Text>

              <View
                style={
                  styles.recoverySummary
                }
              >

                <View>

                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    Cortisol risk
                  </Text>

                  <Text
                    style={
                      styles.infoValue
                    }
                  >
                    {
                      selectedInfo.cortisol
                    }
                  </Text>

                </View>

                <Ionicons
                  name="analytics-outline"
                  size={24}
                  color={
                    Palette.orange
                  }
                />

              </View>

            </ScrollView>

          ) : (

            <View
              style={
                styles.emptyState
              }
            >

              <View
                style={
                  styles.emptyIcon
                }
              >
                <Ionicons
                  name="calendar-outline"
                  size={28}
                  color={
                    Palette.textSubtle
                  }
                />
              </View>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No information yet
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Nothing has been recorded
                for this day. Your cycle
                and recovery information
                will appear here once
                it is logged.
              </Text>

            </View>

          )}

        </Animated.View>

      </View>

    </Modal>
  );
}


function InfoTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={
        styles.bottomSheetTile
      }
    >
      <Text
        style={
          styles.bottomSheetLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.bottomSheetValue
        }
      >
        {value}
      </Text>
    </View>
  );
}