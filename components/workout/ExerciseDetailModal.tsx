import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette } from '@/constants/Styles';
import { styles } from './workoutStyles';

type Exercise = {
  id: string;
  name: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  reason: string;
  description: string;
};

type Props = {
  visible: boolean;
  exercise: Exercise | null;
  completed: boolean;
  onClose: () => void;
  onComplete: () => void;
};

export default function ExerciseDetailModal({
  visible,
  exercise,
  completed,
  onClose,
  onComplete,
}: Props) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      backdropOpacity.setValue(0);
      sheetY.setValue(500);

      // Backdrop comes in first.
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        // Then the sheet emerges from the bottom.
        Animated.spring(sheetY, {
          toValue: 0,
          damping: 22,
          stiffness: 180,
          mass: 0.8,
          useNativeDriver: true,
        }).start();
      });
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(sheetY, {
          toValue: 500,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, sheetY]);

  if (!exercise) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* BACKDROP */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.modalOverlay,
            {
              opacity: backdropOpacity,
            },
          ]}
        />

        {/* TOUCH OUTSIDE TO CLOSE */}
        <Pressable
          style={styles.modalTouchArea}
          onPress={onClose}
        />

        {/* SHEET */}
        <Animated.View
          style={[
            styles.exerciseModal,
            {
              transform: [{ translateY: sheetY }],
            },
          ]}
        >
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={styles.modalExerciseIcon}>
                <Ionicons
                  name={exercise.icon}
                  size={25}
                  color={Palette.orange}
                />
              </View>

              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>
                  {exercise.name}
                </Text>

                <View style={styles.modalDuration}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={Palette.textSecondary}
                  />

                  <Text style={styles.modalDurationText}>
                    {exercise.duration}
                  </Text>
                </View>
              </View>
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

          {/* WHY */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>
              Why this exercise?
            </Text>

            <Text style={styles.modalBody}>
              {exercise.reason}
            </Text>
          </View>

          {/* ABOUT */}
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>
              About this movement
            </Text>

            <Text style={styles.modalBody}>
              {exercise.description}
            </Text>
          </View>

          {/* COMPLETE */}
          <Pressable
            onPress={() => {
              onComplete();
            }}
            style={[
              styles.modalCompleteButton,
              completed && styles.modalCompleteButtonDone,
            ]}
          >
            <Ionicons
              name={completed ? 'checkmark-circle' : 'checkmark'}
              size={19}
              color={
                completed
                  ? Palette.forestGreen
                  : Palette.textWhite
              }
            />

            <Text
              style={
                completed
                  ? styles.modalCompleteTextDone
                  : styles.modalCompleteText
              }
            >
              {completed
                ? 'Exercise completed'
                : 'Mark exercise complete'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}