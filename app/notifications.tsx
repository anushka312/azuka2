import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  Moon,
  Activity,
  Utensils,
  HeartPulse,
} from 'lucide-react-native';

import { Palette, GlobalStyles } from '@/constants/Styles';

interface DailyReminder {
  id: string;
  title: string;
  description: string;
  type: 'sleep' | 'cycle' | 'activity' | 'food';
  completed: boolean;
}

const STORAGE_KEY = '@azuka_daily_reminders';

const createDailyReminders = (): DailyReminder[] => [
  {
    id: 'sleep',
    type: 'sleep',
    title: 'Log your sleep',
    description:
      'Tell Azuka how you slept so your recovery and training recommendations stay accurate.',
    completed: false,
  },
  {
    id: 'cycle',
    type: 'cycle',
    title: 'Log your cycle & symptoms',
    description:
      'Update your symptoms, energy, mood or period status to help Azuka understand your current biological state.',
    completed: false,
  },
  {
    id: 'activity',
    type: 'activity',
    title: "Log today's activity",
    description:
      'Record what you actually did today so Azuka can adapt your training recommendations.',
    completed: false,
  },
  {
    id: 'food',
    type: 'food',
    title: 'Log your meals',
    description:
      'Keep your nutrition signals up to date by logging what you ate today.',
    completed: false,
  },
];

