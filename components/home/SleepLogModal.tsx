import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/Styles';
import { styles } from './styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (hours: string) => void;
};

export function SleepLogModal({ visible, onClose, onSave }: Props) {
  const [selectedHours, setSelectedHours] = useState('7.5 hrs');
  const [quality, setQuality] = useState('Restful');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />

          <Text style={styles.modalTitle}>Log Recovery & Sleep</Text>
          <Text style={styles.modalSubtitle}>
            Feeds Tier 1 Nervous System Interpreter to auto-scale daily volume.
          </Text>

          {/* DURATION */}
          <View style={styles.selectorGroup}>
            <Text style={styles.fieldLabel}>Sleep Duration</Text>
            <View style={styles.chipRow}>
              {['< 6 hrs', '6-7 hrs', '7.5 hrs', '8+ hrs'].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[styles.chipOption, selectedHours === val && styles.chipOptionSelected]}
                  onPress={() => setSelectedHours(val)}
                >
                  <Text style={[styles.chipText, selectedHours === val && styles.chipTextSelected]}>
                    {val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* QUALITY */}
          <View style={styles.selectorGroup}>
            <Text style={styles.fieldLabel}>Perceived Quality</Text>
            <View style={styles.chipRow}>
              {['Restless', 'Fair', 'Restful'].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[styles.chipOption, quality === val && styles.chipOptionSelected]}
                  onPress={() => setQuality(val)}
                >
                  <Text style={[styles.chipText, quality === val && styles.chipTextSelected]}>
                    {val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onSave(selectedHours);
              onClose();
            }}
          >
            <Text style={styles.saveButtonText}>Recalculate Decision Loop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}