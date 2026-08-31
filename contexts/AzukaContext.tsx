
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  UserProfile,
  CycleHistory,
  DailyState,
  DailyScore,
  Workout,
  Recipe,
  getUserProfileByEmail,
  getCycleHistory,
  getLatestCycle,
  getDailyState,
  getDailyScore,
  getRecentScores,
  getTodayWorkout,
  getNextWorkouts,
  getWorkoutHistory,
  getRecipes,
  updateDailyState,
} from "../services/api";

// ============================================================
// TYPES
// ============================================================

type AzukaContextValue = {
  // USER
  userProfile: UserProfile | null;

  // CYCLE
  cycleHistory: CycleHistory[];
  latestCycle: CycleHistory | null;

  // DAILY DATA
  dailyState: DailyState | null;
  dailyScore: DailyScore | null;

  // SCORES
  recentScores: DailyScore[];

  // WORKOUT
  todayWorkout: Workout | null;
  nextWorkouts: Workout[];
  workoutHistory: Workout[];

  // RECIPES
  recipes: Recipe[];

  // STATE
  isLoading: boolean;
  error: string | null;

  // REFRESH
  refreshData: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshCycleData: () => Promise<void>;
  refreshDailyData: (date?: string) => Promise<void>;
  refreshWorkoutData: () => Promise<void>;
  refreshRecipes: () => Promise<void>;

  // DAILY STATE WRITE
  saveDailyCheckIn: (
    data: Partial<DailyState>,
    date?: string
  ) => Promise<void>;
};

// ============================================================
// CONTEXT
// ============================================================

const AzukaContext =
  createContext<AzukaContextValue | undefined>(undefined);

// ============================================================
// PROVIDER
// ============================================================

