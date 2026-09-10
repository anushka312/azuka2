import React, { useEffect, useMemo } from "react";

import {
  Text,
  View,
} from "react-native";

import {
  GlobalStyles,
  Palette,
} from "@/constants/Styles";

import {
  useAzuka,
} from "@/contexts/AzukaContext";

import {
  CycleHistory,
} from "@/services/api";

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
    backgroundColor:
      Palette.surfaceCrimsonMuted,
    badge: "Recovery",
  },

  Follicular: {
    color: Palette.forestGreen,
    backgroundColor:
      Palette.surfaceGreenMuted,
    badge: "Build",
  },

  Ovulation: {
    color: Palette.marigold,
    backgroundColor:
      Palette.surfaceMarigoldMuted,
    badge: "Peak",
  },

  Ovulatory: {
    color: Palette.marigold,
    backgroundColor:
      Palette.surfaceMarigoldMuted,
    badge: "Peak",
  },

  Luteal: {
    color: Palette.oceanBlue,
    backgroundColor:
      Palette.surfaceBlueMuted,
    badge: "Balance",
  },

  "Late Luteal": {
    color: Palette.orange,
    backgroundColor:
      Palette.surfaceOrangeMuted,
    badge: "Recovery",
  },
};

// ============================================================
// DATE HELPER
// ============================================================

const getTodayDate = (): string => {
  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(today.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(today.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ============================================================
// DATE PARSER
// ============================================================

/**
 * Converts YYYY-MM-DD into a local Date.
 *
 * We intentionally do NOT use:
 *
 * new Date("YYYY-MM-DD")
 *
 * because that can be interpreted as UTC.
 */

const parseDateKey = (
  dateKey: string,
): Date | null => {
  const parts =
    dateKey.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const year =
    Number(parts[0]);

  const month =
    Number(parts[1]);

  const day =
    Number(parts[2]);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day)
  ) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day,
  );
};

// ============================================================
// DATE DIFFERENCE
// ============================================================

const getDaysDifference = (
  startDate: Date,
  endDate: Date,
): number => {
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );

  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  return Math.floor(
    (end.getTime() - start.getTime()) /
      millisecondsPerDay,
  );
};

// ============================================================
// FIND CYCLE FOR DATE
// ============================================================

/**
 * Finds the most recent cycle whose
 * period started on or before the date.
 *
 * This is the same source-of-truth approach
 * used by the CycleCalendar.
 */

const findCycleForDate = (
  cycleHistory: CycleHistory[],
  dateKey: string,
): CycleHistory | null => {
  if (!cycleHistory.length) {
    return null;
  }

  const targetDate =
    parseDateKey(dateKey);

  if (!targetDate) {
    return null;
  }

  let matchingCycle:
    CycleHistory | null = null;

  let latestStartTime =
    -Infinity;

  for (const cycle of cycleHistory) {
    if (!cycle.period_start_date) {
      continue;
    }

    const cycleStart =
      parseDateKey(
        cycle.period_start_date,
      );

    if (!cycleStart) {
      continue;
    }

    const startTime =
      cycleStart.getTime();

    /*
     * Ignore cycles that begin
     * after the selected date.
     */

    if (
      startTime >
      targetDate.getTime()
    ) {
      continue;
    }

    /*
     * Keep the most recent cycle
     * that started on or before
     * the selected date.
     */

    if (
      startTime >
      latestStartTime
    ) {
      latestStartTime =
        startTime;

      matchingCycle =
        cycle;
    }
  }

  return matchingCycle;
};

// ============================================================
// CALCULATE PHASE
// ============================================================

const calculateCyclePhase = (
  cycleDay: number,
  periodDuration: number,
  cycleLength: number,
): string => {
  // ----------------------------------------------------------
  // MENSTRUAL
  // ----------------------------------------------------------

  if (
    cycleDay >= 1 &&
    cycleDay <= periodDuration
  ) {
    return "Menstrual";
  }

  // ----------------------------------------------------------
  // APPROXIMATE OVULATION
  //
  // Keep this identical to AzukaContext.
  // ----------------------------------------------------------

  const ovulationDay =
    Math.round(cycleLength / 2);

  // ----------------------------------------------------------
  // FOLLICULAR
  // ----------------------------------------------------------

  const follicularEnd =
    Math.max(
      periodDuration + 1,
      ovulationDay - 1,
    );

  if (
    cycleDay >=
      periodDuration + 1 &&
    cycleDay <=
      follicularEnd
  ) {
    return "Follicular";
  }

  // ----------------------------------------------------------
  // OVULATION
  // ----------------------------------------------------------

  if (
    cycleDay ===
    ovulationDay
  ) {
    return "Ovulation";
  }

  // ----------------------------------------------------------
  // LUTEAL
  // ----------------------------------------------------------

  return "Luteal";
};

// ============================================================
// GET CYCLE INFO FOR DATE
// ============================================================

