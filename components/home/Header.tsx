import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/Styles';
import { styles } from './styles';

type Props = {
  userName: string;
  onOpenSidebar: () => void;
  onOpenNotifications?: () => void;
};

export function Header({ userName, onOpenSidebar, onOpenNotifications }: Props) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.topBar}>
      <View style={styles.greetingSection}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onOpenSidebar}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={24} color={Palette.textPrimary} />
        </TouchableOpacity>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingSmall}>{getGreeting()}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={styles.iconBtn} 
          onPress={onOpenNotifications}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color={Palette.textPrimary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );
}