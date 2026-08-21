import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Check,
  Sparkles,
  Activity,
  ShieldAlert,
  Dumbbell,
  Utensils,
  Calendar,
  Minus,
  Plus,
} from 'lucide-react-native';
import LottieView from 'lottie-react-native';

import { Palette, GlobalStyles } from '@/constants/Styles';

const CYCLE_PHASES = [
  { name: 'Follicular', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
  { name: 'Ovulatory', color: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
  { name: 'Luteal', color: '#8B5CF6', bg: '#F3E8FF', border: '#DDD6FE' },
  { name: 'Menstrual', color: '#EF4444', bg: '#FEE2E2', border: '#FCA5A5' },
];

const WORKOUT_CAPACITIES = [
  'Low Strain (Yoga / Gentle Walks)',
  'Moderate Strain (Pilates / Zone 2)',
  'High Strain (HIIT / Heavy Lifting)',
];

const DIET_GOALS = [
  'High Protein & Iron Support',
  'Glucose Stabilization & Steady Energy',
  'Anti-Inflammatory & Gut Health',
  'Maintenance & Healthy Fats',
];

const FRICTION_POINTS = [
  'High Fatigue',
  'Brain Fog',
  'Cravings / Appetite Spikes',
  'Joint / Muscle Soreness',
];

export default function ReconfigureBiologyScreen() {
  const router = useRouter();

  // Cycle Length & Period Parameters State
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodDuration, setPeriodDuration] = useState<number>(5);
  const [cycleLengthError, setCycleLengthError] = useState('');

  // Selected Engine State
  const [selectedPhase, setSelectedPhase] = useState('Luteal');
  const [selectedCapacity, setSelectedCapacity] = useState('Moderate Strain (Pilates / Zone 2)');
  const [selectedDiet, setSelectedDiet] = useState('High Protein & Iron Support');
  const [selectedFrictions, setSelectedFrictions] = useState<string[]>([
    'High Fatigue',
    'Cravings / Appetite Spikes',
  ]);

  // Animation Trigger
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  const activePhaseConfig = CYCLE_PHASES.find((p) => p.name === selectedPhase) || CYCLE_PHASES[2];

  const handleCycleLengthChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setCycleLength(0);
      setCycleLengthError('Enter a valid number');
      return;
    }
    setCycleLength(num);
    if (num < 21 || num > 45) {
      setCycleLengthError('Typical cycles range between 21 and 45 days.');
    } else {
      setCycleLengthError('');
    }
  };

  const adjustCycleLength = (delta: number) => {
    const nextVal = Math.max(20, Math.min(60, cycleLength + delta));
    setCycleLength(nextVal);
    if (nextVal < 21 || nextVal > 45) {
      setCycleLengthError('Typical cycles range between 21 and 45 days.');
    } else {
      setCycleLengthError('');
    }
  };

  const toggleFriction = (item: string) => {
    if (selectedFrictions.includes(item)) {
      setSelectedFrictions(selectedFrictions.filter((f) => f !== item));
    } else {
      setSelectedFrictions([...selectedFrictions, item]);
    }
  };

  const handleSaveAndRecalibrate = () => {
    if (cycleLength < 20 || cycleLength > 60) {
      setCycleLengthError('Please enter a cycle length between 20 and 60 days.');
      return;
    }

    setIsRecalibrating(true);
    setTimeout(() => {
      setIsRecalibrating(false);
      router.replace('/(tabs)/home');
    }, 3200);
  };

  return (
    <SafeAreaView style={GlobalStyles.screenContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <ChevronLeft size={22} color={Palette.textPrimary} />
        </Pressable>
        <Text style={GlobalStyles.headingMedium}>Re-configure Engine</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* INFO NOTICE */}
        <View style={styles.introCard}>
          <Activity size={20} color={Palette.oceanBlue} />
          <Text style={styles.introText}>
            Updating parameters dynamically adapts your daily minimum-win thresholds, recovery targets, and workout intensity.
          </Text>
        </View>

        {/* 1. CYCLE LENGTH & DURATION CONFIGURATION */}
        <View style={styles.sectionHeaderRow}>
          <Calendar size={16} color={Palette.oceanBlue} />
          <Text style={styles.sectionTitle}>1. Cycle & Period Duration</Text>
        </View>

        <View style={styles.configCard}>
          {/* Cycle Length Stepper / Input */}
          <View style={styles.configRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.configLabel}>Average Cycle Length</Text>
              <Text style={styles.configSublabel}>Interval between period starts</Text>
            </View>

            <View style={styles.stepperContainer}>
              <Pressable style={styles.stepperBtn} onPress={() => adjustCycleLength(-1)}>
                <Minus size={14} color={Palette.textPrimary} />
              </Pressable>
              
              <TextInput
                style={styles.cycleInput}
                value={cycleLength ? cycleLength.toString() : ''}
                onChangeText={handleCycleLengthChange}
                keyboardType="number-pad"
                maxLength={2}
              />
              <Text style={styles.daysUnitText}>days</Text>

              <Pressable style={styles.stepperBtn} onPress={() => adjustCycleLength(1)}>
                <Plus size={14} color={Palette.textPrimary} />
              </Pressable>
            </View>
          </View>

          {cycleLengthError ? <Text style={styles.errorText}>{cycleLengthError}</Text> : null}

          <View style={styles.divider} />

          {/* Period Duration Stepper */}
          <View style={styles.configRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.configLabel}>Period Duration</Text>
              <Text style={styles.configSublabel}>Active bleeding days per cycle</Text>
            </View>

            <View style={styles.stepperContainer}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setPeriodDuration(Math.max(2, periodDuration - 1))}
              >
                <Minus size={14} color={Palette.textPrimary} />
              </Pressable>

              <Text style={styles.stepperValueText}>{periodDuration} days</Text>

              <Pressable
                style={styles.stepperBtn}
                onPress={() => setPeriodDuration(Math.min(10, periodDuration + 1))}
              >
                <Plus size={14} color={Palette.textPrimary} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* 2. CURRENT PHASE (THEMED CHIPS) */}
        <View style={styles.sectionHeaderRow}>
          <Sparkles size={16} color={Palette.textSecondary} />
          <Text style={styles.sectionTitle}>2. Current Biological Phase</Text>
        </View>
        <View style={styles.phaseGrid}>
          {CYCLE_PHASES.map((phase) => {
            const isSelected = selectedPhase === phase.name;
            return (
              <Pressable
                key={phase.name}
                style={[
                  styles.phaseChip,
                  isSelected && {
                    backgroundColor: phase.bg,
                    borderColor: phase.color,
                  },
                ]}
                onPress={() => setSelectedPhase(phase.name)}
              >
                <View
                  style={[
                    styles.phaseIndicator,
                    { backgroundColor: isSelected ? phase.color : Palette.borderSubtle },
                  ]}
                />
                <Text style={[styles.phaseText, isSelected && { color: phase.color, fontWeight: '800' }]}>
                  {phase.name}
                </Text>
                {isSelected && <Check size={14} color={phase.color} style={{ marginLeft: 'auto' }} />}
              </Pressable>
            );
          })}
        </View>

        {/* 3. WORKOUT CAPACITY */}
        <View style={styles.sectionHeaderRow}>
          <Dumbbell size={16} color={Palette.textSecondary} />
          <Text style={styles.sectionTitle}>3. Target Workout Strain</Text>
        </View>
        <View style={styles.optionsList}>
          {WORKOUT_CAPACITIES.map((capacity) => {
            const isSelected = selectedCapacity === capacity;
            return (
              <Pressable
                key={capacity}
                style={[
                  styles.listOption,
                  isSelected && {
                    borderColor: activePhaseConfig.color,
                    backgroundColor: activePhaseConfig.bg,
                  },
                ]}
                onPress={() => setSelectedCapacity(capacity)}
              >
                <Text style={[styles.listOptionText, isSelected && { color: Palette.textPrimary, fontWeight: '800' }]}>
                  {capacity}
                </Text>
                <View style={[styles.radioCircle, isSelected && { borderColor: activePhaseConfig.color }]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: activePhaseConfig.color }]} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* 4. DIETARY STRATEGY */}
        <View style={styles.sectionHeaderRow}>
          <Utensils size={16} color={Palette.textSecondary} />
          <Text style={styles.sectionTitle}>4. Nutritional Focus</Text>
        </View>
        <View style={styles.optionsList}>
          {DIET_GOALS.map((diet) => {
            const isSelected = selectedDiet === diet;
            return (
              <Pressable
                key={diet}
                style={[
                  styles.listOption,
                  isSelected && {
                    borderColor: Palette.forestGreen,
                    backgroundColor: Palette.surfaceGreenMuted,
                  },
                ]}
                onPress={() => setSelectedDiet(diet)}
              >
                <Text style={[styles.listOptionText, isSelected && { color: Palette.forestGreen, fontWeight: '800' }]}>
                  {diet}
                </Text>
                <View style={[styles.radioCircle, isSelected && { borderColor: Palette.forestGreen }]}>
                  {isSelected && <View style={[styles.radioInner, { backgroundColor: Palette.forestGreen }]} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* 5. FRICTION POINTS */}
        <View style={styles.sectionHeaderRow}>
          <ShieldAlert size={16} color={Palette.crimson} />
          <Text style={styles.sectionTitle}>5. Active Friction Points</Text>
        </View>
        <View style={styles.optionsGrid}>
          {FRICTION_POINTS.map((friction) => {
            const isSelected = selectedFrictions.includes(friction);
            return (
              <Pressable
                key={friction}
                style={[
                  styles.frictionChip,
                  isSelected && styles.frictionChipSelected,
                ]}
                onPress={() => toggleFriction(friction)}
              >
                <Text style={[styles.frictionText, isSelected && styles.frictionTextSelected]}>
                  {friction}
                </Text>
                {isSelected && <Check size={14} color={Palette.crimson} />}
              </Pressable>
            );
          })}
        </View>

        {/* SAVE CTA BUTTON */}
        <Pressable
          style={[GlobalStyles.btnPrimary, { backgroundColor: Palette.oceanBlue, marginTop: 28, marginBottom: 50 }]}
          onPress={handleSaveAndRecalibrate}
        >
          <Sparkles size={18} color={Palette.surfaceWhite} style={{ marginRight: 8 }} />
          <Text style={GlobalStyles.btnPrimaryText}>Save & Recalibrate Engine</Text>
        </Pressable>
      </ScrollView>

      {/* RECALIBRATION ANIMATION OVERLAY */}
      <Modal visible={isRecalibrating} animationType="fade" statusBarHidden>
        <SafeAreaView style={styles.fullScreenContainer}>
          <View style={styles.fullScreenContent}>
            <LottieView
              source={{ uri: 'https://assets5.lottiefiles.com/packages/lf20_u4yrau.json' }}
              autoPlay
              loop={false}
              style={styles.lottieAnimation}
            />

            <Text style={styles.fullScreenTitle}>Recalibrating Biological Engine</Text>
            <Text style={styles.fullScreenSubtitle}>
              Aligning daily workout strain limits, cycle timeline predictions, macro split recommendations, and recovery targets...
            </Text>

            <Text style={styles.redirectingNotice}>Syncing to Dashboard...</Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
  scrollContent: {
    paddingVertical: 10,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.surfaceBlueMuted,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Palette.skyBlue,
  },
  introText: {
    flex: 1,
    fontSize: 13,
    color: Palette.oceanBlue,
    fontWeight: '600',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 22,
    marginBottom: 10,
  },
  configCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  configLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  configSublabel: {
    fontSize: 11.5,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.backgroundApp,
    padding: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: Palette.surfaceWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  cycleInput: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
    minWidth: 24,
    textAlign: 'center',
    paddingVertical: 0,
  },
  daysUnitText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginRight: 4,
  },
  stepperValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.textPrimary,
    paddingHorizontal: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.borderSubtle,
    marginVertical: 12,
  },
  errorText: {
    fontSize: 11.5,
    color: Palette.crimson,
    marginTop: 8,
    fontWeight: '600',
  },
  phaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  phaseChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  phaseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  phaseText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  optionsList: {
    gap: 8,
  },
  listOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1.5,
    borderColor: Palette.borderSubtle,
  },
  listOptionText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.textPrimary,
    flex: 1,
    paddingRight: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Palette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frictionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  frictionChipSelected: {
    backgroundColor: Palette.surfaceCrimsonMuted,
    borderColor: Palette.crimson,
  },
  frictionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  frictionTextSelected: {
    color: Palette.crimson,
    fontWeight: '700',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Palette.surfaceWhite,
  },
  fullScreenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  lottieAnimation: {
    width: 220,
    height: 220,
  },
  fullScreenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginTop: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  fullScreenSubtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  redirectingNotice: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.oceanBlue,
    letterSpacing: 0.5,
  },
});