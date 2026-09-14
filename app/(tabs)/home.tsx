
import React, {
  useState,
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

import {
  Palette,
  GlobalStyles,
} from '../../constants/Styles';

import { styles } from '../../components/home/styles';

import { aiService } from '../../services/aiService';

import {
  BiometricGridSkeleton,
  Skeleton,
} from '@/components/ui/Skeleton';

import { ErrorCard } from '@/components/ui/StateFeedback';

// ============================================================
// AZUKA CONTEXT
// ============================================================

import {
  useAzuka,
  calculateCurrentCycle,
} from '../../contexts/AzukaContext';

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

  const {
    userProfile,
    dailyState,
    dailyScore,
    latestCycle,
    isLoading: azukaLoading,
    isGeneratingPlan,
    error: azukaError,
    refreshData,
    saveDailyCheckIn
  } = useAzuka();

  // ==========================================================
  // DEBUG
  // ==========================================================

  console.log('================ HOME =================');

  console.log(
    'HOME USER PROFILE:',
    userProfile
  );

  console.log(
    'HOME USER NAME:',
    userProfile?.name
  );

  console.log(
    'HOME DAILY STATE:',
    dailyState
  );

  console.log(
    'HOME DAILY SCORE:',
    dailyScore
  );

  console.log(
    'HOME LATEST CYCLE:',
    latestCycle
  );

  console.log(
    'HOME DAILY STATE USER ID:',
    dailyState?.user_id
  );

  console.log(
    '========================================'
  );

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [sidebarVisible, setSidebarVisible] =
    useState(false);

  const [isMinimumWin, setIsMinimumWin] =
    useState(false);

  const [sleepModalVisible, setSleepModalVisible] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const loading =
    azukaLoading || isGeneratingPlan;

  // ==========================================================
  // REFRESH
  // ==========================================================

  const onRefresh = useCallback(
    async () => {
      setRefreshing(true);

      try {
        await refreshData();
      } finally {
        setRefreshing(false);
      }
    },
    [refreshData]
  );

  // ==========================================================
  // SIDEBAR ANIMATION
  // ==========================================================

  const slideAnim = useRef(
    new Animated.Value(-SIDEBAR_WIDTH)
  ).current;

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

// ==========================================================
// SAVE SLEEP
// ==========================================================

const handleSaveSleep = async (
  hours: string
) => {
  const parsedHours =
    parseFloat(
      hours.replace(/[^\d.]/g, '')
    );

  if (
    !Number.isFinite(parsedHours)
  ) {
    console.warn(
      '[Home] Invalid sleep hours:',
      hours
    );

    return;
  }

  try {
    console.log(
      '========================================'
    );

    console.log(
      '[Home] SAVING SLEEP'
    );

    console.log(
      '[Home] Sleep hours:',
      parsedHours
    );

    console.log(
      '[Home] Current daily state:',
      dailyState
    );

    console.log(
      '========================================'
    );

    // --------------------------------------------------------
    // IMPORTANT:
    //
    // Sleep belongs to DailyState.
    //
    // We use AzukaContext.saveDailyCheckIn() instead of
    // aiService.logCheckIn().
    //
    // This means:
    //
    // 1. MongoDB user ID comes from AuthContext through
    //    AzukaContext.
    //
    // 2. A DailyState does NOT need to already exist.
    //
    // 3. Existing DailyState is updated.
    //
    // 4. Missing DailyState is created.
    //
    // 5. Cycle day + phase are calculated centrally by
    //    AzukaContext.
    // --------------------------------------------------------

    await saveDailyCheckIn({
      sleep: {
        sleep_hours: parsedHours,
        quality: 'Restful',
      },
    });

    console.log(
      '[Home] Sleep saved successfully.'
    );

    // --------------------------------------------------------
    // Reload all Home data.
    //
    // This makes:
    //
    // sleepHours
    // dailyRecoveryScore
    // stressLevel
    // phaseEnergyScore
    // strainOutputBalanceScore
    // daily guidance
    //
    // come from the latest backend state.
    // --------------------------------------------------------

    await refreshData();

    setSleepModalVisible(false);

  } catch (error) {
    console.warn(
      '[Home] Could not log sleep check-in:',
      error
    );
  }
};

  // ==========================================================
  // CURRENT CYCLE
  // ==========================================================

  /*
   * DailyState does NOT need to contain phase.
   *
   * We calculate today's cycle day and phase
   * from the latest cycle history.
   */

  const currentCycle =
    latestCycle
      ? calculateCurrentCycle(
        latestCycle
      )
      : null;

  const currentPhase =
    currentCycle?.phase;

  const currentCycleDay =
    currentCycle?.cycleDay;

  // ==========================================================
  // DAILY GUIDANCE
  // ==========================================================

  /*
   * Prefer the AI-generated DailyScore comment.
   *
   * If it isn't available, use the comment stored
   * on DailyState.
   *
   * We deliberately do NOT insert fake biological
   * guidance here.
   */

  const recoveryComment =
    dailyScore?.comment ??
    dailyState?.comment ??
    '';

  // ==========================================================
  // BIOMETRIC STREAM
  // ==========================================================

  /*
   * Recovery metrics come from DailyScore.
   *
   * There are NO fake fallback values.
   */

  const dailyRecoveryScore =
    dailyScore?.daily_recovery_score;

  const stressLevel =
    dailyScore?.stress_level;

  const phaseEnergyScore =
    dailyScore?.phase_energy_score;

  const strainOutputBalanceScore =
    dailyScore?.strain_output_balance_score;

  /*
   * Sleep belongs to DailyState.
   *
   * It is available here if Home needs it,
   * but it is NOT passed to BiometricGrid
   * because BiometricGrid's Props does not
   * currently define a sleepHours prop.
   */

  const sleepHours =
    dailyState?.sleep?.sleep_hours;

  console.log(
    'HOME BIOMETRIC DATA:',
    {
      sleepHours,
      dailyRecoveryScore,
      stressLevel,
      phaseEnergyScore,
      strainOutputBalanceScore,
    }
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
          userProfile?.name ??
          'User'
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

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingBottom: 30,
        }}

        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }

            onRefresh={
              onRefresh
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

        {/* ===================================================
            BIOLOGICAL DECISION LOOP
        ==================================================== */}

        <View
          style={
            styles.sectionHeader
          }
        >

          <View>

            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    Palette.crimson,
                  fontSize: 26,
                },
              ]}
            >
              Biological Decision Loop
            </Text>

            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Real-time recalculation from active signals
            </Text>

          </View>

        </View>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {azukaError && (
          <ErrorCard
            title="Notice"
            message={
              azukaError
            }
            onRetry={
              onRefresh
            }
          />
        )}

        {/* ===================================================
            1. CYCLE STATUS / DAILY GUIDANCE
        ==================================================== */}

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

            /*
             * Phase is calculated from latestCycle.
             * It is NOT read from DailyState.
             */
            phase={
              currentPhase
            }

            cycleDay={
              currentCycleDay
            }

            isMinimumWin={
              isMinimumWin
            }

            /*
             * Daily Guidance comes from
             * the actual DailyScore / DailyState.
             */
            comment={
              recoveryComment
            }

          />

        )}

        {/* ===================================================
            2. BIOMETRIC STREAM
        ==================================================== */}

        <View
          style={
            styles.sectionHeader
          }
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            Biometric Stream
          </Text>

        </View>

        {loading ? (

          <BiometricGridSkeleton />

        ) : (

          <BiometricGrid
            onOpenSleepModal={() =>
              setSleepModalVisible(true)
            }
            sleepHours={sleepHours}
            dailyRecoveryScore={dailyRecoveryScore}
            stressLevel={stressLevel}
            phaseEnergyScore={phaseEnergyScore}
            strainOutputBalanceScore={strainOutputBalanceScore}
          />

        )}

        {/* ===================================================
            3. ANALYTICS
        ==================================================== */}

        <View
          style={
            styles.sectionHeader
          }
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            Nervous State Trends
          </Text>

        </View>

        <AnalyticsChart />

      </ScrollView>

      {/* =====================================================
          SLEEP MODAL
      ====================================================== */}

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

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

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

