import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// 1. Correct import path (removed extra "-navigation")
import { useNavigation } from '@react-navigation/native';

import {
  Header,
  MinimumWinToggle,
  CycleStatusCard,
  BiometricGrid,
  AnalyticsChart,
  SleepLogModal,
} from '../../components/home';

import { Sidebar } from '../../components/home/SideBar';
import { Palette, GlobalStyles } from '../../constants/Styles';
import { styles } from '../../components/home/styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export default function Home() {
  // 2. Call useNavigation INSIDE the component function
  const navigation = useNavigation<any>();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMinimumWin, setIsMinimumWin] = useState(false);
  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [sleepHours, setSleepHours] = useState('6.5 hrs');

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const toggleMinimumWin = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMinimumWin(prev => !prev);
  };

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSidebarVisible(false));
  };

  return (
    <SafeAreaView
      style={[
        GlobalStyles.screenContainer,
        styles.screenContainer,
        {
          backgroundColor: isMinimumWin
            ? Palette.surfaceCrimsonMuted
            : Palette.cream,
        },
      ]}
    >
      <Header
        userName="Anushka"
        onOpenSidebar={openSidebar}
        onOpenNotifications={() => navigation.navigate('notifications')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* CYCLE & DECISION ENGINE HEADER */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: Palette.crimson, fontSize: 26 }]}>
              Biological Decision Loop
            </Text>
            <Text style={styles.sectionSubtitle}>
              Real-time recalculation from active signals
            </Text>
          </View>
        </View>

        <CycleStatusCard
          phase="Luteal"
          cycleDay={22}
          isMinimumWin={isMinimumWin}
        />

        {/* BIOMETRICS GRID */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Biometric Stream</Text>
        </View>

        <BiometricGrid
          onOpenSleepModal={() => setSleepModalVisible(true)}
          sleepHours={sleepHours}
          hrvValue={58}
          cortisolRisk={isMinimumWin ? 'High' : 'Moderate'}
        />

        {/* ANALYTICS CHART */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nervous State Trends</Text>
        </View>

        <AnalyticsChart />
      </ScrollView>

      {/* MODALS & SIDEBAR */}
      <SleepLogModal
        visible={sleepModalVisible}
        onClose={() => setSleepModalVisible(false)}
        onSave={hours => setSleepHours(hours)}
      />

      <Sidebar
        visible={sidebarVisible}
        slideAnim={slideAnim}
        onClose={closeSidebar}
        sidebarWidth={SIDEBAR_WIDTH}
      />
    </SafeAreaView>
  );
}