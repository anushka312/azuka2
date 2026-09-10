const API_BASE_URL =
  'http://10.78.190.184:8000';

// ============================================================
// TYPES
// ============================================================

export interface GeneralState {
  age: number;
  weight_kg?: number | null;
  height_cm?: number | null;
  cycle_tracking_mode: string;
  average_cycle_length: number;
  period_duration: number;
  phase_symptoms: string[];
  fitness_focus: string;
  current_fitness_level: string;
  equipment: string;
  average_daily_stress: number;
  diet: string;
  allergies: string[];
  nutrition_friction: string[];
}

export interface CycleState {
  last_period_start_date?: string | null;
}

export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  general_state: GeneralState;
  cycle: CycleState;
}

export interface CreateUserProfile {
  name: string;
  email: string;
  general_state: GeneralState;
  cycle: CycleState;
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

export interface DailyScoreResponse {
  today: DailyScore | null;
  history: DailyScore[];
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

  insight?: string;
}

// ============================================================
// ERROR HELPERS
// ============================================================

/**
 * The backend's JSON `detail` message can be anything
 * ("No cycle history found.", "User not found.", etc).
 * We used to detect "not found" by checking whether that
 * arbitrary text happened to contain the string "404" -
 * which silently breaks the moment the backend's wording
 * doesn't include it. Instead, `request()` now attaches the
 * real HTTP status to the thrown error, and this helper reads
 * that status directly.
 */
function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status?: number }).status === 404
  );
}

