import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette } from '@/constants/Styles';
import { Activity } from './TodayWorkout';
import { styles } from './workoutStyles';

type Props = {
  visible: boolean;
  selectedActivities: Activity[];
  onClose: () => void;
  onSave: (activities: Activity[]) => void;
};

const activityOptions: Activity[] = [
  {
    id: 'walking',
    name: 'Walking',
    icon: 'walk-outline',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    icon: 'body-outline',
  },
  {
    id: 'stretching',
    name: 'Stretching',
    icon: 'accessibility-outline',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: 'bicycle-outline',
  },
  {
    id: 'running',
    name: 'Running',
    icon: 'speedometer-outline',
  },
  {
    id: 'strength',
    name: 'Strength training',
    icon: 'barbell-outline',
  },
  {
    id: 'pilates',
    name: 'Pilates',
    icon: 'fitness-outline',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    icon: 'water-outline',
  },
  {
    id: 'dance',
    name: 'Dance',
    icon: 'musical-notes-outline',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    icon: 'leaf-outline',
  },
];

export default function ActivityPickerModal({
  visible,
  selectedActivities,
  onClose,
  onSave,
}: Props) {
  const [selected, setSelected] = useState<Activity[]>([]);
  const [customActivity, setCustomActivity] = useState('');

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      setSelected(selectedActivities);
      setCustomActivity('');

      backdropOpacity.setValue(0);
      sheetY.setValue(600);

      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(sheetY, {
          toValue: 0,
          damping: 22,
          stiffness: 180,
          mass: 0.8,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [
    visible,
    selectedActivities,
    backdropOpacity,
    sheetY,
  ]);

  const isSelected = (id: string) => {
    return selected.some(activity => activity.id === id);
  };

  const toggleActivity = (activity: Activity) => {
    setSelected(prev => {
      if (prev.some(item => item.id === activity.id)) {
        return prev.filter(item => item.id !== activity.id);
      }

      return [...prev, activity];
    });
  };

  const addCustom = () => {
    const trimmed = customActivity.trim();

    if (!trimmed) return;

    const custom: Activity = {
      id: `custom-${Date.now()}`,
      name: trimmed,
      icon: 'create-outline',
    };

    setSelected(prev => [...prev, custom]);
    setCustomActivity('');
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.modalOverlay,
            {
              opacity: backdropOpacity,
            },
          ]}
        />

        <Pressable
          style={styles.modalTouchArea}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.activityModal,
            {
              transform: [{ translateY: sheetY }],
            },
          ]}
        >
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                Add activities
              </Text>

              <Text style={styles.modalSubtitle}>
                Select everything you did today.
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={21}
                color={Palette.textSecondary}
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ACTIVITY OPTIONS */}
            <View style={styles.activityGrid}>
              {activityOptions.map(activity => {
                const active = isSelected(activity.id);

                return (
                  <Pressable
                    key={activity.id}
                    onPress={() => toggleActivity(activity)}
                    style={[
                      styles.activityOption,
                      active && styles.activityOptionSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.activityIcon,
                        active && styles.activityIconSelected,
                      ]}
                    >
                      <Ionicons
                        name={activity.icon}
                        size={20}
                        color={
                          active
                            ? Palette.forestGreen
                            : Palette.textSecondary
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.activityName,
                        active && styles.activityNameSelected,
                      ]}
                    >
                      {activity.name}
                    </Text>

                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={Palette.forestGreen}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* CUSTOM */}
            <View style={styles.customActivity}>
              <Text style={styles.modalSectionTitle}>
                Did something else?
              </Text>

              <TextInput
                value={customActivity}
                onChangeText={setCustomActivity}
                placeholder="e.g. 30 min badminton"
                placeholderTextColor={Palette.textSubtle}
                style={styles.customInput}
                multiline
              />

              <Pressable
                onPress={addCustom}
                disabled={!customActivity.trim()}
                style={[
                  styles.addCustomButton,
                  !customActivity.trim() &&
                    styles.addCustomButtonDisabled,
                ]}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color={
                    customActivity.trim()
                      ? Palette.forestGreen
                      : Palette.textMuted
                  }
                />

                <Text
                  style={[
                    styles.addCustomText,
                    !customActivity.trim() &&
                      styles.addCustomTextDisabled,
                  ]}
                >
                  Add custom activity
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* ACTIONS */}
          <View style={styles.customActions}>
            <Pressable
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={styles.saveActivityButton}
            >
              <Text style={styles.saveActivityText}>
                Save {selected.length > 0 ? `(${selected.length})` : ''}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}