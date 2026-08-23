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
  ActivityIndicator,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';

import {
  ChevronLeft,
  Check,
  Sparkles,
  Activity,
  Dumbbell,
  Utensils,
  Calendar,
  Minus,
  Plus,
  Brain,
  HeartPulse,
  Target,
  ShieldCheck,
} from 'lucide-react-native';

import { Palette, GlobalStyles } from '@/constants/Styles';

// ============================================================
// OPTIONS
// ============================================================

const CYCLE_MODES = [
  'Natural Cycle',
  'Hormonal Birth Control',
  'Irregular / PCOS',
  'Menopause / Perimenopause',
];

const SYMPTOM_OPTIONS = [
  'High Fatigue',
  'Intense Cravings',
  'Energy Spikes',
  'Severe Cramps',
  'Brain Fog',
];

const FOCUS_OPTIONS = [
  {
    title: 'Weight Loss',
    text: 'A weekly deficit with extra recovery protection.',
    icon: Target,
  },
  {
    title: 'Consistency',
    text: 'A minimum-win plan that keeps habits sustainable.',
    icon: Activity,
  },
  {
    title: 'Health & Balance',
    text: 'Lower stress reactivity and improve energy stability.',
    icon: HeartPulse,
  },
];

const FITNESS_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

const EQUIPMENT_OPTIONS = [
  'Home',
  'Dumbbells',
  'Full Gym',
  'Outdoor',
];

const DIET_OPTIONS = [
  'Omnivore',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Pescatarian',
];

const ALLERGY_OPTIONS = [
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Soy-Free',
  'Others',
];

const FRICTION_OPTIONS = [
  'Late-night Cravings',
  'Mid-day Energy Crashes',
  'Lack of Prep Time',
  'Under-fueling',
];

// ============================================================
// COMPONENT
// ============================================================

