
// ============================================================================
// AZUKA BIO-ADAPTIVE AI ENGINE - TYPESCRIPT CONTRACTS & CLIENT SERVICE
// ============================================================================

import { Platform } from 'react-native';
import { generateDailyPlan, analyzeMealImage } from './api';

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
  insight?: string;
}

// ----------------------------------------------------------------------------
// 2. INPUT SCHEMAS FOR BIO-ADAPTIVE STATE
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

// ----------------------------------------------------------------------------
// 3. USER INTERACTION TYPES
// ----------------------------------------------------------------------------

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

  daily_plans: Array<{
    created_at: string;
    plan_payload: AzukaDailyOutput;
  }>;

  vision_scans: Array<{
    scanned_at: string;
    image_metadata?: string;
    scan_results: FoodVisionOutput;
  }>;

  completed_workouts: Array<{
    logged_at: string;
    date: string;
    completed_exercises: string[];
    actual_activities: any[];
  }>;

  meal_logs: Array<{
    logged_at: string;
    date: string;
    dish_name: string;
    calories: number;
  }>;

  check_ins: Array<{
    logged_at: string;
    date: string;
    sleep_hours?: number;
    stress_level?: string;
  }>;
}

// ----------------------------------------------------------------------------
// 4. MAIN AI SERVICE (DELEGATES TO CANONICAL SERVICES/API.TS FLOW)
// ----------------------------------------------------------------------------

export const aiService = {
  // ==========================================================================
  // 1. GENERATE DAILY PLAN (Canonical: POST /api/agent/daily/{userId})
  // ==========================================================================

  async getDailyPlan(
    userId: string
  ): Promise<AzukaDailyOutput> {
    return generateDailyPlan(userId) as Promise<AzukaDailyOutput>;
  },

  // ==========================================================================
  // 2. FOOD VISION SCAN (Canonical: POST /api/food/vision)
  // ==========================================================================

  async scanFoodImage(
    imageUri: string
  ): Promise<FoodVisionOutput> {
    return analyzeMealImage(imageUri);
  },

  // ==========================================================================
  // 3. WORKOUT LOG
  // ==========================================================================
  //
  // NOTE:
  // Your currently provided FastAPI AI router does NOT have:
  //
  // POST /api/ai/workout/log
  //
  // Therefore this method is intentionally not making a fake request.
  //
  // If you create that backend route later, add the fetch here.
  //

  async logWorkout(
    _payload: WorkoutLogInput,
    _userId?: string,
  ): Promise<ApiResponse> {
    console.warn(
      '[aiService] logWorkout: No corresponding FastAPI AI route has been provided.',
    );

    return {
      success: false,
      message:
        'Workout logging endpoint is not implemented in the current AI API.',
    };
  },

  // ==========================================================================
  // 4. MEAL LOG
  // ==========================================================================
  //
  // No /api/ai/nutrition/log route exists in the FastAPI router provided.
  //

  async logMeal(
    _payload: MealLogInput,
    _userId?: string,
  ): Promise<ApiResponse> {
    console.warn(
      '[aiService] logMeal: No corresponding FastAPI AI route has been provided.',
    );

    return {
      success: false,
      message:
        'Meal logging endpoint is not implemented in the current AI API.',
    };
  },

  // ==========================================================================
  // 5. CHECK-IN
  // ==========================================================================
  //
  // No /api/ai/check-in route exists in the FastAPI router provided.
  //

  async logCheckIn(
    _payload: CheckInInput,
    _userId?: string,
  ): Promise<ApiResponse> {
    console.warn(
      '[aiService] logCheckIn: No corresponding FastAPI AI route has been provided.',
    );

    return {
      success: false,
      message:
        'Check-in endpoint is not implemented in the current AI API.',
    };
  },

  // ==========================================================================
  // 6. PROFILE
  // ==========================================================================
  //
  // No /api/ai/profile route exists in the FastAPI router provided.
  //
  // IMPORTANT:
  // User profile operations already belong to your separate
  // /api/user-profile router and should continue using api.ts.
  //

  async getUserProfileByEmail(
    _userId?: string,
  ): Promise<UserProfileData | null> {
    console.warn(
      '[aiService] getUserProfileByEmail: Use the user-profile API service instead.',
    );

    return null;
  },

  // ==========================================================================
  // 7. COMPONENT DATA CONSUMPTION MAPPERS
  // ==========================================================================

  extractRecoveryMetrics(plan: AzukaDailyOutput) {
    return {
      dailyRecoveryScore:
        plan.overall?.daily_recovery_score ?? 85,

      stressLevel:
        plan.overall?.stress_level ?? 'Low',

      phaseEnergyScore:
        plan.overall?.phase_energy_score ?? 'High',

      strainOutputBalanceScore:
        plan.overall?.strain_output_balance_score ?? 90,

      comment:
        plan.overall?.comment ??
        'Biological state is balanced.',
    };
  },

  extractWorkoutRoutine(plan: AzukaDailyOutput) {
    const today = plan.workout?.[0];

    return {
      date:
        today?.date ??
        new Date().toISOString().split('T')[0],

      infoTag:
        today?.info_tag ??
        'Adaptive Strength',

      intensityTag:
        today?.intensity_tag ??
        'Moderate',

      activities:
        today?.activities ?? [],
    };
  },

  extractMealGuidance(plan: AzukaDailyOutput) {
    return {
      recipes: plan.recipes ?? [],

      foodComment:
        plan.food_comment ??
        'Focus on nutrient-dense whole foods.',
    };
  },

  extractPhaseInsights(plan: AzukaDailyOutput) {
    return {
      phaseEnergy:
        plan.overall?.phase_energy_score ?? 'High',

      nervousSystemComment:
        plan.overall?.comment ??
        'Hormonal alignment active.',

      recoveryCapacity:
        plan.overall?.daily_recovery_score ?? 85,
    };
  },
};
