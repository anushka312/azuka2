
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/services/api';
import {
  createCycle,
} from "@/services/api";

const cycleModes = [
  'Natural Cycle',
  'Hormonal Birth Control',
  'Irregular / PCOS',
  'Menopause / Perimenopause',
];

const symptomOptions = [
  'High Fatigue',
  'Intense Cravings',
  'Energy Spikes',
  'Severe Cramps',
  'Brain Fog',
];

const focusOptions = [
  {
    title: 'Weight Loss',
    text: 'A weekly deficit with extra recovery protection.',
  },
  {
    title: 'Consistency',
    text: 'A minimum-win plan that keeps habits sustainable.',
  },
  {
    title: 'Health & Balance',
    text: 'Lower stress reactivity and improve energy stability.',
  },
];

const fitnessLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

const equipmentOptions = [
  'Home',
  'Dumbbells',
  'Full Gym',
  'Outdoor',
];

const dietOptions = [
  'Omnivore',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Pescatarian',
];

const allergyOptions = [
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Soy-Free',
  'Others',
];

const frictionOptions = [
  'Late-night Cravings',
  'Mid-day Energy Crashes',
  'Lack of Prep Time',
  'Under-fueling',
];

function parseDate(
  value: string,
): Date {
  return new Date(
    `${value}T12:00:00`,
  );
}

