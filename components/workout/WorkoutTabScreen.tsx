import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles, Palette } from '@/constants/Styles';

import TodayWorkout from '@/components/workout/TodayWorkout';
import Next7DaysWorkout from '@/components/workout/Next7DaysWorkout';
import WorkoutHistory from '@/components/workout/WorkoutHistory';

import { styles } from '@/components/workout/workoutStyles';

type WorkoutTab = 'today' | 'next7' | 'history';

export default function WorkoutTabScreen() {
  const [activeTab, setActiveTab] = useState<WorkoutTab>('today');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* ================= HEADER ================= */}

      <View style={styles.header}>
        <Text style={GlobalStyles.headingLarge}>
          Adaptive Studio
        </Text>

        <Text style={styles.subtitle}>
          Your workout adapts to your energy, recovery and cycle.
        </Text>
      </View>

      {/* ================= TABS ================= */}

      <View style={styles.tabs}>

        {/* TODAY */}
        <Pressable
          style={[
            styles.tabButton,
            activeTab === 'today' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('today')}
        >
          <Ionicons
            name="today-outline"
            size={16}
            color={
              activeTab === 'today'
                ? Palette.oceanBlue
                : Palette.textSecondary
            }
          />

          <Text
            style={[
              styles.tabText,
              activeTab === 'today' && styles.tabTextActive,
            ]}
          >
            Today
          </Text>
        </Pressable>

        {/* NEXT 7 DAYS */}
        <Pressable
          style={[
            styles.tabButton,
            activeTab === 'next7' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('next7')}
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={
              activeTab === 'next7'
                ? Palette.oceanBlue
                : Palette.textSecondary
            }
          />

          <Text
            style={[
              styles.tabText,
              activeTab === 'next7' && styles.tabTextActive,
            ]}
          >
            Next 7 Days
          </Text>
        </Pressable>

        {/* HISTORY */}
        <Pressable
          style={[
            styles.tabButton,
            activeTab === 'history' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons
            name="time-outline"
            size={16}
            color={
              activeTab === 'history'
                ? Palette.oceanBlue
                : Palette.textSecondary
            }
          />

          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.tabTextActive,
            ]}
          >
            History
          </Text>
        </Pressable>

      </View>

      {/* ================= TAB CONTENT ================= */}

      {activeTab === 'today' && (
        <TodayWorkout />
      )}

      {activeTab === 'next7' && (
        <Next7DaysWorkout />
      )}

      {activeTab === 'history' && (
        <WorkoutHistory />
      )}

    </ScrollView>
  );
}