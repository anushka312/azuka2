import React, {
  useState,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
} from 'react-native';

import {
  CycleHeader,
  PhaseCard,
  CycleCalendar,
  SignalsSection,
  DayDetailsSheet,
} from '@/components/cycle';

import {
  dailyData,
} from '@/components/cycle/data';

import {
  styles,
} from '@/components/cycle/styles';

import {
  useAzuka,
} from '@/contexts/AzukaContext';

export default function CycleTabScreen() {

  // ============================================================
  // AZUKA CONTEXT
  // ============================================================

  const {
    cycleHistory,
  } = useAzuka();

  // ============================================================
  // CURRENT MONTH
  // ============================================================

  const [
    currentDate,
    setCurrentDate,
  ] = useState(
    new Date(),
  );

  // ============================================================
  // TODAY KEY
  // ============================================================

  const getTodayKey = (): string => {
    const today = new Date();

    return `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, '0')}-${String(
      today.getDate(),
    ).padStart(2, '0')}`;
  };

  // ============================================================
  // SELECTED DATE
  // ============================================================

  const [
    selectedDate,
    setSelectedDate,
  ] = useState<string | null>(
    getTodayKey(),
  );

  // ============================================================
  // DAY DETAILS MODAL
  // ============================================================

  const [
    modalVisible,
    setModalVisible,
  ] = useState(false);

  // ============================================================
  // MONTH CHANGE
  // ============================================================

  const handleMonthChange = (
    date: Date,
  ) => {
    setCurrentDate(date);
  };

  // ============================================================
  // DAY PRESS
  // ============================================================

  const handleDayPress = (
    dateKey: string,
  ) => {
    setSelectedDate(dateKey);
    setModalVisible(true);
  };

  // ============================================================
  // SELECTED DAY DATA
  // ============================================================

  const selectedInfo =
    selectedDate
      ? dailyData[selectedDate]
      : undefined;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <SafeAreaView
      style={styles.screen}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* ==================================================
            HEADER
            ================================================== */}

        <CycleHeader />

        {/* ==================================================
            CURRENT PHASE
            ================================================== */}

        <PhaseCard />

        {/* ==================================================
            CALENDAR
            ================================================== */}

        <CycleCalendar
          currentDate={
            currentDate
          }

          selectedDate={
            selectedDate
          }

          dailyData={
            dailyData
          }

          cycleHistory={
            cycleHistory
          }

          onMonthChange={
            handleMonthChange
          }

          onDayPress={
            handleDayPress
          }
        />

        {/* ==================================================
            SIGNALS
            ================================================== */}

        <SignalsSection
          symptoms={
            selectedInfo?.symptomRecords
          }
        />

      </ScrollView>

      {/* ====================================================
          DAY DETAILS
          ==================================================== */}

      <DayDetailsSheet
        visible={
          modalVisible
        }

        selectedDate={
          selectedDate
        }

        onClose={() =>
          setModalVisible(false)
        }
      />

    </SafeAreaView>
  );
}