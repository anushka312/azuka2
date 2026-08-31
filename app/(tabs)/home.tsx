import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  Dimensions,
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

import {
  aiService,
  AzukaDailyOutput,
  MOCK_DAILY_OUTPUT,
} from '../../services/aiService';

import {
  BiometricGridSkeleton,
  Skeleton,
} from '@/components/ui/Skeleton';

import { ErrorCard } from '@/components/ui/StateFeedback';

// ============================================================
// AZUKA CONTEXT
// ============================================================

import { useAzuka } from '../../contexts/AzukaContext';


// ============================================================
// ANDROID LAYOUT ANIMATION
// ============================================================

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


// ============================================================
// CONSTANTS
// ============================================================

const { width } = Dimensions.get('window');

const SIDEBAR_WIDTH = width * 0.75;


// ============================================================
// HOME
// ============================================================

export default function Home() {

  const navigation = useNavigation<any>();


  // ==========================================================
  // AZUKA CONTEXT
  // ==========================================================

  const { userProfile } = useAzuka();

  console.log("HOME USER PROFILE:", userProfile);
  console.log("HOME USER NAME:", userProfile?.name);


  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [sidebarVisible, setSidebarVisible] =
    useState(false);

  const [isMinimumWin, setIsMinimumWin] =
    useState(false);

  const [sleepModalVisible, setSleepModalVisible] =
    useState(false);

  const [sleepHours, setSleepHours] =
    useState('7.5 hrs');


  // ==========================================================
  // MOCK DAILY PLAN
  // ==========================================================

  const [dailyPlan, setDailyPlan] =
    useState<AzukaDailyOutput>(
      MOCK_DAILY_OUTPUT
    );

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);


  // ==========================================================
  // SIDEBAR ANIMATION
  // ==========================================================

  const slideAnim = useRef(
    new Animated.Value(-SIDEBAR_WIDTH)
  ).current;


  // ==========================================================
  // LOAD MOCK PLAN
  // ==========================================================

  const fetchLivePlan = useCallback(
    async (isPullToRefresh = false) => {

      try {

        if (isPullToRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setErrorMsg(null);


        /*
         * API testing is being skipped for now.
         *
         * We use MOCK_DAILY_OUTPUT so the UI can be developed
         * independently of the backend.
         */

        setDailyPlan(
          MOCK_DAILY_OUTPUT
        );


        // Small delay so loading states can still be seen.
        await new Promise(resolve =>
          setTimeout(resolve, 300)
        );

      } catch (error) {

        console.warn(
          '[Home] Failed to load daily plan:',
          error
        );


        // Always fall back to mock data.

        setDailyPlan(
          MOCK_DAILY_OUTPUT
        );

        setErrorMsg(
          'Using mock bio-adaptive data while the backend is unavailable.'
        );

      } finally {

        setLoading(false);
        setRefreshing(false);

      }

    },
    []
  );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    fetchLivePlan();

  }, [fetchLivePlan]);


  // ==========================================================
  // SIDEBAR
  // ==========================================================

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

    }).start(() => {

      setSidebarVisible(false);

    });

  };


  // ==========================================================
  // SAVE SLEEP
  // ==========================================================

  const handleSaveSleep = async (
    hours: string
  ) => {

    setSleepHours(hours);


    const parsedHours =
      parseFloat(
        hours.replace(/[^\d.]/g, '')
      ) || 7.5;


    /*
     * Backend logging can stay here.
     *
     * This doesn't affect the Home screen's mock plan.
     */

    try {

      await aiService.logCheckIn(

        {
          sleep_hours: parsedHours,
          sleep_quality: 'Restful',
          stress_level:
            isMinimumWin
              ? 'High'
              : 'Low',
          phase: 'Luteal',
          cycle_day: 22,
        },

        'default_user'

      );

    } catch (error) {

      console.warn(
        '[Home] Could not log sleep check-in:',
        error
      );

    }

  };


  // ==========================================================
  // EXTRACT MOCK DATA
  // ==========================================================

  const recoveryMetrics =
    aiService.extractRecoveryMetrics(
      dailyPlan
    );


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <SafeAreaView
      style={[
        GlobalStyles.screenContainer,
        styles.screenContainer,
        {
          backgroundColor:
            isMinimumWin
              ? Palette.surfaceCrimsonMuted
              : Palette.cream,
        },
      ]}
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Header
        userName={
          userProfile?.name ?? 'User'
        }

        onOpenSidebar={
          openSidebar
        }

        onOpenNotifications={() =>
          navigation.navigate(
            'notifications'
          )
        }
      />


      <ScrollView

        showsVerticalScrollIndicator={false}

        contentContainerStyle={{
          paddingBottom: 30,
        }}

        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={() =>
              fetchLivePlan(true)
            }

            tintColor={
              Palette.oceanBlue
            }

            colors={[
              Palette.oceanBlue,
            ]}

          />

        }

      >

        {/* =====================================================
            HEADER
        ====================================================== */}

        <View
          style={styles.sectionHeader}
        >

          <View>

            <Text
              style={[
                styles.sectionTitle,
                {
                  color: Palette.crimson,
                  fontSize: 26,
                },
              ]}
            >
              Biological Decision Loop
            </Text>

            <Text
              style={styles.sectionSubtitle}
            >
              Real-time recalculation from active signals
            </Text>

          </View>

        </View>


        {/* =====================================================
            MOCK DATA NOTICE
        ====================================================== */}

        {errorMsg && (

          <ErrorCard
            title="Backend Offline Notice"
            message={errorMsg}
            onRetry={() =>
              fetchLivePlan(false)
            }
          />

        )}


        {/* =====================================================
            1. CYCLE STATUS
        ====================================================== */}

        {loading ? (

          <View
            style={[
              GlobalStyles.cardElevated,
              {
                gap: 10,
              },
            ]}
          >

            <Skeleton
              width="40%"
              height={24}
              borderRadius={12}
            />

            <Skeleton
              width="100%"
              height={16}
            />

            <Skeleton
              width="85%"
              height={16}
            />

          </View>

        ) : (

          <CycleStatusCard
            phase="Luteal"
            cycleDay={22}
            isMinimumWin={
              isMinimumWin
            }
            comment={
              recoveryMetrics.comment
            }
          />

        )}


        {/* =====================================================
            2. BIOMETRIC STREAM
        ====================================================== */}

        <View
          style={styles.sectionHeader}
        >

          <Text
            style={styles.sectionTitle}
          >
            Biometric Stream
          </Text>

        </View>


        {loading ? (

          <BiometricGridSkeleton />

        ) : (

          <BiometricGrid

            onOpenSleepModal={() =>
              setSleepModalVisible(
                true
              )
            }

            sleepHours={
              sleepHours
            }

            dailyRecoveryScore={
              recoveryMetrics.dailyRecoveryScore
            }

            stressLevel={
              recoveryMetrics.stressLevel
            }

            phaseEnergyScore={
              recoveryMetrics.phaseEnergyScore
            }

            strainOutputBalanceScore={
              recoveryMetrics.strainOutputBalanceScore
            }

          />

        )}


        {/* =====================================================
            3. ANALYTICS
        ====================================================== */}

        <View
          style={styles.sectionHeader}
        >

          <Text
            style={styles.sectionTitle}
          >
            Nervous State Trends
          </Text>

        </View>


        <AnalyticsChart />

      </ScrollView>


      {/* =======================================================
          SLEEP MODAL
      ======================================================== */}

      <SleepLogModal

        visible={
          sleepModalVisible
        }

        onClose={() =>
          setSleepModalVisible(
            false
          )
        }

        onSave={
          handleSaveSleep
        }

      />


      {/* =======================================================
          SIDEBAR
      ======================================================== */}

      <Sidebar

        visible={
          sidebarVisible
        }

        slideAnim={
          slideAnim
        }

        onClose={
          closeSidebar
        }

        sidebarWidth={
          SIDEBAR_WIDTH
        }

      />

    </SafeAreaView>

  );
}