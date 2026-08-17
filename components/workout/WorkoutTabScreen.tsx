import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { styles } from './workoutStyles';

import TodayWorkout from './TodayWorkout';
import Next7DaysWorkout from './Next7DaysWorkout';
import WorkoutHistory from './WorkoutHistory';

type Tab = 'today' | 'next7' | 'history';

export default function WorkoutTabScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('today');

  return (
    <ScrollView
      style={GlobalStyles.screenContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={GlobalStyles.headingLarge}>Workout</Text>
        <Text style={styles.subtitle}>
          Phase-adapted training
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TabButton
          label="Today"
          icon="today-outline"
          active={activeTab === 'today'}
          onPress={() => setActiveTab('today')}
        />

        <TabButton
          label="Next 7 Days"
          icon="calendar-outline"
          active={activeTab === 'next7'}
          onPress={() => setActiveTab('next7')}
        />

        <TabButton
          label="History"
          icon="time-outline"
          active={activeTab === 'history'}
          onPress={() => setActiveTab('history')}
        />
      </View>

      {/* Content */}
      {activeTab === 'today' && <TodayWorkout />}
      {activeTab === 'next7' && <Next7DaysWorkout />}
      {activeTab === 'history' && <WorkoutHistory />}
    </ScrollView>
  );
}

type TabButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
};

function TabButton({
  label,
  icon,
  active,
  onPress,
}: TabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabButton,
        active && styles.tabButtonActive,
      ]}
    >
      <Ionicons
        name={icon}
        size={15}
        color={
          active
            ? Palette.oceanBlue
            : Palette.textSecondary
        }
      />

      <Text
        style={[
          styles.tabText,
          active && styles.tabTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}