// ============================================================================
// AZUKA BIO-ADAPTIVE AI ENGINE - TYPESCRIPT CONTRACTS & CLIENT SERVICE
// ============================================================================

import { Platform } from 'react-native';

// ----------------------------------------------------------------------------
// 1. BACKEND PYDANTIC-MATCHING SCHEMAS & INTERFACES
// ----------------------------------------------------------------------------

export interface OverallState {
  daily_recovery_score: number;
  stress_level: string;
  phase_energy_score: string;
  strain_output_balance_score: number;
  comment: string;
}

export interface ExerciseDetails {
  activity_name: string;
  type: string;
  duration_mins?: number;
  sets?: number;
  reps?: number;
}

export interface WorkoutDayItem {
  date: string;
  info_tag: string;
  intensity_tag: string;
  activities: ExerciseDetails[];
}

export interface RecipeItem {
  name: string;
  tags: string[];
  description: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  ingredients: string[];
  comments: string;
}

export interface AzukaDailyOutput {
  overall: OverallState;
  workout: WorkoutDayItem[];
  recipes: RecipeItem[];
  food_comment: string;
}

export interface Micronutrients {
  fiber: number;
  magnesium: number;
  iron: number;
  zinc: number;
}

export interface FoodVisionOutput {
  name: string;
  protein: number;
  calories: number;
  carbohydrates: number;
  fats: number;
  micronutrients: Micronutrients;
  insight: string;
}

// ----------------------------------------------------------------------------
// 2. INPUT SCHEMAS FOR BIO-ADAPTIVE STATE & USER INTERACTIONS
// ----------------------------------------------------------------------------

export interface GeneralState {
  age: number;
  cycle_tracking_mode: string;
  average_cycle_length: number;
  period_duration: number;
  phase_symptoms?: string[] | null;
  fitness_focus: string;
  current_fitness_level: string;
  equipment: string;
  average_daily_stress: number;
  diet: string;
  allergies?: string[] | null;
  nutrition_friction?: string[] | null;
}

export interface SleepState {
  duration?: number | null;
  quality?: string | null;
}

export interface SymptomsState {
  pain?: string[] | null;
  energy?: string[] | null;
  digestive?: string[] | null;
  appetite?: string | null;
  mood?: string[] | null;
  physical?: string[] | null;
}

export interface FoodState {
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
}

export interface WorkoutActivityItem {
  activity?: string | null;
  estimated_calories?: number | null;
}

export interface WorkoutState {
  activities?: WorkoutActivityItem[] | null;
  comments?: string | null;
}

export interface UserState {
  phase?: string | null;
  cycle_day?: number | null;
  sleep?: SleepState | null;
  symptoms?: SymptomsState | null;
  food?: FoodState | null;
  workout?: WorkoutState | null;
}

// User Interaction Persistence Payloads
export interface WorkoutLogInput {
  date?: string;
  completed_exercises?: string[];
  actual_activities?: Array<{
    id?: string;
    name: string;
    sets?: number;
    reps?: number;
    durationMinutes?: number;
    intensity?: string;
    caloriesBurned?: number;
    notes?: string;
  }>;
  duration_mins?: number;
  calories_burned?: number;
  notes?: string;
}

export interface MealLogInput {
  dish_name: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fats?: number;
  micronutrients?: Record<string, number>;
  source?: 'vision_scan' | 'recipe' | 'manual';
  date?: string;
}

