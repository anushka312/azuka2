import React, { useMemo } from 'react';

import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  Palette,
  GlobalStyles,
} from '../../constants/Styles';

import {
  CycleHistory,
} from '../../services/api';

import { DailyData } from './types';

import { styles } from './styles';

// ============================================================
// TYPES
// ============================================================

type Props = {
  currentDate: Date;
  selectedDate: string | null;

  /**
   * Actual logged daily states.
   *
   * Example:
   * {
   *   "2026-09-04": {...},
   *   "2026-09-05": {...}
   * }
   *
   * A date does NOT need to exist here in order to
   * display its cycle phase.
   */
  dailyData: DailyData;

  /**
   * Cycle history is the source of truth for calculating
   * the phase/day for every calendar date.
   */
  cycleHistory: CycleHistory[];

  onMonthChange: (date: Date) => void;

  onDayPress: (dateKey: string) => void;
};

// ============================================================
// MONTH NAMES
// ============================================================

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// ============================================================
// WEEK DAYS
// ============================================================

const weekDays = [
  'S',
  'M',
  'T',
  'W',
  'T',
  'F',
  'S',
];

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDateKey = (
  year: number,
  month: number,
  day: number,
): string => {
  return `${year}-${String(
    month + 1,
  ).padStart(2, '0')}-${String(
    day,
  ).padStart(2, '0')}`;
};

// ============================================================
// DATE HELPERS
// ============================================================

/**
 * Converts YYYY-MM-DD into a local Date.
 *
 * We intentionally do NOT use:
 *
 * new Date("YYYY-MM-DD")
 *
 * because that can be interpreted as UTC and cause
 * timezone-related date shifts.
 */
const parseDateKey = (
  dateKey: string,
): Date | null => {
  const parts = dateKey.split('-');

  if (parts.length !== 3) {
    return null;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

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

/**
 * Returns the number of calendar days between two dates.
 */
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
// PHASE COLORS
// ============================================================

const getPhaseColor = (
  phase?: string,
): string => {
  switch (phase) {
    case 'Menstrual':
      return Palette.crimson;

    case 'Follicular':
      return Palette.forestGreen;

    case 'Ovulation':
      return Palette.marigold;

    case 'Luteal':
      return Palette.oceanBlue;

    case 'Late Luteal':
      return Palette.orange;

    default:
      return Palette.borderMuted;
  }
};

// ============================================================
// CYCLE PHASE CALCULATION
// ============================================================

type CycleInfo = {
  phase: string;
  day: number;
};

/**
 * Calculates the phase for a particular cycle day.
 *
 * Rules:
 *
 * Days 1 -> periodDuration
 *     = Menstrual
 *
 * cycleLength - 14
 *     = Ovulation
 *
 * Before ovulation
 *     = Follicular
 *
 * After ovulation
 *     = Luteal
 */
const calculateCyclePhase = (
  cycleDay: number,
  cycleLength: number,
  periodDuration: number,
): string => {
  if (cycleDay <= periodDuration) {
    return 'Menstrual';
  }

  const ovulationDay = Math.max(
    periodDuration + 1,
    cycleLength - 14,
  );

  if (cycleDay < ovulationDay) {
    return 'Follicular';
  }

  if (cycleDay === ovulationDay) {
    return 'Ovulation';
  }

  return 'Luteal';
};

// ============================================================
// FIND CYCLE FOR DATE
// ============================================================

/**
 * Finds the most recent cycle whose period started on
 * or before the date we're displaying.
 *
 * Example:
 *
 * Cycle A:
 *   start = Aug 20
 *
 * Cycle B:
 *   start = Sep 17
 *
 * For Sep 5:
 *   Cycle A is used.
 *
 * For Sep 20:
 *   Cycle B is used.
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

  let latestStartTime = -Infinity;

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

    /**
     * Ignore cycles that start after the
     * date we're displaying.
     */
    if (startTime > targetDate.getTime()) {
      continue;
    }

    /**
     * We want the latest cycle start date
     * that is still <= target date.
     */
    if (
      startTime > latestStartTime
    ) {
      latestStartTime = startTime;
      matchingCycle = cycle;
    }
  }

  return matchingCycle;
};

// ============================================================
// GET CYCLE INFO FOR DATE
// ============================================================

