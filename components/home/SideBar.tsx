import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Palette } from '../../constants/Styles';

type Props = {
  visible: boolean;
  slideAnim: Animated.Value;
  onClose: () => void;
  sidebarWidth: number;
};

type MenuItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  badge?: string;
};

// Mapped exclusively to existing routes in your Expo Router app directory
const MENU_ITEMS: MenuItem[] = [
  { id: 'home', label: 'Home Dashboard', icon: 'grid-outline', route: '/(tabs)/home' },
  { id: 'cycle', label: 'Cycle & Hormones', icon: 'water-outline', route: '/(tabs)/cycle' },
  { id: 'fuel', label: 'Fuel & Nutrition', icon: 'nutrition-outline', route: '/(tabs)/fuel' },
  { id: 'workout', label: 'Adaptive Workouts', icon: 'fitness-outline', route: '/(tabs)/workout' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline', route: 'notifications', badge: 'New' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', route: 'settings' },
];

export function Sidebar({ visible, slideAnim, onClose, sidebarWidth }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  if (!visible) return null;

  const handleNavigate = (route: string) => {
    onClose();
    // Allow animation to clean up before triggering navigation
    setTimeout(() => {
      router.push(route as any);
    }, 200);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      router.replace('/');
    }, 200);
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <View style={sidebarStyles.container}>
        {/* BACKDROP */}
        <Pressable style={sidebarStyles.backdrop} onPress={onClose} />

        {/* SLIDING PANEL */}
        <Animated.View
          style={[
            sidebarStyles.panel,
            {
              width: sidebarWidth,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View>
            {/* USER HEADER */}
            <View style={sidebarStyles.header}>
              <View style={sidebarStyles.avatar}>
                <Text style={sidebarStyles.avatarText}>A</Text>
              </View>
              <View style={sidebarStyles.userInfo}>
                <Text style={sidebarStyles.userName}>Anushka</Text>
                <Text style={sidebarStyles.userRole}>Luteal Phase • Day 22</Text>
              </View>
              <TouchableOpacity style={sidebarStyles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color={Palette.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* NAVIGATION LINKS */}
            <View style={sidebarStyles.menuContainer}>
              {MENU_ITEMS.map(item => {
                const isActive = pathname.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      sidebarStyles.menuItem,
                      isActive && sidebarStyles.menuItemActive,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleNavigate(item.route)}
                  >
                    <View style={sidebarStyles.menuItemLeft}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={isActive ? Palette.oceanBlue : Palette.textPrimary}
                      />
                      <Text
                        style={[
                          sidebarStyles.menuItemText,
                          isActive && sidebarStyles.menuItemTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    {item.badge && (
                      <View style={sidebarStyles.badge}>
                        <Text style={sidebarStyles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* FOOTER */}
          <View style={sidebarStyles.footer}>
            <View style={sidebarStyles.statusIndicator}>
              <View style={sidebarStyles.statusDot} />
              <Text style={sidebarStyles.statusText}>Engine Active (Tier 4)</Text>
            </View>

            <TouchableOpacity
              style={sidebarStyles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={18} color={Palette.crimson} />
              <Text style={sidebarStyles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const sidebarStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 25, 15, 0.4)',
  },
  panel: {
    height: '100%',
    backgroundColor: Palette.creamLight,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderColor: Palette.borderSubtle,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.oceanBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Palette.surfaceWhite,
    fontSize: 18,
    fontWeight: '800',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  userRole: {
    fontSize: 11,
    color: Palette.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  menuContainer: {
    marginTop: 20,
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  menuItemActive: {
    backgroundColor: Palette.surfaceBlueMuted,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  menuItemTextActive: {
    color: Palette.oceanBlue,
  },
  badge: {
    backgroundColor: Palette.surfaceCrimsonMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.crimson,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.crimson,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    gap: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.forestGreen,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.crimson,
  },
});