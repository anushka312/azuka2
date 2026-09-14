import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/Styles';
import { styles } from './styles';

type Props = {
  isMinimumWin: boolean;
  onToggle: () => void;
};

export function MinimumWinToggle({ isMinimumWin, onToggle }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.minimumWinToggle,
        isMinimumWin && styles.minimumWinToggleActive,
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <Ionicons
        name={isMinimumWin ? 'checkmark-circle' : 'shield-outline'}
        size={15}
        color={isMinimumWin ? Palette.surfaceWhite : Palette.textSecondary}
      />
      <Text
        style={[
          styles.minimumWinText,
          isMinimumWin && styles.minimumWinTextActive,
        ]}
      >
        MinWin
      </Text>
    </TouchableOpacity>
  );
}