const getCycleInfoForDate = (
  cycleHistory: CycleHistory[],
  dateKey: string,
): CycleInfo | null => {
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

  /**
   * Convert the date into a cycle day.
   *
   * Example:
   *
   * start date = Sept 4
   *
   * Sept 4 -> day 1
   * Sept 5 -> day 2
   * Sept 6 -> day 3
   *
   * After cycleLength, the cycle starts again.
   */
  const cycleDay =
    (daysSinceStart % cycleLength) + 1;

  const phase =
    calculateCyclePhase(
      cycleDay,
      cycleLength,
      periodDuration,
    );

  return {
    phase,
    day: cycleDay,
  };
};

// ============================================================
// COMPONENT
// ============================================================

export default function CycleCalendar({
  currentDate,
  selectedDate,
  dailyData,
  cycleHistory,
  onMonthChange,
  onDayPress,
}: Props) {

  // ==========================================================
  // TODAY
  // ==========================================================

  const today = new Date();

  const todayKey =
    formatDateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

  // ==========================================================
  // CURRENT MONTH
  // ==========================================================

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0,
    ).getDate();

  const firstDay =
    new Date(
      year,
      month,
      1,
    ).getDay();

  // ==========================================================
  // CALENDAR DAYS
  // ==========================================================

  const calendarDays =
    useMemo(() => {
      const days: (
        number | null
      )[] = [];

      // Empty cells before first day
      for (
        let i = 0;
        i < firstDay;
        i++
      ) {
        days.push(null);
      }

      // Actual days
      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        days.push(day);
      }

      return days;
    }, [
      firstDay,
      daysInMonth,
    ]);

  // ==========================================================
  // MONTH NAVIGATION
  // ==========================================================

  const previousMonth = () => {
    onMonthChange(
      new Date(
        year,
        month - 1,
        1,
      ),
    );
  };

  const nextMonth = () => {
    onMonthChange(
      new Date(
        year,
        month + 1,
        1,
      ),
    );
  };

  // ==========================================================
  // ACTIVE DATE
  // ==========================================================

  const activeDate =
    selectedDate ?? todayKey;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View
      style={[
        GlobalStyles.cardElevated,
        styles.calendarCard,
      ]}
    >

      {/* =====================================================
          MONTH HEADER
          ===================================================== */}

      <View
        style={styles.calendarHeader}
      >

        <TouchableOpacity
          onPress={previousMonth}
          style={styles.monthButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={
              Palette.oceanBlue
            }
          />
        </TouchableOpacity>

        <View
          style={
            styles.monthTitleContainer
          }
        >
          <Text
            style={
              styles.monthTitle
            }
          >
            {monthNames[month]} {year}
          </Text>

          <Text
            style={
              styles.monthSubtitle
            }
          >
            Select a day to view details
          </Text>
        </View>

        <TouchableOpacity
          onPress={nextMonth}
          style={styles.monthButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={
              Palette.oceanBlue
            }
          />
        </TouchableOpacity>

      </View>

      {/* =====================================================
          WEEK DAYS
          ===================================================== */}

      <View
        style={styles.weekRow}
      >
        {weekDays.map(
          (day, index) => (
            <View
              key={`${day}-${index}`}
              style={
                styles.weekDayCell
              }
            >
              <Text
                style={
                  styles.weekDayText
                }
              >
                {day}
              </Text>
            </View>
          ),
        )}
      </View>

      {/* =====================================================
          CALENDAR GRID
          ===================================================== */}

      <View
        style={styles.calendarGrid}
      >

        {calendarDays.map(
          (day, index) => {

            // ------------------------------------------------
            // EMPTY CELL
            // ------------------------------------------------

            if (day === null) {
              return (
                <View
                  key={`empty-${index}`}
                  style={
                    styles.dayCell
                  }
                />
              );
            }

            // ------------------------------------------------
            // DATE KEY
            // ------------------------------------------------

            const dateKey =
              formatDateKey(
                year,
                month,
                day,
              );

            // ------------------------------------------------
            // ACTUAL LOGGED DATA
            // ------------------------------------------------

            const dailyInfo =
              dailyData[dateKey];

            // ------------------------------------------------
            // CYCLE INFORMATION
            // ------------------------------------------------
            //
            // IMPORTANT:
            //
            // This does NOT depend on dailyInfo.
            //
            // Therefore even if the user did not log
            // anything on this date, the calendar can still
            // display the correct cycle phase.
            // ------------------------------------------------

            const cycleInfo =
              getCycleInfoForDate(
                cycleHistory,
                dateKey,
              );

            // ------------------------------------------------
            // PHASE
            // ------------------------------------------------
            //
            // If a DailyState has an explicitly stored phase,
            // use it as an override.
            //
            // Otherwise use the phase calculated from
            // CycleHistory.
            // ------------------------------------------------

            const phase =
              dailyInfo?.phase ??
              cycleInfo?.phase;

            const phaseColor =
              getPhaseColor(phase);

            // ------------------------------------------------
            // SELECTED
            // ------------------------------------------------

            const isSelected =
              activeDate === dateKey;

            // ------------------------------------------------
            // TODAY
            // ------------------------------------------------

            const isToday =
              todayKey === dateKey;

            // ------------------------------------------------
            // HAS LOGGED DATA
            // ------------------------------------------------

            const hasLoggedData =
              Boolean(dailyInfo);

            return (
              <TouchableOpacity
                key={dateKey}
                style={styles.dayCell}
                onPress={() =>
                  onDayPress(
                    dateKey,
                  )
                }
                activeOpacity={0.7}
              >

                {/* =========================================
                    DAY NUMBER
                    ========================================= */}

                <View
                  style={[
                    styles.dayNumberContainer,

                    isSelected && {
                      backgroundColor:
                        cycleInfo
                          ? `${phaseColor}12`
                          : Palette.surfaceWhite,

                      borderWidth: 1.5,

                      borderColor:
                        cycleInfo
                          ? phaseColor
                          : Palette.borderMuted,

                      borderRadius: 20,
                    },
                  ]}
                >

                  <Text
                    style={[
                      styles.dayNumber,

                      isSelected &&
                        cycleInfo && {
                          color:
                            phaseColor,

                          fontWeight:
                            '800',
                        },

                      isToday &&
                        !isSelected && {
                          color:
                            Palette.skyBlue,

                          fontWeight:
                            '800',
                        },
                    ]}
                  >
                    {day}
                  </Text>

                  {/* =======================================
                      TODAY DOT
                      ======================================= */}

                  {isToday && (
                    <View
                      style={[
                        styles.todayIndicator,
                        {
                          backgroundColor:
                            Palette.skyBlue,
                        },
                      ]}
                    />
                  )}

                </View>

                {/* =========================================
                    CYCLE PHASE DOT
                    =========================================
                    
                    IMPORTANT:
                    
                    This is based on cycleHistory,
                    NOT dailyData.
                    
                    Therefore it appears even when there
                    is no DailyState for this date.
                    ========================================= */}

                {cycleInfo && (
                  <View
                    style={[
                      styles.dayIndicator,
                      {
                        backgroundColor:
                          phaseColor,
                      },
                    ]}
                  />
                )}

                {/* =========================================
                    LOGGED DATA INDICATOR
                    =========================================
                    
                    We intentionally do NOT create another
                    visual here because your existing calendar
                    already has a phase dot.
                    
                    The existence of dailyInfo is still
                    available for future UI treatment.
                    ========================================= */}

              </TouchableOpacity>
            );
          },
        )}

      </View>

      {/* =====================================================
          LEGEND
          ===================================================== */}

      <View
        style={styles.legend}
      >

        <Legend
          color={
            Palette.crimson
          }
          label="Menstrual"
        />

        <Legend
          color={
            Palette.forestGreen
          }
          label="Follicular"
        />

        <Legend
          color={
            Palette.marigold
          }
          label="Ovulation"
        />

        <Legend
          color={
            Palette.oceanBlue
          }
          label="Luteal"
        />

        <Legend
          color={
            Palette.orange
          }
          label="Late Luteal"
        />

      </View>

    </View>
  );
}

// ============================================================
// LEGEND
// ============================================================

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <View
      style={styles.legendItem}
    >
      <View
        style={[
          styles.legendDot,
          {
            backgroundColor:
              color,
          },
        ]}
      />

      <Text
        style={
          styles.legendText
        }
      >
        {label}
      </Text>
    </View>
  );
}