function formatDate(
  date: Date,
): string {
  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function calculatePhase(
  cycleDay: number,
  periodDuration: number,
  cycleLength: number,
): string {
  if (
    cycleDay >= 1 &&
    cycleDay <= periodDuration
  ) {
    return "Menstrual";
  }

  const ovulationDay =
    Math.round(
      cycleLength / 2,
    );

  if (
    cycleDay <
    ovulationDay
  ) {
    return "Follicular";
  }

  if (
    cycleDay ===
    ovulationDay
  ) {
    return "Ovulation";
  }

  return "Luteal";
}

export default function ProfileSetupScreen() {
  const router = useRouter();

  /*
   * SignupScreen passes:
   *
   * {
   *   email,
   *   name
   * }
   *
   * These values are used to create the NEW MongoDB profile.
   */
  const params = useLocalSearchParams<{
    email?: string;
    name?: string;
  }>();

  const signupEmail =
    typeof params.email === 'string'
      ? params.email.trim()
      : '';

  const signupName =
    typeof params.name === 'string'
      ? params.name.trim()
      : '';

  /*
   * IMPORTANT:
   *
   * ProfileSetup does NOT use AzukaContext to create
   * the MongoDB profile.
   *
   * AuthContext owns the authenticated MongoDB user:
   *
   * ProfileSetup
   *      ↓
   * completeProfile(profile)
   *      ↓
   * MongoDB profile created
   *      ↓
   * MongoDB _id returned
   *      ↓
   * AuthContext stores it as user.userId
   *
   * AzukaContext can then load the user's data from
   * the authenticated AuthContext state.
   */
  const { completeProfile } = useAuth();

  const [step, setStep] = useState(1);

  // ============================================================
  // STEP 1
  // ============================================================

  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState('');

  const [cycleMode, setCycleMode] = useState(
    cycleModes[0]
  );

  const [lastPeriod, setLastPeriod] = useState('');
  const [lastPeriodError, setLastPeriodError] =
    useState('');

  const [cycleLength, setCycleLength] = useState('28');
  const [cycleLengthError, setCycleLengthError] =
    useState('');

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [symptoms, setSymptoms] = useState<string[]>([
    'High Fatigue',
  ]);

  // ============================================================
  // STEP 2
  // ============================================================

  const [focus, setFocus] = useState(
    focusOptions[1].title
  );

  const [fitnessLevel, setFitnessLevel] = useState(
    'Intermediate'
  );

  const [equipment, setEquipment] = useState<string[]>([
    'Home',
  ]);

  const [stressLevel, setStressLevel] = useState(3);

  // ============================================================
  // STEP 3
  // ============================================================

  const [diet, setDiet] = useState('Omnivore');

  const [allergies, setAllergies] = useState<string[]>([
    'Dairy-Free',
  ]);

  const [frictionPoint, setFrictionPoint] =
    useState<string[]>([
      'Late-night Cravings',
    ]);

  const [isProcessing, setIsProcessing] =
    useState(false);

  // ============================================================
  // HELPERS
  // ============================================================

  const toggleSelection = (
    value: string,
    current: string[],
    setCurrent: (value: string[]) => void
  ) => {
    if (current.includes(value)) {
      setCurrent(
        current.filter((item) => item !== value)
      );
    } else {
      setCurrent([...current, value]);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    date?: Date
  ) => {
    setShowDatePicker(false);

    if (date) {
      setSelectedDate(date);

      setLastPeriod(
        formatDate(date)
      );

      if (lastPeriodError) {
        setLastPeriodError('');
      }
    }
  };

  // ============================================================
  // STEP 1 VALIDATION
  // ============================================================

  const validateStepOne = () => {
    const trimmedDate = lastPeriod.trim();

    const datePattern =
      /^\d{4}-\d{2}-\d{2}$/;

    const cycleValue =
      Number(cycleLength);

    const ageValue =
      Number(age);

    const isValidDate =
      datePattern.test(trimmedDate);

    const isValidCycle =
      !Number.isNaN(cycleValue) &&
      cycleValue >= 21 &&
      cycleValue <= 45;

    const isValidAge =
      !Number.isNaN(ageValue) &&
      ageValue >= 13 &&
      ageValue <= 100;

    setLastPeriodError(
      isValidDate
        ? ''
        : 'Please select a valid date.'
    );

    setCycleLengthError(
      isValidCycle
        ? ''
        : 'Cycle length should be between 21 and 45 days.'
    );

    setAgeError(
      isValidAge
        ? ''
        : 'Please enter an age between 13 and 100.'
    );

    if (
      isValidDate &&
      isValidCycle &&
      isValidAge
    ) {
      setStep(2);
    }
  };

  // ============================================================
  // CREATE MONGODB PROFILE
  // ============================================================

  const handleComplete = async () => {
    /*
     * The email and name should have been passed from
     * SignupScreen.
     */
    if (!signupEmail) {
      Alert.alert(
        'Signup information missing',
        'Your account email could not be found. Please restart signup.'
      );

      router.replace('/auth/signup');
      return;
    }

    if (!signupName) {
      Alert.alert(
        'Signup information missing',
        'Your name could not be found. Please restart signup.'
      );

      router.replace('/auth/signup');
      return;
    }

    try {
      setIsProcessing(true);

      /*
       * Build the MongoDB profile.
       *
       * IMPORTANT:
       * There is NO Firebase UID here.
       *
       * The backend finds/creates the MongoDB user
       * using the email.
       */
      const profile: UserProfile = {
        name: signupName,
        email: signupEmail,

        general_state: {
          age: Number(age),

          cycle_tracking_mode:
            cycleMode,

          average_cycle_length:
            Number(cycleLength),

          period_duration: 5,

          phase_symptoms:
            symptoms,

          fitness_focus:
            focus,

          current_fitness_level:
            fitnessLevel,

          equipment:
            equipment.join(', '),

          average_daily_stress:
            stressLevel,

          diet,

          allergies,

          nutrition_friction:
            frictionPoint,
        },

        cycle: {
          last_period_start_date:
            lastPeriod,
        },
      };

      console.log(
        '========================================'
      );

      console.log(
        'PROFILE SETUP: creating MongoDB profile'
      );

      console.log(
        'Name:',
        profile.name
      );

      console.log(
        'Email:',
        profile.email
      );

      console.log(
        'Profile:',
        JSON.stringify(
          profile,
          null,
          2
        )
      );

      console.log(
        '========================================'
      );

      /*
       * AuthContext handles:
       *
       * 1. Sending profile to backend
       * 2. Creating MongoDB user
       * 3. Receiving MongoDB _id
       * 4. Storing that MongoDB _id in AuthContext
       *
       * Firebase UID is NOT used as the MongoDB ID.
       */
      const mongoUserId =
        await completeProfile(profile);

      // ============================================================
      // CREATE INITIAL CYCLE HISTORY
      // ============================================================

      const periodStartDate =
        profile.cycle.last_period_start_date;

      if (mongoUserId && periodStartDate) {
        const today =
          formatDate(new Date());

        const start =
          parseDate(periodStartDate);

        const selected =
          parseDate(today);

        const cycleLength =
          profile.general_state
            .average_cycle_length || 28;

        const periodDuration =
          profile.general_state
            .period_duration || 5;

        const daysSinceStart =
          Math.floor(
            (
              selected.getTime() -
              start.getTime()
            ) /
            (1000 * 60 * 60 * 24),
          );

        let cycleDay =
          daysSinceStart + 1;

        if (cycleDay > cycleLength) {
          cycleDay =
            ((cycleDay - 1) %
              cycleLength) +
            1;
        }

        if (cycleDay < 1) {
          cycleDay = 1;
        }

        const phase =
          calculatePhase(
            cycleDay,
            periodDuration,
            cycleLength,
          );

        const periodEnd =
          new Date(start);

        periodEnd.setDate(
          periodEnd.getDate() +
          periodDuration -
          1,
        );

        await createCycle(
          mongoUserId,
          {
            period_start_date:
              periodStartDate,

            period_end_date:
              formatDate(periodEnd),

            cycle_length:
              cycleLength,

            period_duration:
              periodDuration,

            cycle_day:
              cycleDay,

            phase,
          },
        );

        console.log(
          "AZUKA: initial cycle history created:",
          {
            userId: mongoUserId,
            periodStartDate,
            cycleDay,
            phase,
          },
        );
      }
      console.log(
        'PROFILE SETUP: MongoDB profile created'
      );

      console.log(
        'MONGO USER ID:',
        mongoUserId
      );

      /*
       * At this point AuthContext owns:
       *
       * user.userId   -> MongoDB _id
       * user.name
       * user.email
       *
       * AzukaContext can use that authenticated
       * MongoDB user information to load Azuka data.
       */

      console.log(
        'PROFILE SETUP: completed successfully'
      );

      /*
       * Enter the main application.
       *
       * We do not call initializeNewUser().
       * That function does not exist in AzukaContext.
       */
      router.replace('/home');
    } catch (error) {
      console.error(
        'PROFILE SETUP FAILED:',
        error
      );

      Alert.alert(
        'Unable to complete setup',
        error instanceof Error
          ? error.message
          : 'Something went wrong while creating your profile.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            Palette.creamLight,
        },
      ]}
      edges={['top', 'bottom']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text
            style={[
              GlobalStyles.bodyText,
              {
                color:
                  Palette.oceanBlue,
                marginBottom: 6,
                marginTop: 12,
              },
            ]}
          >
            Step {step} of 3
          </Text>

          {isProcessing ? (
            <View
              style={
                styles.processingContainer
              }
            >
              <Text
                style={[
                  GlobalStyles.brandTitle,
                  {
                    fontSize: 24,
                    color:
                      Palette.marigold,
                    marginBottom: 8,
                  },
                ]}
              >
                Setting up Azuka
              </Text>

              <Text
                style={[
                  GlobalStyles.bodyText,
                  {
                    color:
                      Palette.textSecondary,
                    textAlign: 'center',
                  },
                ]}
              >
                Creating your profile and
                preparing your Azuka data...
              </Text>
            </View>
          ) : (
            <>
              {/* =================================================
                  STEP 1
                  ================================================= */}

              {step === 1 && (
                <>
                  <Text
                    style={[
                      GlobalStyles.brandTitle,
                      {
                        marginBottom: 8,
                        color:
                          Palette.oceanBlue,
                        fontSize: 24,
                      },
                    ]}
                  >
                    Let’s get to know your biology
                  </Text>

                  <Text
                    style={[
                      GlobalStyles.bodyText,
                      {
                        marginBottom: 20,
                        color:
                          Palette.textSecondary,
                      },
                    ]}
                  >
                    Azuka uses your cycle to adapt
                    daily intensity and recovery.
                  </Text>

                  <Text
                    style={styles.sectionLabel}
                  >
                    Age
                  </Text>

                  <TextInput
                    style={
                      GlobalStyles.inputField
                    }
                    placeholder="e.g. 29"
                    keyboardType="number-pad"
                    value={age}
                    onChangeText={(value) => {
                      setAge(value);

                      if (ageError) {
                        setAgeError('');
                      }
                    }}
                  />

                  {ageError ? (
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      {ageError}
                    </Text>
                  ) : null}

                  <Text
                    style={styles.sectionLabel}
                  >
                    Cycle tracking mode
                  </Text>

                  <View
                    style={styles.chipRow}
                  >
                    {cycleModes.map(
                      (mode) => (
                        <Pressable
                          key={mode}
                          style={[
                            styles.chip,
                            cycleMode === mode &&
                            styles.chipActive,
                          ]}
                          onPress={() =>
                            setCycleMode(mode)
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              cycleMode === mode &&
                              styles.chipTextActive,
                            ]}
                          >
                            {mode}
                          </Text>
                        </Pressable>
                      )
                    )}
                  </View>

                  <Text
                    style={styles.sectionLabel}
                  >
                    Last period start date
                  </Text>

                  <Pressable
                    onPress={() =>
                      setShowDatePicker(true)
                    }
                  >
                    <View
                      pointerEvents="none"
                    >
                      <TextInput
                        style={
                          GlobalStyles.inputField
                        }
                        placeholder="YYYY-MM-DD"
                        value={lastPeriod}
                        editable={false}
                      />
                    </View>
                  </Pressable>

                  {showDatePicker ? (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={
                        handleDateChange
                      }
                      maximumDate={
                        new Date()
                      }
                    />
                  ) : null}

                  {lastPeriodError ? (
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      {lastPeriodError}
                    </Text>
                  ) : null}

                  <Text
                    style={styles.sectionLabel}
                  >
                    Average cycle length
                  </Text>

                  <TextInput
                    style={
                      GlobalStyles.inputField
                    }
                    placeholder="28"
                    keyboardType="number-pad"
                    value={cycleLength}
                    onChangeText={(value) => {
                      setCycleLength(value);

                      if (
                        cycleLengthError
                      ) {
                        setCycleLengthError('');
                      }
                    }}
                  />

                  {cycleLengthError ? (
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      {cycleLengthError}
                    </Text>
                  ) : null}

                  <Text
                    style={styles.sectionLabel}
                  >
                    Primary phase symptoms
                  </Text>

                  <View
                    style={styles.chipRow}
                  >
                    {symptomOptions.map(
                      (option) => {
                        const active =
                          symptoms.includes(
                            option
                          );

                        return (
                          <Pressable
                            key={option}
                            style={[
                              styles.chip,
                              active &&
                              styles.chipActive,
                            ]}
                            onPress={() =>
                              toggleSelection(
                                option,
                                symptoms,
                                setSymptoms
                              )
                            }
                          >
                            <Text
                              style={[
                                styles.chipText,
                                active &&
                                styles.chipTextActive,
                              ]}
                            >
                              {option}
                            </Text>
                          </Pressable>
                        );
                      }
                    )}
                  </View>

                  <Pressable
                    style={[
                      GlobalStyles.btnPrimary,
                      {
                        backgroundColor:
                          Palette.oceanBlue,
                        marginTop: 12,
                      },
                    ]}
                    onPress={
                      validateStepOne
                    }
                  >
                    <Text
                      style={
                        GlobalStyles.btnPrimaryText
                      }
                    >
                      Continue
                    </Text>
                  </Pressable>
                </>
              )}

              {/* =================================================
                  STEP 2
                  ================================================= */}

              {step === 2 && (
                <>
                  <Text
                    style={[
                      GlobalStyles.brandTitle,
                      {
                        marginBottom: 8,
                        color:
                          Palette.orange,
                        fontSize: 24,
                      },
                    ]}
                  >
                    Your fitness baseline
                  </Text>

                  <Text
                    style={[
                      GlobalStyles.bodyText,
                      {
                        marginBottom: 20,
                        color:
                          Palette.textSecondary,
                      },
                    ]}
                  >
                    We’ll tailor workout duration
                    and intensity so consistency
                    never breaks.
                  </Text>

                  <Text
                    style={styles.sectionLabel}
                  >
                    Primary focus
                  </Text>

                  {focusOptions.map(
                    (option) => (
                      <Pressable
                        key={option.title}
                        style={[
                          styles.optionCard,
                          focus ===
                          option.title &&
                          styles.optionCardActive,
                        ]}
                        onPress={() =>
                          setFocus(
                            option.title
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.optionTitle,
                            focus ===
                            option.title &&
                            styles.optionTitleActive,
                          ]}
                        >
                          {option.title}
                        </Text>

                        <Text
                          style={
                            styles.optionText
                          }
                        >
                          {option.text}
                        </Text>
                      </Pressable>
                    )
                  )}

                  <Text
                    style={styles.sectionLabel}
                  >
                    Current fitness level
                  </Text>

                  <View
                    style={styles.chipRow}
                  >
                    {fitnessLevels.map(
                      (level) => (
                        <Pressable
                          key={level}
                          style={[
                            styles.chip,
                            fitnessLevel ===
                            level &&
                            styles.chipActive2,
                          ]}
                          onPress={() =>
                            setFitnessLevel(
                              level
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              fitnessLevel ===
                              level &&
                              styles.chipTextActive,
                            ]}
                          >
                            {level}
                          </Text>
                        </Pressable>
                      )
                    )}
                  </View>

                  <Text
                    style={styles.sectionLabel}
                  >
                    Equipment
                  </Text>

                  <View
                    style={styles.chipRow}
                  >
                    {equipmentOptions.map(
                      (item) => {
                        const active =
                          equipment.includes(
                            item
                          );

                        return (
                          <Pressable
                            key={item}
                            style={[
                              styles.chip,
                              active &&
                              styles.chipActive2,
                            ]}
                            onPress={() =>
                              toggleSelection(
                                item,
                                equipment,
                                setEquipment
                              )
                            }
                          >
                            <Text
                              style={[
                                styles.chipText,
                                active &&
                                styles.chipTextActive,
                              ]}
                            >
                              {item}
                            </Text>
                          </Pressable>
                        );
                      }
                    )}
                  </View>

                  <Text
                    style={styles.sectionLabel}
                  >
                    Average daily workload / stress
                  </Text>

                  <View
                    style={styles.sliderRow}
                  >
                    {[1, 2, 3, 4, 5].map(
                      (value) => (
                        <Pressable
                          key={value}
                          style={[
                            styles.sliderDot,
                            stressLevel ===
                            value &&
                            styles.sliderDotActive,
                          ]}
                          onPress={() =>
                            setStressLevel(
                              value
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.sliderDotText,
                              stressLevel ===
                              value &&
                              styles.sliderDotTextActive,
                            ]}
                          >
                            {value}
                          </Text>
                        </Pressable>
                      )
                    )}
                  </View>

                  <Pressable
                    style={[
                      GlobalStyles.btnPrimary,
                      {
                        backgroundColor:
                          Palette.orange,
                        marginTop: 8,
                      },
                    ]}
                    onPress={() =>
                      setStep(3)
                    }
                  >
                    <Text
                      style={
                        GlobalStyles.btnPrimaryText
                      }
                    >
                      Continue
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      GlobalStyles.btnOutline,
                      {
                        marginTop: 8,
                      },
                    ]}
                    onPress={() =>
                      setStep(1)
                    }
                  >
                    <Text
                      style={
                        GlobalStyles.btnOutlineText
                      }
                    >
                      Back
                    </Text>
                  </Pressable>
                </>
              )}

              {/* =================================================
                  STEP 3
                  ================================================= */}

              {step === 3 && (
                <>
                  <Text
                    style={[
                      GlobalStyles.brandTitle,
                      {
                        marginBottom: 8,
                        color:
                          Palette.forestGreen,
                        fontSize: 24,
                      },
                    ]}
                  >
                    Nutrition & health sync
                  </Text>

                  <Text
                    style={[
                      GlobalStyles.bodyText,
                      {
                        marginBottom: 20,
                        color:
                          Palette.textSecondary,
                      },
                    ]}
                  >
                    Fuel your body for performance
                    and recovery.
                  </Text>

                  <Text
                    style={styles.sectionLabel}
                  >
                    Dietary pattern
                  </Text>

                  <View
                    style={styles.chipRow}
                  >
                    {dietOptions.map(
                      (item) => (
                        <Pressable
                          key={item}
                          style={[
                            styles.chip,
                            diet === item &&
                            styles.chipActive3,
                          ]}
                          onPress={() =>
                            setDiet(item)
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              diet === item &&
                              styles.chipTextActive,
                            ]}
                          >
                            {item}
                          </Text>
                        </Pressable>
                      )
                    )}
                  </View>

                  <Text
                    style={styles.sectionLabel}
                  >
                    Allergies & sensitivities
                  </Text>

                  <View
                    style={styles.chipRow}
                  >
                    {allergyOptions.map(
                      (item) => {
                        const active =
                          allergies.includes(
                            item
                          );

                        return (
                          <Pressable
                            key={item}
                            style={[
                              styles.chip,
                              active &&
                              styles.chipActive3,
                            ]}
                            onPress={() =>
                              toggleSelection(
                                item,
                                allergies,
                                setAllergies
                              )
                            }
                          >
                            <Text
                              style={[
                                styles.chipText,
                                active &&
                                styles.chipTextActive,
                              ]}
                            >
                              {item}
                            </Text>
                          </Pressable>
                        );
                      }
                    )}
                  </View>

                  <Text
                    style={styles.sectionLabel}
                  >
                    Primary nutrition friction point
                  </Text>

                  <View
                    style={styles.chipRow}
                  >
                    {frictionOptions.map(
                      (item) => {
                        const active =
                          frictionPoint.includes(
                            item
                          );

                        return (
                          <Pressable
                            key={item}
                            style={[
                              styles.chip,
                              active &&
                              styles.chipActive3,
                            ]}
                            onPress={() =>
                              toggleSelection(
                                item,
                                frictionPoint,
                                setFrictionPoint
                              )
                            }
                          >
                            <Text
                              style={[
                                styles.chipText,
                                active &&
                                styles.chipTextActive,
                              ]}
                            >
                              {item}
                            </Text>
                          </Pressable>
                        );
                      }
                    )}
                  </View>

                  <Pressable
                    disabled={isProcessing}
                    style={[
                      GlobalStyles.btnPrimary,
                      {
                        backgroundColor:
                          Palette.forestGreen,
                        marginTop: 8,
                        opacity:
                          isProcessing
                            ? 0.7
                            : 1,
                      },
                    ]}
                    onPress={
                      handleComplete
                    }
                  >
                    <Text
                      style={
                        GlobalStyles.btnPrimaryText
                      }
                    >
                      {isProcessing
                        ? 'Setting up...'
                        : 'Complete setup'}
                    </Text>
                  </Pressable>

                  <Pressable
                    disabled={isProcessing}
                    style={[
                      GlobalStyles.btnOutline,
                      {
                        marginTop: 8,
                      },
                    ]}
                    onPress={() =>
                      setStep(2)
                    }
                  >
                    <Text
                      style={
                        GlobalStyles.btnOutlineText
                      }
                    >
                      Back
                    </Text>
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
    backgroundColor:
      Palette.surfaceWhite,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  container: {
    width: '100%',
    maxWidth: 700,
  },

  processingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color:
      Palette.textPrimary,
    marginBottom: 10,
    marginTop: 6,
  },

  errorText: {
    color:
      Palette.crimson,
    marginTop: -8,
    marginBottom: 8,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  chip: {
    borderWidth: 1,
    borderColor:
      '#E0D6BA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor:
      Palette.surfaceWhite,
  },

  chipActive: {
    backgroundColor:
      Palette.oceanBlue,
    borderColor:
      Palette.oceanBlue,
  },

  chipActive2: {
    backgroundColor:
      Palette.orange,
    borderColor:
      Palette.surfaceOrangeMuted,
  },

  chipActive3: {
    backgroundColor:
      Palette.forestGreen,
    borderColor:
      Palette.surfaceGreenMuted,
  },

  chipText: {
    color:
      Palette.textPrimary,
    fontSize: 13,
  },

  chipTextActive: {
    color:
      Palette.textWhite,
  },

  optionCard: {
    borderWidth: 1,
    borderColor:
      '#E0D6BA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor:
      Palette.surfaceWhite,
  },

  optionCardActive: {
    borderColor:
      Palette.marigold,
    backgroundColor:
      Palette.surfaceOrangeMuted,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color:
      Palette.textPrimary,
    marginBottom: 4,
  },

  optionTitleActive: {
    color:
      Palette.orange,
  },

  optionText: {
    fontSize: 13,
    color:
      Palette.textSecondary,
    lineHeight: 18,
  },

  sliderRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 12,
  },

  sliderDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor:
      '#E0D6BA',
    alignItems: 'center',
    justifyContent:
      'center',
    marginHorizontal: 12,
  },

  sliderDotActive: {
    backgroundColor:
      Palette.orange,
    borderColor:
      Palette.surfaceOrangeMuted,
  },

  sliderDotText: {
    fontWeight: '700',
    color:
      Palette.textPrimary,
  },

  sliderDotTextActive: {
    color:
      Palette.textWhite,
  },
});
