import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Palette } from '@/constants/Styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = SCREEN_WIDTH * 0.75; // Menu takes 75% of screen width

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path as any);
  };

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        {/* Backdrop overlay (tapping outside closes menu) */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Sliding Menu Panel */}
        <Animated.View
          style={[
            styles.menuContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Text style={styles.menuTitle}>Profile & settings</Text>
          <Text style={styles.menuSubtitle}>Consistency • Recovery • Biology</Text>

          <Pressable style={styles.menuItem} onPress={() => handleNavigate('/(tabs)')}>
            <Text style={styles.menuText}>🏠 Home hub</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => handleNavigate('/notifications')}>
            <Text style={styles.menuText}>🔔 Biological notifications</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => handleNavigate('/profile-setup')}>
            <Text style={styles.menuText}>👤 Adjust strategy</Text>
          </Pressable>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Wearable integrations</Text>
            <Text style={styles.sectionText}>Apple Health • Health Connect: Active</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Research & foundation</Text>
            <Text style={styles.sectionText}>Ansdell et al., 2020 • Sex differences</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuContainer: {
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: Palette.surfaceWhite || '#FFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.oceanBlue || '#000',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderMuted || '#EFEFEF',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: Palette.textPrimary || '#333',
  },
  sectionCard: {
    backgroundColor: Palette.surfaceSubtle,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
});