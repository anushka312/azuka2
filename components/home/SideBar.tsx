import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette, GlobalStyles } from '../../constants/Styles';
import { styles } from './styles';

interface SidebarProps {
  visible: boolean;
  slideAnim: Animated.Value;
  onClose: () => void;
  sidebarWidth: number;
}

export default function Sidebar({
  visible,
  slideAnim,
  onClose,
  sidebarWidth,
}: SidebarProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.sidebarContainer,
            {
              width: sidebarWidth,
              transform: [
                {
                  translateX: slideAnim,
                },
              ],
            },
          ]}
        >
          <View style={styles.sidebarHeader}>
            <Text style={GlobalStyles.headingMedium}>
              Menu
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={Palette.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons
                name="home-outline"
                size={20}
                color={Palette.oceanBlue}
              />

              <Text style={styles.menuText}>
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons
                name="person-outline"
                size={20}
                color={Palette.textSecondary}
              />

              <Text style={styles.menuText}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={Palette.textSecondary}
              />

              <Text style={styles.menuText}>
                Settings
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              GlobalStyles.btnDestructive,
              styles.logoutBtn,
            ]}
            onPress={onClose}
          >
            <Text
              style={GlobalStyles.btnDestructiveText}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}