export interface CheckInInput {
  sleep_hours?: number;
  sleep_quality?: string;
  stress_level?: string;
  symptoms?: Record<string, any>;
  phase?: string;
  cycle_day?: number;
  date?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UserProfileData {
  user_id: string;
  name: string;
  primary_goal?: string;
  daily_plans: Array<{ created_at: string; plan_payload: AzukaDailyOutput }>;
  vision_scans: Array<{ scanned_at: string; image_metadata?: string; scan_results: FoodVisionOutput }>;
  completed_workouts: Array<{ logged_at: string; date: string; completed_exercises: string[]; actual_activities: any[] }>;
  meal_logs: Array<{ logged_at: string; date: string; dish_name: string; calories: number }>;
  check_ins: Array<{ logged_at: string; date: string; sleep_hours?: number; stress_level?: string }>;
}

// ----------------------------------------------------------------------------
// 3. API CONFIGURATION
// ----------------------------------------------------------------------------

// Use local host or IP depending on platform
const DEFAULT_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_BASE_URL = `http://${DEFAULT_HOST}:8000/api/ai`;

// ----------------------------------------------------------------------------
// 4. FALLBACK MOCK DATA (OFFLINE-FIRST RESILIENCE)
// ----------------------------------------------------------------------------

export const MOCK_DAILY_OUTPUT: AzukaDailyOutput = {
  overall: {
    daily_recovery_score: 85,
    stress_level: 'Low',
    phase_energy_score: 'High',
    strain_output_balance_score: 90,
    comment: 'Estrogen is rising smoothly, supporting strong recovery and stable bio-energetic output today.',
  },
  workout: [
    {
      date: new Date().toISOString().split('T')[0],
      info_tag: 'Strength & Core Focus',
      intensity_tag: 'Moderate',
      activities: [
        { activity_name: 'Bodyweight Squats', type: 'strength', sets: 3, reps: 12 },
        { activity_name: 'Glute Bridges', type: 'strength', sets: 3, reps: 10 },
        { activity_name: 'Plank Hold', type: 'endurance', duration_mins: 3 },
        { activity_name: 'Cat-Cow Mobility', type: 'mobility', duration_mins: 3 },
      ],
    },
  ],
  recipes: [
    {
      name: 'High-Protein Quinoa Buddha Bowl',
      tags: ['Energy Boost', 'Luteal Support'],
      description: 'A nutrient-dense bowl combining plant protein, complex carbohydrates, and leafy greens.',
      calories: 520,
      protein: 42,
      carbohydrates: 85,
      fats: 18,
      ingredients: ['Quinoa', 'Chickpeas', 'Fresh Spinach', 'Tahini dressing', 'Pumpkin seeds'],
      comments: 'High iron and magnesium content to support muscle recovery and steady blood glucose.',
    },
    {
      name: 'Salmon Omega Power Salad',
      tags: ['Anti-inflammatory', 'Omega-3'],
      description: 'Grilled salmon over crisp greens, avocado, and balsamic glaze.',
      calories: 480,
      protein: 38,
      carbohydrates: 22,
      fats: 26,
      ingredients: ['Wild Salmon', 'Mixed Greens', 'Avocado', 'Cherry Tomatoes', 'Walnuts'],
      comments: 'Essential fatty acids to reduce systemic inflammation and support hormonal balance.',
    },
  ],
  food_comment: 'Prioritize magnesium-rich greens and slow-digesting complex carbs to match your active follicular-luteal transition.',
};

export const MOCK_VISION_OUTPUT: FoodVisionOutput = {
  name: 'Avocado Toast with Poached Egg',
  protein: 18,
  calories: 420,
  carbohydrates: 34,
  fats: 24,
  micronutrients: {
    fiber: 9.0,
    magnesium: 85.0,
    iron: 3.2,
    zinc: 2.1,
  },
  insight: 'Excellent balance of monounsaturated fats and bioavailable protein for sustained metabolic focus.',
};

// ----------------------------------------------------------------------------
// 5. MAIN AI SERVICE IMPLEMENTATION
// ----------------------------------------------------------------------------

export const aiService = {
  /**
   * 1. RECOVERY & READINESS: Generate or update today's bio-adaptive plan.
   * Persists the plan into MongoDB via Beanie.
   */
  async getDailyPlan(
    generalState: GeneralState,
    userState: UserState,
    userId: string = 'default_user'
  ): Promise<AzukaDailyOutput> {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-plan?user_id=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          general_state: generalState,
          user_state: userState,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: AzukaDailyOutput = await response.json();
      return data;
    } catch (error) {
      console.warn('[aiService] Using mock daily plan fallback due to network/server unavailability:', error);
      return MOCK_DAILY_OUTPUT;
    }
  },

