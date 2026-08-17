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
import PhaseCardMock from '@/components/cycle/PhaseCardMock';

export default function CycleTabScreen() {

  const [
    currentDate,
    setCurrentDate,
  ] = useState(
    new Date()
  );
  const getTodayKey = () => {
  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`;
};
  const [
    selectedDate,
    setSelectedDate,
  ] = useState<string | null>(
    getTodayKey()
  );

  const [
    modalVisible,
    setModalVisible,
  ] = useState(false);


  const handleDayPress = (
    dateKey: string
  ) => {

    setSelectedDate(
      dateKey
    );

    setModalVisible(true);
  };


  const selectedInfo =
    selectedDate
      ? dailyData[selectedDate]
      : undefined;


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

        {/* HEADER */}

        <CycleHeader />


        {/* CURRENT PHASE */}

        <PhaseCard />
        {/* <PhaseCardMock /> */}


        {/* CALENDAR */}

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
          onMonthChange={
            setCurrentDate
          }
          onDayPress={
            handleDayPress
          }
        />


        {/* SIGNALS */}

        <SignalsSection
          energy={
            selectedInfo?.energy
          }
          stress={
            selectedInfo?.stress
          }
          hrv={
            selectedInfo?.hrv
          }
          sleep={
            selectedInfo?.sleep
          }
          cortisol={
            selectedInfo?.cortisol
          }
        />

      </ScrollView>


      {/* DAY DETAILS */}

      <DayDetailsSheet
        visible={
          modalVisible
        }
        selectedDate={
          selectedDate
        }
        selectedInfo={
          selectedInfo
        }
        onClose={() =>
          setModalVisible(false)
        }
      />

    </SafeAreaView>
  );
}