const getCycleInfoForDate = (
  cycleHistory: CycleHistory[],
  dateKey: string,
): {
  cycleDay: number;
  phase: string;
} | null => {
  const cycle =
    findCycleForDate(
      cycleHistory,
      dateKey,
    );

  if (!cycle) {
    return null;
  }

  const targetDate =
    parseDateKey(dateKey);

  const cycleStart =
    parseDateKey(
      cycle.period_start_date,
    );

  if (
    !targetDate ||
    !cycleStart
  ) {
    return null;
  }

  const cycleLength =
    Number(cycle.cycle_length);

  const periodDuration =
    Number(cycle.period_duration);

  if (
    !Number.isFinite(cycleLength) ||
    cycleLength <= 0
  ) {
    return null;
  }

  if (
    !Number.isFinite(periodDuration) ||
    periodDuration <= 0
  ) {
    return null;
  }

  const daysSinceStart =
    getDaysDifference(
      cycleStart,
      targetDate,
    );

  if (daysSinceStart < 0) {
    return null;
  }

  // ----------------------------------------------------------
  // Convert to cycle day.
  //
  // Start date = Day 1
  // Next day   = Day 2
  // ----------------------------------------------------------

  const cycleDay =
    (daysSinceStart %
      cycleLength) +
    1;

  const phase =
    calculateCyclePhase(
      cycleDay,
      periodDuration,
      cycleLength,
    );

  return {
    cycleDay,
    phase,
  };
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
    cycleHistory,
    refreshDailyData,
  } = useAzuka();

  // ==========================================================
  // DATE
  // ==========================================================

  const dateToUse =
    selectedDate ??
    getTodayDate();

  // ==========================================================
  // LOAD DAILY DATA FOR SELECTED DATE
  // ==========================================================

  /**
   * We still load DailyState because the rest
   * of the screen may need the selected day's
   * symptoms / sleep / other data.
   *
   * IMPORTANT:
   *
   * DailyState is NOT used to decide the phase.
   */

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    refreshDailyData(
      selectedDate,
    ).catch((error) => {
      console.error(
        "Failed to load phase data:",
        error,
      );
    });
  }, [
    selectedDate,
    refreshDailyData,
  ]);

  // ==========================================================
  // CALCULATE CURRENT PHASE
  // ==========================================================

  const cycleInfo =
    useMemo(() => {
      return getCycleInfoForDate(
        cycleHistory,
        dateToUse,
      );
    }, [
      cycleHistory,
      dateToUse,
    ]);

  // ==========================================================
  // FINAL PHASE
  // ==========================================================

  /**
   * IMPORTANT:
   *
   * We deliberately do NOT use:
   *
   * dailyState?.phase
   *
   * here.
   *
   * The cycle history is the source of truth
   * for phase calculation.
   */

  const currentPhase =
    cycleInfo?.phase ??
    "Luteal";

  // ==========================================================
  // FINAL CYCLE DAY
  // ==========================================================

  const cycleDay =
    cycleInfo?.cycleDay ??
    1;

  // ==========================================================
  // CYCLE LENGTH
  // ==========================================================

  const selectedCycle =
    findCycleForDate(
      cycleHistory,
      dateToUse,
    );

  const cycleLength =
    selectedCycle?.cycle_length ??
    28;

  // ==========================================================
  // PHASE CONFIG
  // ==========================================================

  const config =
    phaseConfig[currentPhase] ??
    phaseConfig.Luteal;

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const progress =
    Math.min(
      100,
      Math.round(
        (cycleDay /
          cycleLength) *
          100,
      ),
    );

  // ==========================================================
  // NEXT PERIOD
  // ==========================================================

  let nextPeriod = "";

  if (selectedCycle) {
    const start =
      parseDateKey(
        selectedCycle.period_start_date,
      );

    if (start) {
      const nextStart =
        new Date(start);

      nextStart.setDate(
        nextStart.getDate() +
          cycleLength,
      );

      const nextMonth =
        String(
          nextStart.getMonth() + 1,
        ).padStart(2, "0");

      const nextDay =
        String(
          nextStart.getDate(),
        ).padStart(2, "0");

      nextPeriod =
        `Next period around ${nextDay}/${nextMonth}`;
    }
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <View
      style={[
        GlobalStyles.cardElevated,
        {
          backgroundColor:
            config.backgroundColor,
        },
      ]}
    >
      {/* ====================================================
          HEADER
      ==================================================== */}

      <View
        style={
          styles.phaseHeader
        }
      >
        <View>
          <Text
            style={[
              styles.phaseTitle,
              {
                color:
                  config.color,
              },
            ]}
          >
            {currentPhase}
          </Text>

          <Text
            style={
              styles.phaseSubtitle
            }
          >
            Cycle Day {cycleDay}
          </Text>
        </View>

        {/* ==================================================
            BADGE
        ================================================== */}

        <View
          style={
            styles.phaseBadge
          }
        >
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
                color:
                  config.color,
              },
            ]}
          >
            {config.badge}
          </Text>
        </View>
      </View>

      {/* ====================================================
          PROGRESS
      ==================================================== */}

      <View
        style={
          styles.progressTrack
        }
      >
        <View
          style={[
            styles.progressFill,
            {
              width:
                `${progress}%`,
              backgroundColor:
                config.color,
            },
          ]}
        />
      </View>

      {/* ====================================================
          HELPER TEXT
      ==================================================== */}

      {nextPeriod ? (
        <Text
          style={
            styles.helperText
          }
        >
          {nextPeriod}
        </Text>
      ) : null}
    </View>
  );
}
