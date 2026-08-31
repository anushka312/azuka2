
import React, { useEffect } from "react";

import { Text, View } from "react-native";

import { GlobalStyles, Palette } from "@/constants/Styles";

import { useAzuka } from "@/contexts/AzukaContext";

import { styles } from "./styles";

// ============================================================
// TYPES
// ============================================================

interface PhaseCardProps {
  selectedDate?: string;
}

// ============================================================
// PHASE CONFIG
// ============================================================

const phaseConfig: Record<
  string,
  {
    color: string;
    backgroundColor: string;
    badge: string;
  }
> = {
  Menstrual: {
    color: Palette.crimson,
    backgroundColor: Palette.surfaceCrimsonMuted,
    badge: "Recovery",
  },

  Follicular: {
    color: Palette.forestGreen,
    backgroundColor: Palette.surfaceGreenMuted,
    badge: "Build",
  },

  Ovulation: {
    color: Palette.marigold,
    backgroundColor: Palette.surfaceMarigoldMuted,
    badge: "Peak",
  },

  Ovulatory: {
    color: Palette.marigold,
    backgroundColor: Palette.surfaceMarigoldMuted,
    badge: "Peak",
  },

  Luteal: {
    color: Palette.oceanBlue,
    backgroundColor: Palette.surfaceBlueMuted,
    badge: "Balance",
  },

  "Late Luteal": {
    color: Palette.orange,
    backgroundColor: Palette.surfaceOrangeMuted,
    badge: "Recovery",
  },
};

// ============================================================
// DATE HELPER
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

// ============================================================
// COMPONENT
// ============================================================

export default function PhaseCard({
  selectedDate,
}: PhaseCardProps) {
  // ==========================================================
  // AZUKA CONTEXT
  // ==========================================================

  const {
    dailyState,
    latestCycle,
    isLoading,
    refreshDailyData,
  } = useAzuka();

  // ==========================================================
  // DATE
  // ==========================================================

  const dateToUse =
    selectedDate ?? getTodayDate();

  // ==========================================================
  // LOAD DATA FOR SELECTED DATE
  // ==========================================================

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    refreshDailyData(selectedDate).catch(
      (error) => {
        console.error(
          "Failed to load phase data:",
          error
        );
      }
    );
  }, [
    selectedDate,
    refreshDailyData,
  ]);

  // ==========================================================
  // PHASE
  // ==========================================================

  const currentPhase =
    dailyState?.phase ?? "Luteal";

  const config =
    phaseConfig[currentPhase] ??
    phaseConfig.Luteal;

  // ==========================================================
  // CYCLE INFORMATION
  // ==========================================================

  /*
   * These values should come from your cycle data.
   *
   * Adjust the property names below if your
   * CycleHistory interface uses different names.
   */

  const cycleStartDate =
    latestCycle?.period_start_date;

  const cycleLength =
    latestCycle?.cycle_length ?? 28;

  // ==========================================================
  // CYCLE DAY
  // ==========================================================

  let cycleDay = 1;

  if (cycleStartDate) {
    const start = new Date(
      `${cycleStartDate}T12:00:00`
    );

    const selected = new Date(
      `${dateToUse}T12:00:00`
    );

    const difference =
      Math.floor(
        (selected.getTime() -
          start.getTime()) /
          (1000 * 60 * 60 * 24)
      );

    cycleDay = difference + 1;

    if (cycleDay < 1) {
      cycleDay = 1;
    }
  }

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const progress = Math.min(
    100,
    Math.round(
      (cycleDay / cycleLength) * 100
    )
  );

  // ==========================================================
  // NEXT PERIOD
  // ==========================================================

  let nextPeriod = "";

  if (cycleStartDate) {
    const start = new Date(
      `${cycleStartDate}T12:00:00`
    );

    const nextPeriodDate =
      new Date(start);

    nextPeriodDate.setDate(
      nextPeriodDate.getDate() +
        cycleLength
    );

    const selected = new Date(
      `${dateToUse}T12:00:00`
    );

    const daysUntil =
      Math.ceil(
        (nextPeriodDate.getTime() -
          selected.getTime()) /
          (1000 * 60 * 60 * 24)
      );

    if (daysUntil > 0) {
      nextPeriod =
        daysUntil === 1
          ? "Period in ~1 day"
          : `Period in ~${daysUntil} days`;
    } else if (daysUntil === 0) {
      nextPeriod = "Period expected today";
    } else {
      nextPeriod = "Period expected";
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading && !dailyState) {
    return (
      <View
        style={[
          GlobalStyles.cardElevated,
          styles.phaseCard,
        ]}
      >
        <Text style={styles.smallLabel}>
          CURRENT PHASE
        </Text>

        <Text style={styles.phaseTitle}>
          Loading...
        </Text>
      </View>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View
      style={[
        GlobalStyles.cardElevated,
        styles.phaseCard,
        {
          backgroundColor:
            config.backgroundColor,
        },
      ]}
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <View style={styles.phaseHeader}>
        <View>
          <Text style={styles.smallLabel}>
            CURRENT PHASE
          </Text>

          <Text style={styles.phaseTitle}>
            {currentPhase}
          </Text>

          <Text style={styles.phaseSubtitle}>
            Day {cycleDay} of {cycleLength}
          </Text>
        </View>

        {/* ==================================================
            BADGE
        ================================================== */}

        <View style={styles.phaseBadge}>
          <View
            style={[
              styles.phaseDot,
              {
                backgroundColor:
                  config.color,
              },
            ]}
          />

          <Text
            style={[
              styles.phaseBadgeText,
              {
                color: config.color,
              },
            ]}
          >
            {config.badge}
          </Text>
        </View>
      </View>

      {/* ==================================================
          PROGRESS
      ================================================== */}

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor:
                config.color,
            },
          ]}
        />
      </View>

      {/* ==================================================
          HELPER TEXT
      ================================================== */}

      {nextPeriod ? (
        <Text style={styles.helperText}>
          {nextPeriod}
        </Text>
      ) : null}
    </View>
  );
}