export default function ReconfigureBiologyScreen() {
  const router = useRouter();

  // BIOLOGY
  const [age, setAge] = useState(28);
  const [ageError, setAgeError] = useState('');
  const [cycleMode, setCycleMode] = useState('Natural Cycle');
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [cycleLengthError, setCycleLengthError] = useState('');

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'High Fatigue',
  ]);

  // FITNESS
  const [selectedFocus, setSelectedFocus] = useState('Consistency');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([
    'Home',
  ]);

  const [stressLevel, setStressLevel] = useState(3);

  // NUTRITION
  const [diet, setDiet] = useState('Omnivore');

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([
    'Dairy-Free',
  ]);

  const [selectedFriction, setSelectedFriction] = useState<string[]>([
    'Late-night Cravings',
  ]);

  // LOADING
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  // ============================================================
  // HELPERS
  // ============================================================

  const toggleSelection = (
    value: string,
    current: string[],
    setCurrent: (value: string[]) => void,
  ) => {
    setCurrent(
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value],
    );
  };

  const handleAgeChange = (value: string) => {
    const num = parseInt(value, 10);

    if (isNaN(num)) {
      setAge(0);
      setAgeError('Enter a valid number');
      return;
    }

    setAge(num);

    if (num < 13 || num > 100) {
      setAgeError('Age should be between 13 and 100.');
    } else {
      setAgeError('');
    }
  };

  const adjustAge = (delta: number) => {
    const next = Math.max(
      0,
      Math.min(120, age + delta),
    );

    setAge(next);

    if (next < 13 || next > 100) {
      setAgeError('Age should be between 13 and 100.');
    } else {
      setAgeError('');
    }
  };

  const handleCycleLengthChange = (value: string) => {
    const num = parseInt(value, 10);

    if (isNaN(num)) {
      setCycleLength(0);
      setCycleLengthError('Enter a valid number');
      return;
    }

    setCycleLength(num);

    if (num < 21 || num > 45) {
      setCycleLengthError(
        'Cycle length should be between 21 and 45 days.',
      );
    } else {
      setCycleLengthError('');
    }
  };

  const adjustCycleLength = (delta: number) => {
    const next = Math.max(
      20,
      Math.min(60, cycleLength + delta),
    );

    setCycleLength(next);

    if (next < 21 || next > 45) {
      setCycleLengthError(
        'Cycle length should be between 21 and 45 days.',
      );
    } else {
      setCycleLengthError('');
    }
  };

  const handleSaveAndRecalibrate = () => {
    if (age < 13 || age > 100) {
      setAgeError('Please enter an age between 13 and 100.');
      return;
    }

    if (cycleLength < 21 || cycleLength > 45) {
      setCycleLengthError(
        'Please enter a cycle length between 21 and 45 days.',
      );
      return;
    }

    setIsRecalibrating(true);

    setTimeout(() => {
      setIsRecalibrating(false);
      router.replace('/(tabs)/home');
    }, 2200);
  };

  // ============================================================
  // SECTION HEADER
  // ============================================================

  const SectionHeader = ({
    number,
    icon,
    title,
    description,
  }: {
    number: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        {icon}
      </View>

      <View style={styles.sectionHeaderText}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionNumber}>{number}</Text>

          <Text style={styles.sectionTitle}>
            {title}
          </Text>
        </View>

        <Text style={styles.sectionDescription}>
          {description}
        </Text>
      </View>
    </View>
  );

  // ============================================================
  // SCREEN
  // ============================================================

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* ======================================================
          HEADER
      ====================================================== */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10}
        >
          <ChevronLeft
            size={21}
            color={Palette.textPrimary}
          />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            Re-configure Engine
          </Text>

          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              BIOLOGY SYNC
            </Text>
          </View>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ==================================================
            INTRO
        ================================================== */}

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Sparkles
              size={21}
              color={Palette.oceanBlue}
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Tune your biological engine
            </Text>

            <Text style={styles.heroText}>
              Update your biology, training and nutrition
              inputs. Your daily recommendations will adapt
              automatically.
            </Text>
          </View>
        </View>

        {/* ==================================================
            CYCLE
        ================================================== */}

        <SectionHeader
          number="01"
          title="Cycle & Period"
          description="Help the engine understand your hormonal timeline."
          icon={
            <Calendar
              size={18}
              color={Palette.oceanBlue}
            />
          }
        />

        <View style={styles.card}>
          {/* Age */}

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.label}>
                Age
              </Text>

              <Text style={styles.helper}>
                Used to personalize your daily targets
              </Text>
            </View>

            <View style={styles.stepper}>
              <Pressable
                style={styles.stepButton}
                onPress={() =>
                  adjustAge(-1)
                }
              >
                <Minus
                  size={14}
                  color={Palette.textPrimary}
                />
              </Pressable>

              <TextInput
                style={styles.numberInput}
                value={
                  age
                    ? age.toString()
                    : ''
                }
                onChangeText={
                  handleAgeChange
                }
                keyboardType="number-pad"
                maxLength={3}
              />

              <Text style={styles.unit}>
                yrs
              </Text>

              <Pressable
                style={styles.stepButton}
                onPress={() =>
                  adjustAge(1)
                }
              >
                <Plus
                  size={14}
                  color={Palette.textPrimary}
                />
              </Pressable>
            </View>
          </View>

          {ageError ? (
            <Text style={styles.errorText}>
              {ageError}
            </Text>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.label}>
            Cycle tracking mode
          </Text>

          <View style={styles.chipContainer}>
            {CYCLE_MODES.map(mode => {
              const active = cycleMode === mode;

              return (
                <Pressable
                  key={mode}
                  onPress={() => setCycleMode(mode)}
                  style={[
                    styles.chip,
                    active && styles.blueChipActive,
                  ]}
                >
                  {active && (
                    <Check
                      size={13}
                      color={Palette.surfaceWhite}
                    />
                  )}

                  <Text
                    style={[
                      styles.chipText,
                      active && styles.activeChipText,
                    ]}
                  >
                    {mode}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>
            Last period start
          </Text>

          <TextInput
            style={styles.dateInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Palette.textSecondary}
            value={lastPeriod}
            onChangeText={setLastPeriod}
          />

          <View style={styles.divider} />

          {/* Cycle Length */}

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.label}>
                Average cycle length
              </Text>

              <Text style={styles.helper}>
                Interval between period starts
              </Text>
            </View>

            <View style={styles.stepper}>
              <Pressable
                style={styles.stepButton}
                onPress={() =>
                  adjustCycleLength(-1)
                }
              >
                <Minus
                  size={14}
                  color={Palette.textPrimary}
                />
              </Pressable>

              <TextInput
                style={styles.numberInput}
                value={
                  cycleLength
                    ? cycleLength.toString()
                    : ''
                }
                onChangeText={
                  handleCycleLengthChange
                }
                keyboardType="number-pad"
                maxLength={2}
              />

              <Text style={styles.unit}>
                days
              </Text>

              <Pressable
                style={styles.stepButton}
                onPress={() =>
                  adjustCycleLength(1)
                }
              >
                <Plus
                  size={14}
                  color={Palette.textPrimary}
                />
              </Pressable>
            </View>
          </View>

          {cycleLengthError ? (
            <Text style={styles.errorText}>
              {cycleLengthError}
            </Text>
          ) : null}

          <View style={styles.divider} />

          {/* Period duration */}

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.label}>
                Period duration
              </Text>

              <Text style={styles.helper}>
                Active bleeding days per cycle
              </Text>
            </View>

            <View style={styles.stepper}>
              <Pressable
                style={styles.stepButton}
                onPress={() =>
                  setPeriodDuration(
                    Math.max(
                      2,
                      periodDuration - 1,
                    ),
                  )
                }
              >
                <Minus
                  size={14}
                  color={Palette.textPrimary}
                />
              </Pressable>

              <Text style={styles.stepperValue}>
                {periodDuration}
              </Text>

              <Text style={styles.unit}>
                days
              </Text>

              <Pressable
                style={styles.stepButton}
                onPress={() =>
                  setPeriodDuration(
                    Math.min(
                      10,
                      periodDuration + 1,
                    ),
                  )
                }
              >
                <Plus
                  size={14}
                  color={Palette.textPrimary}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* ==================================================
            SYMPTOMS
        ================================================== */}

        <SectionHeader
          number="02"
          title="Phase Symptoms"
          description="Select the symptoms your engine should account for."
          icon={
            <Brain
              size={18}
              color={Palette.crimson}
            />
          }
        />

        <View style={styles.card}>
          <View style={styles.chipContainer}>
            {SYMPTOM_OPTIONS.map(item => {
              const active =
                selectedSymptoms.includes(item);

              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    toggleSelection(
                      item,
                      selectedSymptoms,
                      setSelectedSymptoms,
                    )
                  }
                  style={[
                    styles.symptomChip,
                    active &&
                      styles.symptomChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active &&
                        styles.symptomTextActive,
                    ]}
                  >
                    {item}
                  </Text>

                  {active && (
                    <Check
                      size={14}
                      color={Palette.crimson}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ==================================================
            FITNESS
        ================================================== */}

        <SectionHeader
          number="03"
          title="Fitness Baseline"
          description="Set the training context your recommendations should use."
          icon={
            <Dumbbell
              size={18}
              color={Palette.orange}
            />
          }
        />

        {/* Focus */}

        <Text style={styles.subLabel}>
          Primary focus
        </Text>

        <View style={styles.focusList}>
          {FOCUS_OPTIONS.map(option => {
            const active =
              selectedFocus === option.title;

            const Icon = option.icon;

            return (
              <Pressable
                key={option.title}
                onPress={() =>
                  setSelectedFocus(option.title)
                }
                style={[
                  styles.focusCard,
                  active &&
                    styles.focusCardActive,
                ]}
              >
                <View
                  style={[
                    styles.focusIcon,
                    active &&
                      styles.focusIconActive,
                  ]}
                >
                  <Icon
                    size={17}
                    color={
                      active
                        ? Palette.orange
                        : Palette.textSecondary
                    }
                  />
                </View>

                <View style={styles.focusContent}>
                  <Text
                    style={[
                      styles.focusTitle,
                      active &&
                        styles.focusTitleActive,
                    ]}
                  >
                    {option.title}
                  </Text>

                  <Text style={styles.focusText}>
                    {option.text}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    active && styles.radioActive,
                  ]}
                >
                  {active && (
                    <View
                      style={styles.radioInner}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Fitness Level */}

        <Text style={styles.subLabel}>
          Current fitness level
        </Text>

        <View style={styles.chipContainer}>
          {FITNESS_LEVELS.map(level => {
            const active =
              fitnessLevel === level;

            return (
              <Pressable
                key={level}
                onPress={() =>
                  setFitnessLevel(level)
                }
                style={[
                  styles.chip,
                  active &&
                    styles.orangeChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active &&
                      styles.activeChipText,
                  ]}
                >
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Equipment */}

        <Text style={styles.subLabel}>
          Available equipment
        </Text>

        <View style={styles.chipContainer}>
          {EQUIPMENT_OPTIONS.map(item => {
            const active =
              selectedEquipment.includes(item);

            return (
              <Pressable
                key={item}
                onPress={() =>
                  toggleSelection(
                    item,
                    selectedEquipment,
                    setSelectedEquipment,
                  )
                }
                style={[
                  styles.chip,
                  active &&
                    styles.orangeChipActive,
                ]}
              >
                {active && (
                  <Check
                    size={13}
                    color={Palette.surfaceWhite}
                  />
                )}

                <Text
                  style={[
                    styles.chipText,
                    active &&
                      styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Stress */}

        <View style={styles.stressHeader}>
          <Text style={styles.subLabel}>
            Average daily workload / stress
          </Text>

          <View style={styles.stressBadge}>
            <Text style={styles.stressBadgeText}>
              {stressLevel}/5
            </Text>
          </View>
        </View>

        <View style={styles.stressContainer}>
          <View style={styles.stressLine} />

          <View style={styles.stressPoints}>
            {[1, 2, 3, 4, 5].map(value => {
              const active =
                stressLevel === value;

              return (
                <Pressable
                  key={value}
                  onPress={() =>
                    setStressLevel(value)
                  }
                  style={[
                    styles.stressPoint,
                    active &&
                      styles.stressPointActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.stressPointText,
                      active &&
                        styles.stressPointTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.stressLabels}>
            <Text style={styles.stressLabel}>
              Low
            </Text>

            <Text style={styles.stressLabel}>
              High
            </Text>
          </View>
        </View>

        {/* ==================================================
            NUTRITION
        ================================================== */}

        <SectionHeader
          number="04"
          title="Nutrition & Health"
          description="Fine-tune food preferences and everyday friction."
          icon={
            <Utensils
              size={18}
              color={Palette.forestGreen}
            />
          }
        />

        {/* Diet */}

        <Text style={styles.subLabel}>
          Dietary pattern
        </Text>

        <View style={styles.chipContainer}>
          {DIET_OPTIONS.map(item => {
            const active = diet === item;

            return (
              <Pressable
                key={item}
                onPress={() => setDiet(item)}
                style={[
                  styles.chip,
                  active &&
                    styles.greenChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active &&
                      styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Allergies */}

        <Text style={styles.subLabel}>
          Allergies & sensitivities
        </Text>

        <View style={styles.chipContainer}>
          {ALLERGY_OPTIONS.map(item => {
            const active =
              selectedAllergies.includes(item);

            return (
              <Pressable
                key={item}
                onPress={() =>
                  toggleSelection(
                    item,
                    selectedAllergies,
                    setSelectedAllergies,
                  )
                }
                style={[
                  styles.chip,
                  active &&
                    styles.greenChipActive,
                ]}
              >
                {active && (
                  <Check
                    size={13}
                    color={Palette.surfaceWhite}
                  />
                )}

                <Text
                  style={[
                    styles.chipText,
                    active &&
                      styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Friction */}

        <Text style={styles.subLabel}>
          Primary nutrition friction
        </Text>

        <View style={styles.chipContainer}>
          {FRICTION_OPTIONS.map(item => {
            const active =
              selectedFriction.includes(item);

            return (
              <Pressable
                key={item}
                onPress={() =>
                  toggleSelection(
                    item,
                    selectedFriction,
                    setSelectedFriction,
                  )
                }
                style={[
                  styles.chip,
                  active &&
                    styles.greenChipActive,
                ]}
              >
                {active && (
                  <Check
                    size={13}
                    color={Palette.surfaceWhite}
                  />
                )}

                <Text
                  style={[
                    styles.chipText,
                    active &&
                      styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ==================================================
            ENGINE PREVIEW
        ================================================== */}

        <View style={styles.previewCard}>
          <View style={styles.previewIcon}>
            <ShieldCheck
              size={20}
              color={Palette.oceanBlue}
            />
          </View>

          <View style={styles.previewContent}>
            <Text style={styles.previewTitle}>
              Engine recalibration
            </Text>

            <Text style={styles.previewText}>
              These changes will influence your workout
              intensity, recovery targets, nutrition guidance
              and daily minimum-win recommendations.
            </Text>
          </View>
        </View>

        {/* ==================================================
            SAVE BUTTON
        ================================================== */}

        <Pressable
          style={styles.saveButton}
          onPress={handleSaveAndRecalibrate}
        >
          <Sparkles
            size={18}
            color={Palette.surfaceWhite}
          />

          <Text style={styles.saveText}>
            Save & Recalibrate Engine
          </Text>

          <ChevronLeft
            size={18}
            color={Palette.surfaceWhite}
            style={{
              transform: [{ rotate: '180deg' }],
            }}
          />
        </Pressable>

        <Text style={styles.saveHint}>
          Your dashboard will update automatically
        </Text>
      </ScrollView>

      {/* ======================================================
          RECALIBRATION MODAL
      ====================================================== */}

      <Modal
        visible={isRecalibrating}
        animationType="fade"
      >
        <SafeAreaView
          style={styles.recalibrationScreen}
        >
          <View style={styles.recalibrationContent}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size="large"
                color={Palette.oceanBlue}
              />

              <View style={styles.loaderPulse}>
                <Sparkles
                  size={22}
                  color={Palette.oceanBlue}
                />
              </View>
            </View>

            <Text style={styles.recalibrationTitle}>
              Recalibrating
            </Text>

            <Text style={styles.recalibrationSubtitle}>
              Updating your biological engine with your
              new cycle, fitness and nutrition inputs.
            </Text>

            <View style={styles.syncBadge}>
              <Activity
                size={14}
                color={Palette.oceanBlue}
              />

              <Text style={styles.syncText}>
                SYNCING DASHBOARD
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.cream,
  },

  // HEADER
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    backgroundColor: Palette.cream,
    marginTop: 30 ,
    marginBottom: 0
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  headerCenter: {
    alignItems: 'center',
    gap: 3,
    
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  headerSpacer: {
    width: 38,
  },

  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.forestGreen,
  },

  liveText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    color: Palette.forestGreen,
  },

  // CONTENT
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 50,
  },

  // HERO
  heroCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 18,
    backgroundColor: Palette.surfaceBlueMuted,
    borderWidth: 1,
    borderColor: Palette.skyBlue,
    marginBottom: 8,
    marginTop:0
  },

  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    marginRight: 12,
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.oceanBlue,
    marginBottom: 5,
  },

  heroText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: Palette.oceanBlue,
    opacity: 0.85,
  },

  // SECTION
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 27,
    marginBottom: 11,
  },

  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: Palette.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  sectionNumber: {
    fontSize: 10,
    fontWeight: '900',
    color: Palette.textSecondary,
    letterSpacing: 0.5,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  sectionDescription: {
    fontSize: 11.5,
    color: Palette.textSecondary,
    marginTop: 2,
  },

  // CARD
  card: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  // LABELS
  label: {
    fontSize: 12.5,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 7,
  },

  helper: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },

  subLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginTop: 15,
    marginBottom: 9,
  },

  // CHIPS
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DED5BE',
    backgroundColor: Palette.surfaceWhite,
  },

  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
  },

  activeChipText: {
    color: Palette.surfaceWhite,
    fontWeight: '700',
  },

  blueChipActive: {
    backgroundColor: Palette.oceanBlue,
    borderColor: Palette.oceanBlue,
  },

  orangeChipActive: {
    backgroundColor: Palette.orange,
    borderColor: Palette.orange,
  },

  greenChipActive: {
    backgroundColor: Palette.forestGreen,
    borderColor: Palette.forestGreen,
  },

  // INPUT
  dateInput: {
    height: 42,
    borderRadius: 11,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    backgroundColor: Palette.creamLight,
    color: Palette.textPrimary,
    fontSize: 12.5,
  },

  divider: {
    height: 1,
    backgroundColor: Palette.borderSubtle,
    marginVertical: 15,
  },

  // SETTING ROW
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  settingInfo: {
    flex: 1,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 4,
    borderRadius: 12,
    backgroundColor: Palette.creamLight,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  stepButton: {
    width: 29,
    height: 29,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  numberInput: {
    width: 28,
    textAlign: 'center',
    padding: 0,
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  stepperValue: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  unit: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginRight: 3,
  },

  errorText: {
    color: Palette.crimson,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },

  // SYMPTOMS
  symptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    backgroundColor: Palette.creamLight,
  },

  symptomChipActive: {
    backgroundColor: Palette.surfaceCrimsonMuted,
    borderColor: Palette.crimson,
  },

  symptomTextActive: {
    color: Palette.crimson,
    fontWeight: '800',
  },

  // FOCUS
  focusList: {
    gap: 8,
  },

  focusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 15,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  focusCardActive: {
    borderColor: Palette.orange,
    backgroundColor: Palette.surfaceOrangeMuted,
  },

  focusIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.creamLight,
    marginRight: 10,
  },

  focusIconActive: {
    backgroundColor: Palette.surfaceWhite,
  },

  focusContent: {
    flex: 1,
  },

  focusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 3,
  },

  focusTitleActive: {
    color: Palette.orange,
  },

  focusText: {
    fontSize: 11.5,
    color: Palette.textSecondary,
    lineHeight: 16,
  },

  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Palette.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  radioActive: {
    borderColor: Palette.orange,
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Palette.orange,
  },

  // STRESS
  stressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  stressBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Palette.surfaceOrangeMuted,
  },

  stressBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.orange,
  },

  stressContainer: {
    marginTop: 5,
    paddingHorizontal: 3,
  },

  stressLine: {
    position: 'absolute',
    top: 20,
    left: 23,
    right: 23,
    height: 2,
    backgroundColor: Palette.borderSubtle,
  },

  stressPoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  stressPoint: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  stressPointActive: {
    backgroundColor: Palette.orange,
    borderColor: Palette.orange,
  },

  stressPointText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  stressPointTextActive: {
    color: Palette.surfaceWhite,
  },

  stressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  stressLabel: {
    fontSize: 10,
    color: Palette.textSecondary,
  },

  // PREVIEW
  previewCard: {
    flexDirection: 'row',
    marginTop: 25,
    padding: 15,
    borderRadius: 16,
    backgroundColor: Palette.surfaceBlueMuted,
    borderWidth: 1,
    borderColor: Palette.skyBlue,
  },

  previewIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceWhite,
    marginRight: 10,
  },

  previewContent: {
    flex: 1,
  },

  previewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.oceanBlue,
    marginBottom: 4,
  },

  previewText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: Palette.oceanBlue,
    opacity: 0.85,
  },

  // SAVE
  saveButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: Palette.oceanBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 18,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  saveText: {
    color: Palette.surfaceWhite,
    fontSize: 13.5,
    fontWeight: '800',
  },

  saveHint: {
    textAlign: 'center',
    fontSize: 10.5,
    color: Palette.textSecondary,
    marginTop: 9,
  },

  // RECALIBRATION
  recalibrationScreen: {
    flex: 1,
    backgroundColor: Palette.cream,
  },

  recalibrationContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  loaderContainer: {
    width: 125,
    height: 125,
    borderRadius: 63,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceBlueMuted,
    borderWidth: 1,
    borderColor: Palette.skyBlue,
    marginBottom: 28,
  },

  loaderPulse: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceWhite,
  },

  recalibrationTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: Palette.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },

  recalibrationSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: Palette.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 25,
  },

  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Palette.surfaceBlueMuted,
  },

  syncText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    color: Palette.oceanBlue,
  },
});