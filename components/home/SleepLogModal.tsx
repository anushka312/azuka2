
import React, { useState } from 'react';

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import { styles } from './styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (hours: string) => void;
};

const SLEEP_OPTIONS = [
  '< 6 hrs',
  '6-7 hrs',
  '7.5 hrs',
  '8+ hrs',
];

export function SleepLogModal({
  visible,
  onClose,
  onSave,
}: Props) {
  const [selectedHours, setSelectedHours] =
    useState('7.5 hrs');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>

        {/* Close modal when tapping outside */}
        <Pressable
          style={{ flex: 1 }}
          onPress={onClose}
        />

        <View style={styles.modalContent}>

          <View style={styles.modalHandle} />

          <Text style={styles.modalTitle}>
            Log Sleep
          </Text>

          <Text style={styles.modalSubtitle}>
            Your sleep duration helps Azuka assess
            recovery capacity and daily training load.
          </Text>

          {/* =====================================================
              SLEEP DURATION
              ===================================================== */}

          <View style={styles.selectorGroup}>
            <Text style={styles.fieldLabel}>
              Sleep Duration
            </Text>

            <View style={styles.chipRow}>
              {SLEEP_OPTIONS.map((value) => {
                const selected =
                  selectedHours === value;

                return (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.chipOption,
                      selected &&
                        styles.chipOptionSelected,
                    ]}
                    onPress={() =>
                      setSelectedHours(value)
                    }
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* =====================================================
              SAVE
              ===================================================== */}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              onSave(selectedHours);
              onClose();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              Log Sleep
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

