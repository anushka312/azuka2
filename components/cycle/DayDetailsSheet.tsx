import React, {
  useEffect,
  useRef,
  useState,
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
  // SELECTED DATE LOADING TRACKER
  // ==========================================================

  /**
   * Keeps track of which date the current dailyState/dailyScore
   * belong to.
   *
   * This is important because AzukaContext stores dailyState and
   * dailyScore as shared context values.
   *
   * When the user changes:
   *
   * Sep 5 -> Sep 6
   *
   * we must not temporarily display Sep 5's data while Sep 6
   * is being fetched.
   */
  const [loadedDate, setLoadedDate] = useState<string | null>(
    null
  );

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
      setLoadedDate(null);
      return;
    }

    // --------------------------------------------------------
    // Immediately invalidate the previous date.
    //
    // Example:
    //
    // Previously loaded: Sep 5
    // User selects:      Sep 6
    //
    // Sep 5 data must NOT be displayed while Sep 6 loads.
    // --------------------------------------------------------

    setLoadedDate(null);

    let cancelled = false;

    const loadSelectedDate = async () => {
      try {
        await refreshDailyData(selectedDate);

        if (!cancelled) {
          setLoadedDate(selectedDate);
        }
      } catch (error) {
        console.error(
          "Failed to load daily data:",
          error
        );

        if (!cancelled) {
          setLoadedDate(selectedDate);
        }
      }
    };

    loadSelectedDate();

    return () => {
      cancelled = true;
    };
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
    ? new Date(
        `${selectedDate}T12:00:00`
      ).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )
    : "";

  // ==========================================================
  // ONLY USE DATA AFTER SELECTED DATE HAS LOADED
  // ==========================================================

  /**
   * If the user selects Sep 6 while Sep 5 data is still present
   * in context, loadedDate is immediately reset to null.
   *
   * Therefore all displayed values become empty/loading instead
   * of incorrectly showing Sep 5's data.
   */
  const isSelectedDateLoaded =
    selectedDate !== null &&
    loadedDate === selectedDate;

  const selectedDailyState =
    isSelectedDateLoaded
      ? dailyState
      : null;

  const selectedDailyScore =
    isSelectedDateLoaded
      ? dailyScore
      : null;

  // ==========================================================
  // DATA FROM AZUKA CONTEXT
  // ==========================================================

  const phase = selectedDailyState?.phase;

  const energy =
    selectedDailyScore?.phase_energy_score;

  const stress =
    selectedDailyScore?.stress_level;

  const sleep =
    selectedDailyState?.sleep;

  const symptoms =
    selectedDailyState?.symptoms;

  const recovery =
    selectedDailyScore?.daily_recovery_score;

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

          {!isSelectedDateLoaded || isLoading ? (
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
                  color={
                    Palette.crimson
                  }
                />
              </View>

              <Text style={styles.emptyTitle}>
                Unable to load data
              </Text>

              <Text style={styles.emptyText}>
                {error}
              </Text>
            </View>
          ) : (
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