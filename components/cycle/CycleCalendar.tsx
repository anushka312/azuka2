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
} from '@/constants/Styles';

import { DailyData } from './types';
import { styles } from './styles';

type Props = {
  currentDate: Date;
  selectedDate: string | null;
  dailyData: DailyData;
  onMonthChange: (date: Date) => void;
  onDayPress: (dateKey: string) => void;
};

/* =========================
   MONTH NAMES
========================= */

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

/* =========================
   WEEK DAYS
========================= */

const weekDays = [
  'S',
  'M',
  'T',
  'W',
  'T',
  'F',
  'S',
];

/* =========================
   DATE FORMATTER
========================= */

const formatDateKey = (
  year: number,
  month: number,
  day: number,
) => {
  return `${year}-${String(
    month + 1,
  ).padStart(2, '0')}-${String(
    day,
  ).padStart(2, '0')}`;
};

/* =========================
   PHASE COLORS

   Same scheme as PhaseCard
========================= */

const getPhaseColor = (
  phase?: string,
) => {
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

/* =========================
   COMPONENT
========================= */

export default function CycleCalendar({
  currentDate,
  selectedDate,
  dailyData,
  onMonthChange,
  onDayPress,
}: Props) {

  /* =========================
     TODAY
  ========================== */

  const today = new Date();

  const todayKey = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  /* =========================
     CURRENT MONTH
  ========================== */

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

  /* =========================
     CALENDAR DAYS
  ========================== */

  const calendarDays = useMemo(() => {
    const days: (
      number | null
    )[] = [];

    /*
     * Empty cells before
     * first day of month.
     */
    for (
      let i = 0;
      i < firstDay;
      i++
    ) {
      days.push(null);
    }

    /*
     * Actual days.
     */
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

  /* =========================
     MONTH NAVIGATION
  ========================== */

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

  /*
   * If no date has been
   * explicitly selected,
   * today is active.
   */
  const activeDate =
    selectedDate ?? todayKey;

  /* =========================
     RENDER
  ========================== */

  return (
    <View
      style={[
        GlobalStyles.cardElevated,
        styles.calendarCard,
      ]}
    >

      {/* =====================
          MONTH HEADER
      ====================== */}

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
            style={styles.monthTitle}
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

      {/* =====================
          WEEK DAYS
      ====================== */}

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

      {/* =====================
          CALENDAR GRID
      ====================== */}

      <View
        style={styles.calendarGrid}
      >

        {calendarDays.map(
          (day, index) => {

            /*
             * Empty cell.
             */
            if (day === null) {
              return (
                <View
                  key={`empty-${index}`}
                  style={styles.dayCell}
                />
              );
            }

            const dateKey =
              formatDateKey(
                year,
                month,
                day,
              );

            const info =
              dailyData[dateKey];

            /*
             * Selected date.
             */
            const isSelected =
              activeDate === dateKey;

            /*
             * Today.
             */
            const isToday =
              todayKey === dateKey;

            /*
             * Phase color.
             */
            const phaseColor =
              getPhaseColor(
                info?.phase,
              );

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

                {/* =================
                    DAY NUMBER
                ================== */}

                <View
                  style={[
                    styles.dayNumberContainer,

                    /*
                     * Selected day gets
                     * a subtle phase tint.
                     */
                    isSelected && {
                      backgroundColor:
                        info
                          ? `${phaseColor}12`
                          : Palette.surfaceWhite,

                      borderWidth: 1.5,

                      borderColor:
                        phaseColor,

                        borderRadius: 20
                    },
                  ]}
                >

                  <Text
                    style={[
                      styles.dayNumber,

                      /*
                       * Selected text uses
                       * the phase color.
                       */
                      isSelected && {
                        color:
                          phaseColor,

                        fontWeight:
                          '800',
                      },

                      /*
                       * Today uses blue
                       * if not selected.
                       */
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

                  {/* =================
                      TODAY DOT
                  ================== */}

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

                {/* =================
                    PHASE DOT
                ================== */}

                {info && (
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

              </TouchableOpacity>
            );
          },
        )}

      </View>

      {/* =====================
          LEGEND
      ====================== */}

      <View
        style={styles.legend}
      >

        <Legend
          color={Palette.crimson}
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
          color={Palette.orange}
          label="Late Luteal"
        />

      </View>

    </View>
  );
}

/* =========================
   LEGEND
========================= */

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
        style={styles.legendText}
      >
        {label}
      </Text>

    </View>
  );
}