export function AzukaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ==========================================================
  // AUTH
  // ==========================================================

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  /*
   * We still get userId because other backend routes may
   * currently use it.
   *
   * IMPORTANT:
   * User profile is now fetched using EMAIL, not Firebase UID.
   */
  const userId = user?.userId;
  const userEmail = user?.email;

  console.log("AZUKA AUTH USER:", user);
  console.log("AZUKA USER ID:", userId);
  console.log("AZUKA USER EMAIL:", userEmail);

  // ==========================================================
  // STATE
  // ==========================================================

  const [userProfile, setUserProfile] =
    useState<UserProfile | null>(null);

  const [cycleHistory, setCycleHistory] =
    useState<CycleHistory[]>([]);

  const [latestCycle, setLatestCycle] =
    useState<CycleHistory | null>(null);

  const [dailyState, setDailyState] =
    useState<DailyState | null>(null);

  const [dailyScore, setDailyScore] =
    useState<DailyScore | null>(null);

  const [recentScores, setRecentScores] =
    useState<DailyScore[]>([]);

  const [todayWorkout, setTodayWorkout] =
    useState<Workout | null>(null);

  const [nextWorkouts, setNextWorkouts] =
    useState<Workout[]>([]);

  const [workoutHistory, setWorkoutHistory] =
    useState<Workout[]>([]);

  const [recipes, setRecipes] =
    useState<Recipe[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ==========================================================
  // TODAY
  // ==========================================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================================
  // USER PROFILE
  // ==========================================================

  const refreshUserProfile = useCallback(
    async () => {
      /*
       * The MongoDB profile is identified using the user's
       * email address.
       *
       * Firebase UID is NOT used here.
       */

      if (!userEmail) {
        console.log(
          "AZUKA: No user email, cannot fetch profile"
        );

        setUserProfile(null);

        return;
      }

      try {
        console.log(
          "AZUKA: Fetching MongoDB profile for email:",
          userEmail
        );

        const profile =
          await getUserProfileByEmail(userEmail);

        console.log(
          "AZUKA: MONGODB PROFILE RECEIVED:",
          profile
        );

        setUserProfile(profile);
      } catch (error) {
        console.error(
          "AZUKA: Failed to fetch user profile:",
          error
        );

        setUserProfile(null);

        throw error;
      }
    },
    [userEmail]
  );

  // ==========================================================
  // CYCLE DATA
  // ==========================================================

  const refreshCycleData = useCallback(
    async () => {
      if (!userId) return;

      try {
        const [
          history,
          latest,
        ] = await Promise.all([
          getCycleHistory(userId),
          getLatestCycle(userId),
        ]);

        setCycleHistory(history);
        setLatestCycle(latest);
      } catch (error) {
        console.error(
          "Failed to fetch cycle data:",
          error
        );

        throw error;
      }
    },
    [userId]
  );

  // ==========================================================
  // DAILY DATA
  // ==========================================================

  const refreshDailyData = useCallback(
    async (date?: string) => {
      if (!userId) return;

      const selectedDate =
        date || getTodayDate();

      try {
        const [
          state,
          score,
          scores,
        ] = await Promise.all([
          getDailyState(
            userId,
            selectedDate
          ),

          getDailyScore(
            userId,
            selectedDate
          ),

          getRecentScores(
            userId,
            7
          ),
        ]);

        setDailyState(state);
        setDailyScore(score);
        setRecentScores(scores);
      } catch (error) {
        console.error(
          "Failed to fetch daily data:",
          error
        );

        throw error;
      }
    },
    [userId]
  );

  // ==========================================================
  // SAVE DAILY CHECK-IN
  // ==========================================================

  const saveDailyCheckIn = useCallback(
    async (
      data: Partial<DailyState>,
      date?: string
    ) => {
      if (!userId) {
        throw new Error(
          "Cannot save daily check-in: user is not authenticated."
        );
      }

      const selectedDate =
        date || getTodayDate();

      try {
        await updateDailyState(
          userId,
          selectedDate,
          data
        );

        /*
         * Fetch the updated MongoDB document
         * so Context remains the source of truth.
         */
        await refreshDailyData(
          selectedDate
        );
      } catch (error) {
        console.error(
          "Failed to save daily check-in:",
          error
        );

        throw error;
      }
    },
    [userId, refreshDailyData]
  );

  // ==========================================================
  // WORKOUT DATA
  // ==========================================================

  const refreshWorkoutData = useCallback(
    async () => {
      if (!userId) return;

      try {
        const [
          today,
          next,
          history,
        ] = await Promise.all([
          getTodayWorkout(userId),
          getNextWorkouts(userId),
          getWorkoutHistory(userId),
        ]);

        setTodayWorkout(today);
        setNextWorkouts(next);
        setWorkoutHistory(history);
      } catch (error) {
        console.error(
          "Failed to fetch workout data:",
          error
        );

        throw error;
      }
    },
    [userId]
  );

  // ==========================================================
  // RECIPES
  // ==========================================================

  const refreshRecipes = useCallback(
    async () => {
      if (!userId) return;

      try {
        const data =
          await getRecipes(userId);

        setRecipes(data);
      } catch (error) {
        console.error(
          "Failed to fetch recipes:",
          error
        );

        throw error;
      }
    },
    [userId]
  );

  // ==========================================================
  // REFRESH EVERYTHING
  // ==========================================================

  const refreshData = useCallback(
    async () => {
      /*
       * We need the email for the user profile.
       *
       * userId is still required for the other existing
       * endpoints.
       */
      if (!userEmail && !userId) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const requests: Promise<void>[] = [];

        // MongoDB profile uses EMAIL
        if (userEmail) {
          requests.push(
            refreshUserProfile()
          );
        }

        // Other existing APIs use userId
        if (userId) {
          requests.push(
            refreshCycleData(),
            refreshDailyData(),
            refreshWorkoutData(),
            refreshRecipes()
          );
        }

        await Promise.all(requests);
      } catch (error) {
        console.error(
          "Failed to refresh Azuka data:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load Azuka data."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      userEmail,
      userId,
      refreshUserProfile,
      refreshCycleData,
      refreshDailyData,
      refreshWorkoutData,
      refreshRecipes,
    ]
  );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    /*
     * Wait until AuthContext has restored Firebase auth.
     */
    if (authLoading) {
      return;
    }

    /*
     * No authenticated user.
     */
    if (!isAuthenticated) {
      return;
    }

    /*
     * We need at least the email to fetch the MongoDB
     * user profile.
     */
    if (!userEmail) {
      return;
    }

    console.log(
      "AZUKA: Authenticated user detected."
    );

    console.log(
      "AZUKA: Loading MongoDB profile for:",
      userEmail
    );

    refreshData();
  }, [
    authLoading,
    isAuthenticated,
    userEmail,
    refreshData,
  ]);

  // ==========================================================
  // CLEAR DATA ON LOGOUT
  // ==========================================================

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    setUserProfile(null);

    setCycleHistory([]);

    setLatestCycle(null);

    setDailyState(null);

    setDailyScore(null);

    setRecentScores([]);

    setTodayWorkout(null);

    setNextWorkouts([]);

    setWorkoutHistory([]);

    setRecipes([]);

    setError(null);

    setIsLoading(false);
  }, [isAuthenticated]);

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value =
    useMemo<AzukaContextValue>(
      () => ({
        userProfile,

        cycleHistory,

        latestCycle,

        dailyState,

        dailyScore,

        recentScores,

        todayWorkout,

        nextWorkouts,

        workoutHistory,

        recipes,

        isLoading,

        error,

        refreshData,

        refreshUserProfile,

        refreshCycleData,

        refreshDailyData,

        refreshWorkoutData,

        refreshRecipes,

        saveDailyCheckIn,
      }),
      [
        userProfile,

        cycleHistory,

        latestCycle,

        dailyState,

        dailyScore,

        recentScores,

        todayWorkout,

        nextWorkouts,

        workoutHistory,

        recipes,

        isLoading,

        error,

        refreshData,

        refreshUserProfile,

        refreshCycleData,

        refreshDailyData,

        refreshWorkoutData,

        refreshRecipes,

        saveDailyCheckIn,
      ]
    );

  return (
    <AzukaContext.Provider value={value}>
      {children}
    </AzukaContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useAzuka() {
  const context =
    useContext(AzukaContext);

  if (!context) {
    throw new Error(
      "useAzuka must be used inside an AzukaProvider"
    );
  }

  return context;
}
