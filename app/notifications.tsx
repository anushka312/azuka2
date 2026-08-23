import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Sparkles,
  HeartPulse,
  ShieldAlert,
  ChevronLeft,
  CheckCheck,
  Trash2,
  BellOff,
} from 'lucide-react-native';

import { Palette, GlobalStyles } from '@/constants/Styles';

interface NotificationItem {
  id: string;
  type: 'phase' | 'biometric' | 'alert';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'phase',
    title: 'Luteal Phase Transition',
    description:
      'Progesterone levels peaking. Caloric baseline and workout intensity auto-adjusted to minimum win mode.',
    time: '15m ago',
    read: false,
  },
  
  {
    id: '3',
    type: 'alert',
    title: 'Sleep Debt Accumulating',
    description:
      'Logged 6.5 hrs of sleep last night. Baseline recovery recommendation increased by 15%.',
    time: 'Yesterday',
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Action Handlers
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={GlobalStyles.screenContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <ChevronLeft size={22} color={Palette.textPrimary} />
        </Pressable>

        <View style={styles.titleWrapper}>
          <Text style={GlobalStyles.headingMedium}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {/* TOP RIGHT ACTIONS */}
        <View style={styles.actionGroup}>
          {notifications.length > 0 && (
            <>
              <Pressable
                onPress={handleMarkAllRead}
                style={styles.actionBtn}
                hitSlop={8}
                accessibilityLabel="Mark all as read"
              >
                <CheckCheck size={18} color={Palette.oceanBlue} />
              </Pressable>

              <Pressable
                onPress={handleClearAll}
                style={[styles.actionBtn, styles.clearBtn]}
                hitSlop={8}
                accessibilityLabel="Clear all notifications"
              >
                <Trash2 size={18} color={Palette.crimson} />
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* NOTIFICATIONS LIST / EMPTY STATE */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <BellOff size={32} color={Palette.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>
              You have no active biological alerts or engine notifications right now.
            </Text>
          </View>
        ) : (
          notifications.map(item => (
            <View
              key={item.id}
              style={[
                GlobalStyles.cardElevated,
                !item.read && styles.unreadCard,
                styles.cardLayout,
              ]}
            >
              {/* ICON TYPE BADGE */}
              <View
                style={[
                  styles.iconContainer,
                  item.type === 'phase' && { backgroundColor: Palette.surfaceGreenMuted },
                  item.type === 'biometric' && { backgroundColor: Palette.surfaceBlueMuted },
                  item.type === 'alert' && { backgroundColor: Palette.surfaceCrimsonMuted },
                ]}
              >
                {item.type === 'phase' && <Sparkles size={20} color={Palette.forestGreen} />}
                {item.type === 'biometric' && <HeartPulse size={20} color={Palette.oceanBlue} />}
                {item.type === 'alert' && <ShieldAlert size={20} color={Palette.crimson} />}
              </View>

              {/* CONTENT */}
              <View style={{ flex: 1 }}>
                <View style={styles.headerRow}>
                  <Text
                    style={[GlobalStyles.headingMedium, { fontSize: 15, flex: 1 }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={GlobalStyles.captionText}>{item.time}</Text>
                </View>

                <Text style={[GlobalStyles.bodyText, styles.descriptionText]}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: Palette.oceanBlue,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: Palette.surfaceWhite,
    fontSize: 11,
    fontWeight: '800',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceBlueMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: Palette.surfaceCrimsonMuted,
  },
  scrollContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  cardLayout: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 12,
  },
  unreadCard: {
    borderWidth: 1.5,
    borderColor: Palette.borderActiveBlue,
    backgroundColor: Palette.surfaceElevated,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  descriptionText: {
    marginTop: 6,
    fontSize: 13.5,
    color: Palette.textSecondary,
    lineHeight: 19,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Palette.surfaceWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});