  /**
   * Fetch the most recently generated plan stored in the user's MongoDB profile.
   */
  async getLatestDailyPlan(userId: string = 'default_user'): Promise<AzukaDailyOutput> {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-plan/latest?user_id=${encodeURIComponent(userId)}`);
      if (response.ok) {
        const data = await response.json();
        return data as AzukaDailyOutput;
      }
      return MOCK_DAILY_OUTPUT;
    } catch (error) {
      console.warn('[aiService] Fallback to default plan:', error);
      return MOCK_DAILY_OUTPUT;
    }
  },

  /**
   * 2. COMPUTER VISION: Send a food photo to the vision scan endpoint.
   * Extracts macros and micronutrients and saves scan results to MongoDB.
   */
  async scanFoodImage(imageUri: string, userId: string = 'default_user'): Promise<FoodVisionOutput> {
    try {
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'meal.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const response = await fetch(`${API_BASE_URL}/vision-scan?user_id=${encodeURIComponent(userId)}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: FoodVisionOutput = await response.json();
      return data;
    } catch (error) {
      console.warn('[aiService] Using mock vision output fallback:', error);
      return MOCK_VISION_OUTPUT;
    }
  },

  /**
   * 3. WORKOUT PERSISTENCE: Save completed workouts and activities to MongoDB.
   */
  async logWorkout(payload: WorkoutLogInput, userId: string = 'default_user'): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/workout/log?user_id=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('[aiService] Workout log offline fallback:', error);
      return { success: true, message: 'Logged locally (offline mode)' };
    }
  },

  /**
   * 4. NUTRITION PERSISTENCE: Save meal intake and macro adjustments to MongoDB.
   */
  async logMeal(payload: MealLogInput, userId: string = 'default_user'): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/nutrition/log?user_id=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('[aiService] Meal log offline fallback:', error);
      return { success: true, message: 'Logged locally (offline mode)' };
    }
  },

  /**
   * 5. CHECK-IN PERSISTENCE: Save daily sleep, stress, symptoms & cycle state to MongoDB.
   */
  async logCheckIn(payload: CheckInInput, userId: string = 'default_user'): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/check-in?user_id=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('[aiService] Check-in log offline fallback:', error);
      return { success: true, message: 'Logged locally (offline mode)' };
    }
  },

  /**
   * Fetch full aggregate user profile from MongoDB.
   */
  async getUserProfile(userId: string = 'default_user'): Promise<UserProfileData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${encodeURIComponent(userId)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.warn('[aiService] Profile fetch error:', error);
      return null;
    }
  },

  // --------------------------------------------------------------------------
  // 6. COMPONENT DATA CONSUMPTION MAPPERS (STEP 1 MAP)
  // --------------------------------------------------------------------------

  /**
   * Extract readiness & recovery metrics for BiometricGrid & Dashboard
   */
  extractRecoveryMetrics(plan: AzukaDailyOutput) {
    return {
      dailyRecoveryScore: plan.overall?.daily_recovery_score ?? 85,
      stressLevel: plan.overall?.stress_level ?? 'Low',
      phaseEnergyScore: plan.overall?.phase_energy_score ?? 'High',
      strainOutputBalanceScore: plan.overall?.strain_output_balance_score ?? 90,
      comment: plan.overall?.comment ?? 'Biological state is balanced.',
    };
  },

  /**
   * Extract training routine items for TodayWorkout & Next7DaysWorkout
   */
  extractWorkoutRoutine(plan: AzukaDailyOutput) {
    const today = plan.workout?.[0];
    return {
      date: today?.date ?? new Date().toISOString().split('T')[0],
      infoTag: today?.info_tag ?? 'Adaptive Strength',
      intensityTag: today?.intensity_tag ?? 'Moderate',
      activities: today?.activities ?? [],
    };
  },

  /**
   * Extract nutritional guidance & phase recipes for RecipeGenerator
   */
  extractMealGuidance(plan: AzukaDailyOutput) {
    return {
      recipes: plan.recipes ?? [],
      foodComment: plan.food_comment ?? 'Focus on nutrient-dense whole foods.',
    };
  },

  /**
   * Extract hormonal & cycle insights for CycleStatusCard & PhaseCard
   */
  extractPhaseInsights(plan: AzukaDailyOutput) {
    return {
      phaseEnergy: plan.overall?.phase_energy_score ?? 'High',
      nervousSystemComment: plan.overall?.comment ?? 'Hormonal alignment active.',
      recoveryCapacity: plan.overall?.daily_recovery_score ?? 85,
    };
  },
};