// ============================================================
// GENERIC REQUEST HELPER
// ============================================================

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(
    '[AZUKA API]',
    options.method || 'GET',
    url,
  );

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    console.error(
      '[AZUKA API] Network error:',
      error,
    );

    throw new Error(
      `Network request failed: ${
        error instanceof Error
          ? error.message
          : 'Unknown network error'
      }`,
    );
  }

  if (!response.ok) {
    let message = `API Error: ${response.status}`;

    try {
      const data = await response.json();

      if (data?.detail) {
        message =
          typeof data.detail === 'string'
            ? data.detail
            : JSON.stringify(data.detail);
      }
    } catch {
      // Ignore JSON parsing errors
    }

    console.error(
      '[AZUKA API]',
      response.status,
      message,
    );

    // IMPORTANT: keep the numeric HTTP status attached to the
    // error object itself. `message` above may be overwritten by
    // whatever text the backend puts in `detail`, so callers must
    // never try to detect a 404 by string-matching `message`.
    const httpError = new Error(message) as Error & {
      status?: number;
    };

    httpError.status = response.status;

    throw httpError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ============================================================
// USER PROFILE
// ============================================================

export async function createUserProfile(
  profile: CreateUserProfile,
): Promise<{ user_id: string }> {
  return request<{ user_id: string }>(
    '/api/user-profile',
    {
      method: 'POST',
      body: JSON.stringify(profile),
    },
  );
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile> {
  return request<UserProfile>(
    `/api/user-profile/${encodeURIComponent(
      userId,
    )}`,
  );
}

export async function getUserProfileByEmail(
  email: string,
): Promise<UserProfile> {
  return request<UserProfile>(
    `/api/user-profile/email/${encodeURIComponent(
      email.trim(),
    )}`,
  );
}

export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>,
) {
  return request(
    `/api/user-profile/${encodeURIComponent(
      userId,
    )}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  );
}

// ============================================================
// CYCLE HISTORY
// ============================================================

export async function createCycle(
  userId: string,
  cycle: Omit<
    CycleHistory,
    "_id" | "user_id" | "created_at"
  >,
): Promise<CycleHistory> {
  return request<CycleHistory>(
    `/api/cycle-history/${encodeURIComponent(userId)}`,
    {
      method: "POST",
      body: JSON.stringify(cycle),
    },
  );
}

export async function getCycleHistory(
  userId: string,
): Promise<CycleHistory[]> {
  try {
    const cycles =
      await request<CycleHistory[]>(
        `/api/cycle-history/${encodeURIComponent(
          userId,
        )}`,
      );

    console.log(
      '[AZUKA API] Cycle history:',
      cycles,
    );

    return cycles ?? [];
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getLatestCycle(
  userId: string,
): Promise<CycleHistory | null> {
  try {
    return await request<CycleHistory | null>(
      `/api/cycle-history/${encodeURIComponent(
        userId,
      )}/latest`,
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function updateCycle(
  cycleId: string,
  data: Partial<CycleHistory>,
) {
  return request(
    `/api/cycle-history/${encodeURIComponent(
      cycleId,
    )}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  );
}

// ============================================================
// DAILY STATE
// ============================================================

// ============================================================
// DAILY STATE
// ============================================================

export async function createDailyState(
  userId: string,
  dailyState: Omit<DailyState, "_id" | "user_id" | "created_at" | "updated_at">,
): Promise<DailyState> {
  return request<DailyState>(
    `/api/daily-state/${encodeURIComponent(userId)}`,
    {
      method: "POST",
      body: JSON.stringify(dailyState),
    },
  );
}
    
export async function getDailyState(
  userId: string,
  date: string,
): Promise<DailyState | null> {
  try {
    return await request<DailyState>(
      `/api/daily-state/${encodeURIComponent(
        userId,
      )}/${encodeURIComponent(date)}`,
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getDailyStates(
  userId: string,
): Promise<DailyState[]> {
  try {
    const dailyStates =
      await request<DailyState[]>(
        `/api/daily-state/${encodeURIComponent(userId)}`,
      );

    console.log(
      "[AZUKA API] All daily states:",
      dailyStates,
    );

    return dailyStates ?? [];
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }

    throw error;
  }
}

export async function updateDailyState(
  userId: string,
  date: string,
  data: Partial<DailyState>,
): Promise<DailyState> {
  return request<DailyState>(
    `/api/daily-state/${encodeURIComponent(
      userId,
    )}/${encodeURIComponent(date)}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

// ============================================================
// SAVE DAILY STATE
// ============================================================

export async function saveDailyState(
  userId: string,
  date: string,
  data: Partial<DailyState>,
): Promise<DailyState> {
  console.log(
    "[AZUKA API] Saving daily state:",
    {
      userId,
      date,
      data,
    },
  );

  // First try PUT.
  // This is ideal if your backend PUT creates/updates the
  // daily state for that user + date.
  try {
    return await updateDailyState(
      userId,
      date,
      data,
    );
  } catch (error) {
    // If the document does not exist yet, create it.
    if (!isNotFoundError(error)) {
      throw error;
    }

    return createDailyState(
      userId,
      {
        date,
        ...data,
      },
    );
  }
}

// ============================================================
// DAILY SCORES
// ============================================================

export async function getDailyScore(
  userId: string,
  date?: string,
): Promise<DailyScore | null> {
  try {
    const response = await request<
      DailyScoreResponse | DailyScore | null
    >(
      `/api/daily-scores/${encodeURIComponent(userId)}`,
    );

    console.log(
      "[AZUKA API] Raw daily score response:",
      response,
    );

    console.log(
      "[AZUKA API] Requested score date:",
      date,
    );

    // --------------------------------------------------------
    // NO RESPONSE
    // --------------------------------------------------------

    if (!response) {
      console.log(
        "[AZUKA API] No daily score response.",
      );

      return null;
    }

    // --------------------------------------------------------
    // CASE 1:
    // Backend returned a single DailyScore directly
    //
    // {
    //   user_id: "...",
    //   date: "2026-09-10",
    //   daily_recovery_score: 65,
    //   stress_level: "Moderate",
    //   phase_energy_score: 50,
    //   strain_output_balance_score: 70,
    //   comment: "..."
    // }
    // --------------------------------------------------------

    if (
      "date" in response &&
      "daily_recovery_score" in response
    ) {
      const directScore =
        response as DailyScore;

      if (!date || directScore.date === date) {
        console.log(
          "[AZUKA API] Using direct daily score:",
          directScore,
        );

        return directScore;
      }

      console.log(
        "[AZUKA API] Direct score date does not match requested date.",
      );

      return null;
    }

    // --------------------------------------------------------
    // CASE 2:
    // Backend returned:
    //
    // {
    //   today: DailyScore | null,
    //   history: DailyScore[]
    // }
    // --------------------------------------------------------

    const scoreResponse =
      response as DailyScoreResponse;

    const todayScore =
      scoreResponse?.today ?? null;

    const history =
      scoreResponse?.history ?? [];

    // --------------------------------------------------------
    // NO SPECIFIC DATE
    //
    // Return today's score.
    // --------------------------------------------------------

    if (!date) {
      console.log(
        "[AZUKA API] Returning today's score:",
        todayScore,
      );

      return todayScore;
    }

    // --------------------------------------------------------
    // IMPORTANT:
    //
    // If the requested date is today's date, FIRST check
    // response.today.
    //
    // Do NOT assume today's score also exists in history.
    // --------------------------------------------------------

    if (
      todayScore &&
      todayScore.date === date
    ) {
      console.log(
        "[AZUKA API] Found requested score in response.today:",
        todayScore,
      );

      return todayScore;
    }

    // --------------------------------------------------------
    // Otherwise search history.
    // --------------------------------------------------------

    const selectedScore =
      history.find(
        (score) => score.date === date,
      ) ?? null;

    console.log(
      "[AZUKA API] Found requested score in history:",
      selectedScore,
    );

    // --------------------------------------------------------
    // FINAL DEBUGGING
    // --------------------------------------------------------

    if (!selectedScore) {
      console.log(
        "[AZUKA API] No score found for requested date:",
        date,
      );

      console.log(
        "[AZUKA API] Today's score was:",
        todayScore,
      );

      console.log(
        "[AZUKA API] History was:",
        history,
      );
    }

    return selectedScore;
  } catch (error) {
    if (isNotFoundError(error)) {
      console.log(
        "[AZUKA API] Daily score endpoint returned 404.",
      );

      return null;
    }

    console.error(
      "[AZUKA API] Failed to fetch daily score:",
      error,
    );

    throw error;
  }
}

export async function getRecentScores(
  userId: string,
  limit: number = 7,
): Promise<DailyScore[]> {
  try {
    const response = await request<
      DailyScore[] | DailyScoreResponse | null
    >(
      `/api/daily-scores/${encodeURIComponent(
        userId,
      )}/recent?limit=${limit}`,
    );

    console.log(
      "[AZUKA API] Raw recent scores response:",
      response,
    );

    if (!response) {
      console.log(
        "[AZUKA API] No recent scores response.",
      );
      return [];
    }

    // Backend returned the array directly
    if (Array.isArray(response)) {
      console.log(
        "[AZUKA API] Recent scores array:",
        response,
      );

      console.log(
        "[AZUKA API] Recent score dates:",
        response.map((score) => ({
          date: score.date,
          strain: score.strain_output_balance_score,
        })),
      );

      return response;
    }

    // Backend returned { today, history }
    if (Array.isArray(response.history)) {
      console.log(
        "[AZUKA API] Recent scores from history:",
        response.history,
      );

      console.log(
        "[AZUKA API] Recent score dates:",
        response.history.map((score) => ({
          date: score.date,
          strain: score.strain_output_balance_score,
        })),
      );

      return response.history
        .filter(
          (score): score is DailyScore =>
            !!score &&
            typeof score.date === "string" &&
            typeof score.strain_output_balance_score ===
              "number",
        )
        .sort(
          (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime(),
        )
        .slice(-limit);
    }

    console.log(
      "[AZUKA API] Unexpected recent scores response shape:",
      response,
    );

    return [];
  } catch (error) {
    if (isNotFoundError(error)) {
      console.log(
        "[AZUKA API] Recent scores endpoint returned 404.",
      );
      return [];
    }

    console.error(
      "[AZUKA API] Failed to fetch recent scores:",
      error,
    );

    throw error;
  }
}

// ============================================================
// WORKOUTS
// ============================================================

export async function getTodayWorkout(
  userId: string,
): Promise<Workout | null> {
  try {
    return await request<Workout>(
      `/api/workout/today/${encodeURIComponent(
        userId,
      )}`,
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getNextWorkouts(
  userId: string,
): Promise<Workout[]> {
  try {
    const workouts =
      await request<Workout[]>(
        `/api/workout/next/${encodeURIComponent(
          userId,
        )}`,
      );

    console.log(
      '[AZUKA API] Next workouts:',
      workouts,
    );

    return workouts ?? [];
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }

    throw error;
  }
}

export async function updateTodayWorkout(
  userId: string,
  data: Partial<Workout>,
) {
  return request(
    `/api/workout/today/${encodeURIComponent(
      userId,
    )}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  );
}

export async function getWorkoutHistory(
  userId: string,
): Promise<Workout[]> {
  try {
    const workouts =
      await request<Workout[]>(
        `/api/workout/history/${encodeURIComponent(
          userId,
        )}`,
      );

    console.log(
      '[AZUKA API] Workout history:',
      workouts,
    );

    return workouts ?? [];
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }

    throw error;
  }
}

// ============================================================
// RECIPES
// ============================================================

export async function getRecipes(
  userId: string,
): Promise<DailyRecipes[]> {
  try {
    const recipes =
      await request<DailyRecipes[]>(
        `/api/recipes/${encodeURIComponent(
          userId,
        )}`,
      );

    console.log(
      '[AZUKA API] Recipes:',
      recipes,
    );

    return recipes ?? [];
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getRecipesByTag(
  userId: string,
  tag: string,
): Promise<Recipe[]> {
  try {
    return await request<Recipe[]>(
      `/api/recipes/${encodeURIComponent(
        userId,
      )}/tag/${encodeURIComponent(tag)}`,
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }

    throw error;
  }
}

// ============================================================
// AI DAILY PLAN
// ============================================================

export async function generateDailyPlan(
  userId: string,
) {
  console.log(
    '========================================',
  );

  console.log(
    'AZUKA API: GENERATE DAILY PLAN',
  );

  console.log(
    'MongoDB User ID:',
    userId,
  );

  console.log(
    '========================================',
  );

  const result =
    await request(
      `/api/agent/daily/${encodeURIComponent(
        userId,
      )}`,
      {
        method: 'POST',
      },
    );

  console.log(
    '[AZUKA API] Daily plan generation response:',
    result,
  );

  return result;
}

// ============================================================
// FOOD VISION
// ============================================================

export async function analyzeMealImage(
  imageUri: string,
): Promise<FoodVisionOutput> {
  const formData = new FormData();

  const filename =
    imageUri.split('/').pop() ||
    'meal.jpg';

  const extension =
    filename
      .split('.')
      .pop()
      ?.toLowerCase();

  let mimeType = 'image/jpeg';

  if (extension === 'png') {
    mimeType = 'image/png';
  } else if (extension === 'webp') {
    mimeType = 'image/webp';
  }

  formData.append(
    'image',
    {
      uri: imageUri,
      name: filename,
      type: mimeType,
    } as any,
  );

  const response =
    await fetch(
      `${API_BASE_URL}/api/food/vision`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      },
    );

  if (!response.ok) {
    let message =
      `Vision API Error: ${response.status}`;

    try {
      const data =
        await response.json();

      if (data?.detail) {
        message =
          typeof data.detail === 'string'
            ? data.detail
            : JSON.stringify(data.detail);
      }
    } catch {
      // Ignore JSON parsing errors
    }

    console.error(
      '[AZUKA API]',
      message,
    );

    throw new Error(message);
  }

  return response.json();
}