const getTodayKey = () => {
  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

export default function NotificationsScreen() {
  const router = useRouter();

  const [reminders, setReminders] = useState<DailyReminder[]>(
    createDailyReminders()
  );

  const [todayKey, setTodayKey] = useState(getTodayKey());
  const [loading, setLoading] = useState(true);

  /*
   * ============================================================
   * LOAD TODAY'S SAVED REMINDERS
   * ============================================================
   */

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        const today = getTodayKey();

        if (!stored) {
          const freshReminders = createDailyReminders();

          setReminders(freshReminders);
          setTodayKey(today);

          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              date: today,
              completed: [],
            })
          );

          return;
        }

        const parsed = JSON.parse(stored);

        /*
         * Same day:
         * Restore whatever the user completed.
         */

        if (parsed.date === today) {
          const completedIds: string[] =
            parsed.completed || [];

          const restoredReminders =
            createDailyReminders().map(reminder => ({
              ...reminder,
              completed: completedIds.includes(
                reminder.id
              ),
            }));

          setReminders(restoredReminders);
          setTodayKey(today);
        }

        /*
         * New day:
         * Reset everything.
         */

        else {
          const freshReminders =
            createDailyReminders();

          setReminders(freshReminders);
          setTodayKey(today);

          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              date: today,
              completed: [],
            })
          );
        }
      } catch (error) {
        console.warn(
          '[Notifications] Failed to load reminders:',
          error
        );

        setReminders(createDailyReminders());
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, []);

  /*
   * ============================================================
   * SAVE REMINDERS
   * ============================================================
   */

  const saveReminders = async (
    updatedReminders: DailyReminder[]
  ) => {
    try {
      const completed = updatedReminders
        .filter(reminder => reminder.completed)
        .map(reminder => reminder.id);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          date: getTodayKey(),
          completed,
        })
      );
    } catch (error) {
      console.warn(
        '[Notifications] Failed to save reminders:',
        error
      );
    }
  };

  /*
   * ============================================================
   * TOGGLE REMINDER
   * ============================================================
   */

  const toggleReminder = async (id: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id
        ? {
            ...reminder,
            completed: !reminder.completed,
          }
        : reminder
    );

    setReminders(updatedReminders);

    await saveReminders(updatedReminders);
  };

  /*
   * ============================================================
   * MARK ALL COMPLETE
   * ============================================================
   */

  const markAllComplete = async () => {
    const updatedReminders = reminders.map(
      reminder => ({
        ...reminder,
        completed: true,
      })
    );

    setReminders(updatedReminders);

    await saveReminders(updatedReminders);
  };

  /*
   * ============================================================
   * ICON
   * ============================================================
   */

  const renderIcon = (
    type: DailyReminder['type']
  ) => {
    switch (type) {
      case 'sleep':
        return (
          <Moon
            size={21}
            color={Palette.oceanBlue}
          />
        );

      case 'cycle':
        return (
          <HeartPulse
            size={21}
            color={Palette.forestGreen}
          />
        );

      case 'activity':
        return (
          <Activity
            size={21}
            color={Palette.orange}
          />
        );

      case 'food':
        return (
          <Utensils
            size={21}
            color={Palette.crimson}
          />
        );

      default:
        return null;
    }
  };

  const completedCount = reminders.filter(
    reminder => reminder.completed
  ).length;

  const allCompleted =
    reminders.length > 0 &&
    completedCount === reminders.length;

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  if (loading) {
    return (
      <SafeAreaView
        style={GlobalStyles.screenContainer}
      >
        <Stack.Screen
          options={{ headerShown: false }}
        />

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Loading today's reminders...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={GlobalStyles.screenContainer}
    >
      <Stack.Screen
        options={{ headerShown: false }}
      />

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10}
        >
          <ChevronLeft
            size={22}
            color={Palette.textPrimary}
          />
        </Pressable>

        <Text style={GlobalStyles.headingMedium}>
          Today's Reminders
        </Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <View style={styles.dailyHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dateText}>
              {getFormattedDate()}
            </Text>

            <Text style={styles.headerTitle}>
              Keep Azuka updated
            </Text>

            <Text style={styles.headerSubtitle}>
              A few quick check-ins help Azuka make
              better decisions for you throughout the day.
            </Text>
          </View>

          <View style={styles.progressCircle}>
            <Text style={styles.progressNumber}>
              {completedCount}/{reminders.length}
            </Text>
          </View>
        </View>

        {/* =====================================================
            PROGRESS
        ====================================================== */}

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Today's progress
            </Text>

            <Text style={styles.progressCount}>
              {completedCount} of {reminders.length}
              {' '}completed
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    reminders.length === 0
                      ? 0
                      : (completedCount /
                          reminders.length) *
                        100
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        {/* =====================================================
            MARK ALL
        ====================================================== */}

        {!allCompleted && (
          <Pressable
            onPress={markAllComplete}
            style={styles.markAllButton}
          >
            <CheckCircle2
              size={17}
              color={Palette.oceanBlue}
            />

            <Text style={styles.markAllText}>
              Mark all as complete
            </Text>
          </Pressable>
        )}

        {/* =====================================================
            REMINDERS
        ====================================================== */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Daily check-ins
          </Text>

          <Text style={styles.sectionSubtitle}>
            These reset each day
          </Text>
        </View>

        {reminders.map(reminder => (
          <Pressable
            key={reminder.id}
            onPress={() =>
              toggleReminder(reminder.id)
            }
            style={[
              styles.reminderCard,
              reminder.completed &&
                styles.reminderCardCompleted,
            ]}
          >
            {/* ICON */}

            <View
              style={[
                styles.iconContainer,
                reminder.completed &&
                  styles.iconContainerCompleted,
              ]}
            >
              {renderIcon(reminder.type)}
            </View>

            {/* CONTENT */}

            <View style={styles.reminderContent}>
              <Text
                style={[
                  styles.reminderTitle,
                  reminder.completed &&
                    styles.reminderTitleCompleted,
                ]}
              >
                {reminder.title}
              </Text>

              <Text
                style={[
                  styles.reminderDescription,
                  reminder.completed &&
                    styles.reminderDescriptionCompleted,
                ]}
              >
                {reminder.description}
              </Text>
            </View>

            {/* CHECK */}

            <View style={styles.checkContainer}>
              {reminder.completed ? (
                <CheckCircle2
                  size={25}
                  color={Palette.forestGreen}
                />
              ) : (
                <Circle
                  size={25}
                  color={Palette.textMuted}
                />
              )}
            </View>
          </Pressable>
        ))}

        {/* =====================================================
            COMPLETE MESSAGE
        ====================================================== */}

        {allCompleted && (
          <View style={styles.completedBanner}>
            <CheckCircle2
              size={25}
              color={Palette.forestGreen}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.completedTitle}>
                You're all caught up! 🎉
              </Text>

              <Text style={styles.completedText}>
                You've completed today's Azuka check-ins.
                They'll reset automatically tomorrow.
              </Text>
            </View>
          </View>
        )}

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Azuka uses these daily signals to continuously
            adapt your recommendations.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 14,
    color: Palette.textSecondary,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  scrollContent: {
    paddingVertical: 12,
    paddingBottom: 40,
  },

  dailyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    gap: 15,
  },

  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.oceanBlue,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 6,
  },

  headerSubtitle: {
    fontSize: 13.5,
    color: Palette.textSecondary,
    lineHeight: 19,
  },

  progressCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Palette.surfaceBlueMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderActiveBlue,
  },

  progressNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.oceanBlue,
  },

  progressContainer: {
    marginBottom: 14,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },

  progressCount: {
    fontSize: 12,
    color: Palette.textSecondary,
  },

  progressTrack: {
    height: 7,
    borderRadius: 5,
    backgroundColor: Palette.surfaceBlueMuted,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: Palette.oceanBlue,
  },

  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  markAllText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Palette.oceanBlue,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },

  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    marginBottom: 11,
    borderRadius: 16,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  reminderCardCompleted: {
    opacity: 0.68,
    backgroundColor: Palette.surfaceElevated,
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: Palette.surfaceBlueMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainerCompleted: {
    backgroundColor: Palette.surfaceGreenMuted,
  },

  reminderContent: {
    flex: 1,
  },

  reminderTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 4,
  },

  reminderTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Palette.textSecondary,
  },

  reminderDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Palette.textSecondary,
  },

  reminderDescriptionCompleted: {
    color: Palette.textMuted,
  },

  checkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 16,
    backgroundColor: Palette.surfaceGreenMuted,
    borderWidth: 1,
    borderColor: Palette.forestGreen,
  },

  completedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.forestGreen,
    marginBottom: 3,
  },

  completedText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Palette.textSecondary,
  },

  footer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: Palette.textMuted,
    textAlign: 'center',
  },
});