
import React, {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useAzuka } from "../../contexts/AzukaContext";

import { Palette } from "../../constants/Styles";

import { styles } from "./styles";

// ============================================================
// TYPES
// ============================================================

type Props = {
  visible: boolean;
  selectedDate: string | null;
  onClose: () => void;
};

// ============================================================
// HELPERS
// ============================================================

const getPhaseColor = (phase?: string) => {
  if (!phase) {
    return Palette.oceanBlue;
  }

  if (phase.includes("Menstrual")) {
    return Palette.crimson;
  }

  if (phase.includes("Follicular")) {
    return Palette.forestGreen;
  }

  if (phase.includes("Ovulation")) {
    return Palette.skyBlue;
  }

  return Palette.orange;
};

const getPhaseBackground = (phase?: string) => {
  if (!phase) {
    return Palette.cream;
  }

  if (phase.includes("Menstrual")) {
    return Palette.surfaceCrimsonMuted;
  }

  if (phase.includes("Follicular")) {
    return Palette.surfaceGreenMuted;
  }

  if (phase.includes("Ovulation")) {
    return Palette.surfaceBlueMuted;
  }

  return Palette.surfaceOrangeMuted;
};

// ============================================================
// COMPONENT
// ============================================================

export default function DayDetailsSheet({
  visible,
  selectedDate,
  onClose,
}: Props) {
  // ==========================================================
  // AZUKA CONTEXT
  // ==========================================================

  const {
    dailyState,
    dailyScore,
    isLoading,
    error,
    refreshDailyData,
  } = useAzuka();

  // ==========================================================
  // ANIMATIONS
  // ==========================================================

  const slideAnim = useRef(
    new Animated.Value(400)
  ).current;

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  // ==========================================================
  // LOAD SELECTED DATE
  // ==========================================================

  useEffect(() => {
    if (!visible || !selectedDate) {
      return;
    }

    refreshDailyData(selectedDate).catch((error) => {
      console.error(
        "Failed to load daily data:",
        error
      );
    });
  }, [
    visible,
    selectedDate,
    refreshDailyData,
  ]);

  // ==========================================================
  // SHEET ANIMATION
  // ==========================================================

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

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formattedDate = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    )

    : "";

  // ==========================================================
  // DATA FROM AZUKA CONTEXT ONLY
  // ==========================================================

  const phase = dailyState?.phase;

  const energy = dailyScore?.phase_energy_score;

  const stress = dailyScore?.stress_level;

  const sleep = dailyState?.sleep;

  const symptoms = dailyState?.symptoms;

  const recovery =
    dailyScore?.daily_recovery_score;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>

        {/* ==================================================
            BACKDROP
        ================================================== */}

        <Animated.View
          style={[
            styles.modalBackdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Pressable
            style={styles.backdropPress}
            onPress={onClose}
          />
        </Animated.View>

        {/* ==================================================
            BOTTOM SHEET
        ================================================== */}

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          {/* HANDLE */}

          <View style={styles.sheetHandle} />

          {/* ==================================================
              HEADER
          ================================================== */}

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetDate}>
                {formattedDate}
              </Text>

              <Text style={styles.sheetSubtitle}>
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

          {/* ==================================================
              LOADING
          ================================================== */}

          {isLoading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="sync-outline"
                  size={28}
                  color={
                    Palette.textSubtle
                  }
                />
              </View>

              <Text style={styles.emptyTitle}>
                Loading...
              </Text>

              <Text style={styles.emptyText}>
                Fetching your information
                for this day.
              </Text>
            </View>
          ) : error ? (
            /* ==================================================
               ERROR
            ================================================== */

            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="alert-circle-outline"
                  size={28}
                  color={Palette.crimson}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Unable to load data
              </Text>

              <Text style={styles.emptyText}>
                {error}
              </Text>
            </View>
          ) : dailyState || dailyScore ? (
            /* ==================================================
               DATA
            ================================================== */

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 30,
              }}
            >
              {/* ==================================================
                  PHASE
              ================================================== */}

              {phase && (
                <View
                  style={[
                    styles.infoCard,
                    {
                      backgroundColor:
                        getPhaseBackground(
                          phase
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
                      color={getPhaseColor(
                        phase
                      )}
                    />
                  </View>

                  <View>
                    <Text
                      style={
                        styles.infoLabel
                      }
                    >
                      Cycle phase
                    </Text>

                    <Text
                      style={[
                        styles.infoValue,
                        {
                          color:
                            getPhaseColor(
                              phase
                            ),
                        },
                      ]}
                    >
                      {phase}
                    </Text>
                  </View>
                </View>
              )}

              {/* ==================================================
                  BODY SIGNALS
              ================================================== */}

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
                    energy !== undefined &&
                      energy !== null
                      ? String(energy)
                      : "—"
                  }
                />

                <InfoTile
                  label="Stress"
                  value={
                    stress !== undefined &&
                      stress !== null
                      ? String(stress)
                      : "—"
                  }
                />

                <InfoTile
                  label="Sleep"
                  value={
                    sleep !== undefined &&
                      sleep !== null
                      ? String(sleep)
                      : "—"
                  }
                />
              </View>

              {/* ==================================================
                  SYMPTOMS
              ================================================== */}

              <Text
                style={
                  styles.sheetSectionTitle
                }
              >
                Symptoms
              </Text>

              {symptoms ? (
                <View
                  style={
                    styles.symptomRow
                  }
                >
                  {Object.values(symptoms)
                    .flat()
                    .map((symptom) => (
                      <View key={symptom} style={styles.symptomChip}>
                        <Text style={styles.symptomText}>{symptom}</Text>
                      </View>
                    ))}
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

              {/* ==================================================
                  RECOVERY
              ================================================== */}

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
                    Recovery score
                  </Text>

                  <Text
                    style={
                      styles.infoValue
                    }
                  >
                    {recovery !== undefined &&
                      recovery !== null
                      ? recovery
                      : "—"}
                  </Text>
                </View>

                <Ionicons
                  name="analytics-outline"
                  size={24}
                  color={Palette.orange}
                />
              </View>
            </ScrollView>
          ) : (
            /* ==================================================
               NO DATA
            ================================================== */

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

// ============================================================
// INFO TILE
// ============================================================

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

