
const API_BASE_URL = "http://10.0.2.2:8000";


// ============================================================
// TYPES
// ============================================================

export interface UserProfile {
  name: string;
  email: string;

  general_state: {
    age: number;
    weight_kg?: number;
    height_cm?: number;

    cycle_tracking_mode: string;
    last_period_start_date?: string;
    average_cycle_length: number;
    period_duration: number;

    phase_symptoms?: string[];

    fitness_focus: string;
    current_fitness_level: string;
    equipment: string;

    average_daily_stress: number;

    diet: string;
    allergies?: string[];
    nutrition_friction?: string[];
  };
}


export interface CycleHistory {
  _id?: string;
  user_id: string;

  period_start_date: string;
  period_end_date: string;

  cycle_length: number;
  period_duration: number;

  created_at?: string;
}


export interface DailyState {
  _id?: string;
  user_id: string;

  date: string;

  phase?: string;
  day?: number;

  symptoms?: {
    pain?: string[];
    energy?: string[];
    digestive?: string[];
    appetite?: string;
    mood?: string[];
    physical?: string[];
  };

  period?: {
    is_period_active: boolean;
    flow_rate?: string;

    started_today: boolean;
    ended_today: boolean;

    start_date?: string;
    estimated_end_date?: string;
  };

  sleep?: {
    sleep_hours?: number;
    quality?: string;
  };

  comment?: string;

  created_at?: string;
  updated_at?: string;
}


export interface DailyScore {
  _id?: string;
  user_id: string;

  date: string;

  daily_recovery_score: number;
  stress_level: string;
  phase_energy_score: number;
  strain_output_balance_score: number;

  comment: string;

  created_at?: string;
}


export interface Workout {
  _id?: string;
  user_id: string;

  date: string;

  status?: string;

  info_tag?: string;
  intensity_tag?: string;

  activities: {
    activity_name: string;
    type: string;
    duration_mins?: number;
    sets?: number;
    reps?: number;
    completed?: boolean;
  }[];

  actual_activities?: {
    activity_name: string;
    type?: string;
    duration_mins?: number;
    calories?: number;
  }[];

  created_at?: string;
  generated_at?: string;
  completed_at?: string | null;
  updated_at?: string;
}


export interface Recipe {
  name: string;

  time?: string | null;
  isConsumed?: boolean;

  tags: string[];

  description: string;

  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;

  ingredients: string[];

  comments: string;
}


export interface DailyRecipes {
  _id?: string;
  user_id: string;

  date: string;

  recipes: Recipe[];

  created_at?: string;
  updated_at?: string;
}


export interface FoodVisionOutput {
  name: string;

  protein: number;
  calories: number;
  carbohydrates: number;
  fats: number;

  micronutrients: {
    fiber: number;
    magnesium: number;
    iron: number;
    zinc: number;
  };
}


// ============================================================
// GENERIC REQUEST HELPER
// ============================================================

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        ...(options.headers || {}),
      },

      ...options,
    }
  );


  if (!response.ok) {

    let errorMessage = `API Error: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        errorMessage =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }

    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(errorMessage);
  }


  // Some endpoints may return no content.

  if (response.status === 204) {
    return undefined as T;
  }


  return response.json();
}


// ============================================================
// USER PROFILE
// ============================================================

export async function createUserProfile(
  profile: UserProfile
) {
  return request<{
    user_id: string;
  }>(
    "/api/user-profile",
    {
      method: "POST",
      body: JSON.stringify(profile),
    }
  );
}


export async function getUserProfile(
  userId: string
) {
  return request<UserProfile>(
    `/api/user-profile/${userId}`
  );
}


export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
) {
  return request(
    `/api/user-profile/${userId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}


// ============================================================
// CYCLE HISTORY
// ============================================================

export async function createCycle(
  userId: string,
  cycle: Omit<CycleHistory, "_id" | "user_id" | "created_at">
) {
  return request(
    `/api/cycle-history/${userId}`,
    {
      method: "POST",
      body: JSON.stringify(cycle),
    }
  );
}

export async function getCycleHistory(
  userId: string
) {
  return request<CycleHistory[]>(
    `/api/cycle-history/${userId}`
  );
}

export async function getLatestCycle(
  userId: string
) {
  return request<CycleHistory | null>(
    `/api/cycle-history/${userId}/latest`
  );
}

export async function updateCycle(
  cycleId: string,
  data: Partial<CycleHistory>
) {
  return request(
    `/api/cycle-history/${cycleId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}


// ============================================================
// DAILY STATE
// ============================================================

export async function createDailyState(
  dailyState: DailyState
) {
  return request(
    "/api/daily-state",
    {
      method: "POST",
      body: JSON.stringify(dailyState),
    }
  );
}


export async function getDailyState(
  userId: string,
  date: string
) {
  return request<DailyState | null>(
    `/api/daily-state/${userId}/${date}`
  );
}


export async function updateDailyState(
  userId: string,
  date: string,
  data: Partial<DailyState>
) {
  return request(
    `/api/daily-state/${userId}/${date}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}


// ============================================================
// DAILY SCORE
// ============================================================

export async function getDailyScore(
  userId: string,
  date: string
) {
  return request<DailyScore | null>(
    `/api/daily-score/${userId}/${date}`
  );
}


export async function getRecentScores(
  userId: string,
  limit: number = 7
) {
  return request<DailyScore[]>(
    `/api/daily-score/${userId}/recent?limit=${limit}`
  );
}


// ============================================================
// WORKOUTS
// ============================================================

export async function getTodayWorkout(
  userId: string
) {
  return request<Workout | null>(
    `/api/workout/today/${userId}`
  );
}

export async function getNextWorkouts(
  userId: string
) {
  return request<Workout[]>(
    `/api/workout/next/${userId}`
  );
}

export async function updateTodayWorkout(
  userId: string,
  data: Partial<Workout>
) {
  return request(
    `/api/workout/today/${userId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function getWorkoutHistory(
  userId: string
) {
  return request<Workout[]>(
    `/api/workout/history/${userId}`
  );
}

// ============================================================
// RECIPES
// ============================================================

export async function getRecipes(
  userId: string
) {
  return request<Recipe[]>(
    `/api/recipes/${userId}`
  );
}

export async function getRecipesByTag(
  userId: string,
  tag: string
) {
  return request<Recipe[]>(
    `/api/recipes/${userId}/tag/${encodeURIComponent(tag)}`
  );
}


// ============================================================
// AI — DAILY PLAN
// ============================================================

export async function generateDailyPlan(
  userId: string
) {
  return request(
    `/api/agent/daily/${userId}`,
    {
      method: "POST",
    }
  );
}


// ============================================================
// AI — VISION
// ============================================================

export async function analyzeMealImage(
  imageUri: string
): Promise<FoodVisionOutput> {

  const formData = new FormData();

  formData.append(
    "file",
    {
      uri: imageUri,
      name: "meal.jpg",
      type: "image/jpeg",
    } as any
  );


  const response = await fetch(
    `${API_BASE_URL}/api/food/vision`,
    {
      method: "POST",

      headers: {
        Accept: "application/json",
      },

      body: formData,
    }
  );


  if (!response.ok) {

    let errorMessage =
      `Vision API Error: ${response.status}`;

    try {

      const errorData =
        await response.json();

      if (errorData?.detail) {
        errorMessage =
          typeof errorData.detail === "string"
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }

    } catch {
      // Ignore parsing error
    }

    throw new Error(errorMessage);
  }


  return response.json();
}
