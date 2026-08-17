import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { GlobalStyles, Palette } from '@/constants/Styles';


const cycleModes = ['Natural Cycle', 'Hormonal Birth Control', 'Irregular / PCOS', 'Menopause / Perimenopause'];
const symptomOptions = ['High Fatigue', 'Intense Cravings', 'Energy Spikes', 'Severe Cramps', 'Brain Fog'];
const focusOptions = [
  { title: 'Weight Loss', text: 'A weekly deficit with extra recovery protection.' },
  { title: 'Consistency', text: 'A minimum-win plan that keeps habits sustainable.' },
  { title: 'Health & Balance', text: 'Lower stress reactivity and improve energy stability.' },
];
const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];
const equipmentOptions = ['Home', 'Dumbbells', 'Full Gym', 'Outdoor'];
const dietOptions = ['Omnivore', 'Vegetarian', 'Vegan', 'Keto', 'Pescatarian'];
const allergyOptions = ['Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Soy-Free', 'Others'];
const frictionOptions = ['Late-night Cravings', 'Mid-day Energy Crashes', 'Lack of Prep Time', 'Under-fueling'];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cycleMode, setCycleMode] = useState(cycleModes[0]);
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [lastPeriodError, setLastPeriodError] = useState('');
  const [cycleLengthError, setCycleLengthError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [symptoms, setSymptoms] = useState<string[]>(['High Fatigue']);
  const [focus, setFocus] = useState(focusOptions[1].title);
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [equipment, setEquipment] = useState<string[]>(['Home']);
  const [stressLevel, setStressLevel] = useState(3);
  const [diet, setDiet] = useState('Omnivore');
  const [allergies, setAllergies] = useState<string[]>(['Dairy-Free']);
  const [frictionPoint, setFrictionPoint] = useState<string[]>(['Late-night Cravings']);
  const [isProcessing, setIsProcessing] = useState(false);
  const toggleSelection = (value: string, current: string[], setCurrent: (value: string[]) => void) => {
    setCurrent(
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const setFocusInsight = (title: string) => {
    setFocus(title);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);

    if (date) {
      setSelectedDate(date);
      setLastPeriod(formatDate(date));
      if (lastPeriodError) setLastPeriodError('');
    }
  };

  const validateStepOne = () => {
    const trimmedDate = lastPeriod.trim();
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const cycleValue = Number(cycleLength);

    const isValidDate = datePattern.test(trimmedDate);
    const isValidCycle = !Number.isNaN(cycleValue) && cycleValue >= 21 && cycleValue <= 45;

    setLastPeriodError(isValidDate ? '' : 'Please enter a date in YYYY-MM-DD format.');
    setCycleLengthError(isValidCycle ? '' : 'Cycle length should be between 21 and 45 days.');

    if (isValidDate && isValidCycle) {
      setStep(2);
    }
  };

  const handleComplete = () => {
    setIsProcessing(true);
    setTimeout(() => router.replace('/home'), 900);
  };



  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: Palette.creamLight}]} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={[GlobalStyles.bodyText, { color: Palette.oceanBlue, marginBottom: 6, marginTop: 12 }]}>
            Step {step} of 3
          </Text>

          {isProcessing ? (
            <View style={{ paddingVertical: 24 }}>
              <Text style={[GlobalStyles.brandTitle, { fontSize: 24, color: Palette.marigold, marginBottom: 8 }]}>
                Building your plan
              </Text>
              <Text style={[GlobalStyles.bodyText, { color: Palette.textSecondary }]}>
                Analyzing your cycle, energy, and nutrition inputs...
              </Text>
            </View>
          ) : (
            <>
              {step === 1 && (
                <>
                  <Text style={[GlobalStyles.brandTitle, { marginBottom: 8, color: Palette.oceanBlue, fontSize: 24 }]}>
                    Let’s get to know your biology
                  </Text>
                  <Text style={[GlobalStyles.bodyText, { marginBottom: 20, color: Palette.textSecondary }]}>
                    Azuka uses your cycle to adapt daily intensity and recovery.
                  </Text>

                  <Text style={styles.sectionLabel}>Cycle tracking mode</Text>
                  <View style={styles.chipRow}>
                    {cycleModes.map((mode) => (
                      <Pressable
                        key={mode}
                        style={[styles.chip, cycleMode === mode && styles.chipActive]}
                        onPress={() => setCycleMode(mode)}>
                        <Text style={[styles.chipText, cycleMode === mode && styles.chipTextActive]}>{mode}</Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={styles.sectionLabel}>Last period start date</Text>
                  <Pressable onPress={() => setShowDatePicker(true)}>
                    <TextInput
                      style={GlobalStyles.inputField}
                      placeholder="YYYY-MM-DD"
                      value={lastPeriod}
                      editable={false}
                      onChangeText={(value) => {
                        setLastPeriod(value);
                        if (lastPeriodError) setLastPeriodError('');
                      }}
                    />
                  </Pressable>
                  {showDatePicker ? (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  ) : null}
                  {lastPeriodError ? <Text style={{ color: Palette.crimson, marginTop: -8, marginBottom: 8 }}>{lastPeriodError}</Text> : null}

                  <Text style={styles.sectionLabel}>Average cycle length</Text>
                  <TextInput
                    style={GlobalStyles.inputField}
                    placeholder="28"
                    keyboardType="number-pad"
                    value={cycleLength}
                    onChangeText={(value) => {
                      setCycleLength(value);
                      if (cycleLengthError) setCycleLengthError('');
                    }}
                  />
                  {cycleLengthError ? <Text style={{ color: Palette.crimson, marginTop: -8, marginBottom: 8 }}>{cycleLengthError}</Text> : null}

                  <Text style={styles.sectionLabel}>Primary phase symptoms</Text>
                  <View style={styles.chipRow}>
                    {symptomOptions.map((option) => {
                      const active = symptoms.includes(option);
                      return (
                        <Pressable
                          key={option}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() => toggleSelection(option, symptoms, setSymptoms)}>
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Pressable style={[GlobalStyles.btnPrimary, { backgroundColor: Palette.oceanBlue, marginTop: 12 }]} onPress={validateStepOne}>
                    <Text style={GlobalStyles.btnPrimaryText}>Continue</Text>
                  </Pressable>
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={[GlobalStyles.brandTitle, { marginBottom: 8, color: Palette.orange, fontSize: 24 }]}>
                    Your fitness baseline
                  </Text>
                  <Text style={[GlobalStyles.bodyText, { marginBottom: 20, color: Palette.textSecondary }]}>
                    We’ll tailor workout duration and intensity so consistency never breaks.
                  </Text>

                  <Text style={styles.sectionLabel}>Primary focus</Text>
                  {focusOptions.map((option) => (
                    <Pressable
                      key={option.title}
                      style={[styles.optionCard, focus === option.title && styles.optionCardActive]}
                      onPress={() => setFocusInsight(option.title)}>
                      <Text style={[styles.optionTitle, focus === option.title && styles.optionTitleActive]}>{option.title}</Text>
                      <Text style={styles.optionText}>{option.text}</Text>
                    </Pressable>
                  ))}

                  

                  <Text style={styles.sectionLabel}>Current fitness level</Text>
                  <View style={styles.chipRow}>
                    {fitnessLevels.map((level) => (
                      <Pressable
                        key={level}
                        style={[styles.chip, fitnessLevel === level && styles.chipActive2]}
                        onPress={() => setFitnessLevel(level)}>
                        <Text style={[styles.chipText, fitnessLevel === level && styles.chipTextActive]}>{level}</Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={styles.sectionLabel}>Equipment</Text>
                  <View style={styles.chipRow}>
                    {equipmentOptions.map((item) => {
                      const active = equipment.includes(item);
                      return (
                        <Pressable
                          key={item}
                          style={[styles.chip, active && styles.chipActive2]}
                          onPress={() => toggleSelection(item, equipment, setEquipment)}>
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={styles.sectionLabel}>Average daily workload / stress</Text>
                  <View style={styles.sliderRow}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Pressable
                        key={value}
                        style={[styles.sliderDot, stressLevel === value && styles.sliderDotActive]}
                        onPress={() => setStressLevel(value)}>
                        <Text style={[styles.sliderDotText, stressLevel === value && styles.sliderDotTextActive]}>{value}</Text>
                      </Pressable>
                    ))}
                  </View>

                  
                  <Pressable style={[GlobalStyles.btnPrimary, { backgroundColor: Palette.orange, marginTop: 8 }]} onPress={() => setStep(3)}>
                    <Text style={GlobalStyles.btnPrimaryText}>Continue</Text>
                  </Pressable>
                  
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={[GlobalStyles.brandTitle, { marginBottom: 8, color: Palette.forestGreen, fontSize: 24 }]}>
                    Nutrition & health sync
                  </Text>
                  <Text style={[GlobalStyles.bodyText, { marginBottom: 20, color: Palette.textSecondary }]}>
                    Fuel your body for performance and auto-detect stress levels.
                  </Text>

                  <Text style={styles.sectionLabel}>Dietary pattern</Text>
                  <View style={styles.chipRow}>
                    {dietOptions.map((item) => (
                      <Pressable
                        key={item}
                        style={[styles.chip, diet === item && styles.chipActive3]}
                        onPress={() => setDiet(item)}>
                        <Text style={[styles.chipText, diet === item && styles.chipTextActive]}>{item}</Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={styles.sectionLabel}>Allergies & sensitivities</Text>
                  <View style={styles.chipRow}>
                    {allergyOptions.map((item) => {
                      const active = allergies.includes(item);
                      return (
                        <Pressable
                          key={item}
                          style={[styles.chip, active && styles.chipActive3]}
                          onPress={() => toggleSelection(item, allergies, setAllergies)}>
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={styles.sectionLabel}>Primary nutrition friction point</Text>
                  <View style={styles.chipRow}>
                    {frictionOptions.map((item) => {
                    const active = frictionPoint.includes(item);
                    return(
                      <Pressable
                          key={item}
                          style={[styles.chip, active && styles.chipActive3]}
                          onPress={() => toggleSelection(item, frictionPoint, setFrictionPoint)}>
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                        </Pressable>
                    );
                    })}
                  </View>

        

                  
                  <Pressable style={[GlobalStyles.btnPrimary, { backgroundColor: Palette.forestGreen, marginTop: 8 }]} onPress={handleComplete}>
                    <Text style={GlobalStyles.btnPrimaryText}>Complete setup</Text>
                  </Pressable>
                  <Pressable style={[GlobalStyles.btnOutline, { marginTop: 8 }]} onPress={() => setStep(2)}>
                    <Text style={GlobalStyles.btnOutlineText}>Back</Text>
                  </Pressable>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.surfaceWhite, // Matches screen background
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 10,
    marginTop: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E0D6BA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: Palette.surfaceWhite
  },
  chipActive: {
    backgroundColor: Palette.oceanBlue,
    borderColor: Palette.oceanBlue,
  },
  chipActive2: {
    backgroundColor: Palette.orange,
    borderColor: Palette.surfaceOrangeMuted,
  },
  chipActive3: {
    backgroundColor: Palette.forestGreen,
    borderColor: Palette.surfaceGreenMuted,
  },
  chipText: {
    color: Palette.textPrimary,
    fontSize: 13,
  },
  chipTextActive: {
    color: Palette.textWhite,
  },
  optionCard: {
    borderWidth: 1,
    borderColor: '#E0D6BA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: Palette.surfaceWhite,
  },
  optionCardActive: {
    borderColor: Palette.marigold,
    backgroundColor: Palette.surfaceOrangeMuted,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  optionTitleActive: {
    color: Palette.orange,
  },
  optionText: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sliderDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0D6BA',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12
  },
  sliderDotActive: {
    backgroundColor: Palette.orange,
    borderColor: Palette.surfaceOrangeMuted,
  },
  sliderDotText: {
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  sliderDotTextActive: {
    color: Palette.textWhite,
  },
  insightCard: {
    backgroundColor: '#F7FBFF',
    borderWidth: 1,
    borderColor: '#D8EBF8',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.oceanBlue,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
});