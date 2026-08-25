import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
  Header,
  CycleStatusCard,
  BiometricGrid,
  AnalyticsChart,
  SleepLogModal,
} from '../../components/home';

import { Sidebar } from '../../components/home/SideBar';
import { Palette, GlobalStyles } from '../../constants/Styles';
import { styles } from '../../components/home/styles';
import { aiService, AzukaDailyOutput, MOCK_DAILY_OUTPUT } from '../../services/aiService';
import { BiometricGridSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { ErrorCard } from '@/components/ui/StateFeedback';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export default function Home() {
  const navigation = useNavigation<any>();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMinimumWin, setIsMinimumWin] = useState(false);
  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [sleepHours, setSleepHours] = useState('7.5 hrs');
  
  // AI Bio-Adaptive State & Network Feedback
  const [dailyPlan, setDailyPlan] = useState<AzukaDailyOutput>(MOCK_DAILY_OUTPUT);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  // Fetch or update bio-adaptive daily plan from FastAPI backend
  const fetchLivePlan = useCallback(async (isPullToRefresh = false) => {
    try {
      if (isPullToRefresh) setRefreshing(true);
      else setLoading(true);
      setErrorMsg(null);

      // Attempt to load latest plan or profile from backend
      const plan = await aiService.getLatestDailyPlan('default_user');
      if (plan) {
        setDailyPlan(plan);
      }
    } catch (err: any) {
      console.warn('[Home] Failed to fetch live daily plan:', err);
      setErrorMsg('Could not reach backend engine. Showing cached bio-adaptive state.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanOnMount();
    async function fetchPlanOnMount() {
      await fetchLivePlan();
    }
  }, [fetchLivePlan]);

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

  // Handle saving sleep duration & check-in state to MongoDB
  const handleSaveSleep = async (hours: string) => {
    setSleepHours(hours);
    const parsedHours = parseFloat(hours.replace(/[^\d.]/g, '')) || 7.5;
    try {
      await aiService.logCheckIn({
        sleep_hours: parsedHours,
        sleep_quality: 'Restful',
        stress_level: isMinimumWin ? 'High' : 'Low',
        phase: 'Luteal',
        cycle_day: 22,
      }, 'default_user');
    } catch (e) {
      console.warn('Could not log sleep check-in:', e);
    }
  };

  // Extract Recovery & Readiness metrics from AzukaDailyOutput
  const recoveryMetrics = aiService.extractRecoveryMetrics(dailyPlan);

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
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchLivePlan(true)}
            tintColor={Palette.oceanBlue}
            colors={[Palette.oceanBlue]}
          />
        }
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

        {/* ERROR STATE BANNER */}
        {errorMsg && (
          <ErrorCard
            title="Backend Offline Notice"
            message={errorMsg}
            onRetry={() => fetchLivePlan(false)}
          />
        )}

        {/* 1. RECOVERY & READINESS & PHASE INSIGHT */}
        {loading ? (
          <View style={[GlobalStyles.cardElevated, { gap: 10 }]}>
            <Skeleton width="40%" height={24} borderRadius={12} />
            <Skeleton width="100%" height={16} />
            <Skeleton width="85%" height={16} />
          </View>
        ) : (
          <CycleStatusCard
            phase="Luteal"
            cycleDay={22}
            isMinimumWin={isMinimumWin}
            comment={recoveryMetrics.comment}
          />
        )}

        {/* 2. BIOMETRICS GRID (Extracts data from `overall`) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Biometric Stream</Text>
        </View>

        {loading ? (
          <BiometricGridSkeleton />
        ) : (
          <BiometricGrid
            onOpenSleepModal={() => setSleepModalVisible(true)}
            sleepHours={sleepHours}
            dailyRecoveryScore={recoveryMetrics.dailyRecoveryScore}
            stressLevel={recoveryMetrics.stressLevel}
            phaseEnergyScore={recoveryMetrics.phaseEnergyScore}
            strainOutputBalanceScore={recoveryMetrics.strainOutputBalanceScore}
          />
        )}

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
        onSave={handleSaveSleep}
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