import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  UserProfile,
  CycleHistory,
  DailyState,
  DailyScore,
  Workout,
  DailyRecipes,
  getUserProfile,
  getCycleHistory,
  getLatestCycle,
  getDailyState,
  getDailyScore,
  getRecentScores,
  getTodayWorkout,
  getNextWorkouts,
  getWorkoutHistory,
  createDailyState,
  updateDailyState,
  getRecipes,
  generateDailyPlan,
  createCycle,
  updateCycle,
  updateUserProfile,
} from "../services/api";

// ============================================================
// TYPES
// ============================================================

type AzukaContextValue = {
  userId: string | null;

  userProfile: UserProfile | null;

  cycleHistory: CycleHistory[];
  latestCycle: CycleHistory | null;

  dailyState: DailyState | null;
  dailyScore: DailyScore | null;
  recentScores: DailyScore[];

  todayWorkout: Workout | null;
  nextWorkouts: Workout[];
  workoutHistory: Workout[];

  recipes: DailyRecipes[];

  isLoading: boolean;
  isGeneratingPlan: boolean;
  error: string | null;

  refreshData: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshCycleData: () => Promise<void>;
  startNewCycle: (startDate?: string) => Promise<CycleHistory>;
  refreshDailyData: (date?: string) => Promise<void>;
  refreshWorkoutData: () => Promise<void>;
  refreshRecipes: () => Promise<void>;

  generatePlan: () => Promise<void>;

  saveDailyCheckIn: (
    data: Partial<DailyState>,
    date?: string,
  ) => Promise<DailyState>;
};

// ============================================================
// CONTEXT
// ============================================================

const AzukaContext =
  createContext<AzukaContextValue | undefined>(undefined);

// ============================================================
// DATE HELPERS
// ============================================================

function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

function differenceInDays(
  startDate: string,
  endDate: string,
): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  return Math.floor(
    (end.getTime() - start.getTime()) /
    (1000 * 60 * 60 * 24),
  );
}

// ============================================================
// PHASE CALCULATION
// ============================================================

export function calculateCyclePhase(
  cycleDay: number,
  periodDuration: number,
  cycleLength: number,
): string {
  // ----------------------------------------------------------
  // MENSTRUAL
  // ----------------------------------------------------------

  if (
    cycleDay >= 1 &&
    cycleDay <= periodDuration
  ) {
    return "Menstrual";
  }

  // ----------------------------------------------------------
  // OVULATION
  // ----------------------------------------------------------

  const ovulationDay = Math.round(cycleLength / 2);

  // ----------------------------------------------------------
  // FOLLICULAR
  // ----------------------------------------------------------

  const follicularEnd = Math.max(
    periodDuration + 1,
    ovulationDay - 1,
  );

  if (
    cycleDay >= periodDuration + 1 &&
    cycleDay <= follicularEnd
  ) {
    return "Follicular";
  }

  // ----------------------------------------------------------
  // OVULATION
  // ----------------------------------------------------------

  if (cycleDay === ovulationDay) {
    return "Ovulation";
  }

  // ----------------------------------------------------------
  // LUTEAL
  // ----------------------------------------------------------

  if (
    cycleDay > ovulationDay &&
    cycleDay <= cycleLength
  ) {
    return "Luteal";
  }

  return "Luteal";
}

// ============================================================
// CALCULATE CURRENT CYCLE
// ============================================================

export function calculateCurrentCycle(
  cycle: CycleHistory,
  selectedDate: string = getTodayDate(),
): {
  cycleDay: number;
  phase: string;
} {
  const daysSinceStart = differenceInDays(
    cycle.period_start_date,
    selectedDate,
  );

  let cycleDay = daysSinceStart + 1;

  const cycleLength =
    cycle.cycle_length || 28;

  // ----------------------------------------------------------
  // HANDLE CYCLE WRAPPING
  // ----------------------------------------------------------

  if (cycleDay > cycleLength) {
    cycleDay =
      ((cycleDay - 1) % cycleLength) + 1;
  }

  // ----------------------------------------------------------
  // HANDLE DATES BEFORE CYCLE START
  // ----------------------------------------------------------

  if (cycleDay < 1) {
    cycleDay = 1;
  }

  const phase = calculateCyclePhase(
    cycleDay,
    cycle.period_duration || 5,
    cycleLength,
  );

  return {
    cycleDay,
    phase,
  };
}

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
   * IMPORTANT:
   *
   * user.userId is the MongoDB user ID.
   *
   * Firebase UID is NOT used here.
   *
   * UserProfile does NOT contain userId.
   *
   * dailyState.user_id must also NOT be used as the source
   * of truth because today's DailyState may not exist yet.
   */

  const userId = user?.userId ?? null;

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
    useState<DailyRecipes[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isGeneratingPlan, setIsGeneratingPlan] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ==========================================================
  // PREVENT DUPLICATE INITIALIZATION
  // ==========================================================

  const initializedForRef =
    useRef<string | null>(null);

  const isGeneratingRef =
    useRef<boolean>(false);

  // ==========================================================
  // PREVENT STALE DAILY DATA REQUESTS
  // ==========================================================

  const dailyDataRequestRef =
    useRef<number>(0);

  // ==========================================================
  // USER PROFILE
  // ==========================================================

  const refreshUserProfile =
    useCallback(async () => {
      if (!userId) {
        return;
      }

      const profile =
        await getUserProfile(userId);

      setUserProfile(profile);
    }, [userId]);

  // ==========================================================
  // CYCLE DATA
  // ==========================================================

  const refreshCycleData =
    useCallback(async () => {
      if (!userId) {
        return;
      }

      try {
        const [history, latest] =
          await Promise.all([
            getCycleHistory(userId),
            getLatestCycle(userId),
          ]);

        setCycleHistory(history ?? []);
        setLatestCycle(latest ?? null);
      } catch (error) {
        console.error(
          "AZUKA: failed to fetch cycle data:",
          error,
        );

        throw error;
      }
    }, [userId]);

  // ==========================================================
  // DAILY DATA
  // ==========================================================

  const refreshDailyData =
    useCallback(
      async (date?: string) => {
        if (!userId) {
          return;
        }

        const selectedDate =
          date ?? getTodayDate();

        // ----------------------------------------------------
        // CREATE UNIQUE REQUEST ID
        // ----------------------------------------------------

        const requestId =
          ++dailyDataRequestRef.current;

        console.log(
          "========================================",
        );

        console.log(
          "AZUKA: LOADING DAILY DATA",
        );

        console.log(
          "AZUKA: MongoDB user ID:",
          userId,
        );

        console.log(
          "AZUKA: selected date:",
          selectedDate,
        );

        console.log(
          "AZUKA: request ID:",
          requestId,
        );

        console.log(
          "========================================",
        );

        // ----------------------------------------------------
        // CLEAR PREVIOUS DAY
        // ----------------------------------------------------

        setDailyState(null);
        setDailyScore(null);
        setError(null);

        try {
          let state: DailyState | null = null;
          let score: DailyScore | null = null;

          // ==================================================
          // DAILY STATE
          // ==================================================

          try {
            state =
              await getDailyState(
                userId,
                selectedDate,
              );

            console.log(
              "AZUKA: daily state for",
              selectedDate,
              ":",
              state,
            );
          } catch (error) {
            const status =
              error instanceof Error &&
                "status" in error
                ? (
                  error as Error & {
                    status?: number;
                  }
                ).status
                : undefined;

            // 404 means there simply isn't a DailyState
            // for this date.

            if (status === 404) {
              console.log(
                "AZUKA: no daily state for",
                selectedDate,
              );

              state = null;
            } else {
              throw error;
            }
          }

          // ==================================================
          // DAILY SCORE
          // ==================================================

          try {
            score =
              await getDailyScore(
                userId,
                selectedDate,
              );

            console.log(
              "AZUKA: daily score for",
              selectedDate,
              ":",
              score,
            );
          } catch (error) {
            const status =
              error instanceof Error &&
                "status" in error
                ? (
                  error as Error & {
                    status?: number;
                  }
                ).status
                : undefined;

            // 404 means there simply isn't a DailyScore
            // for this date.

            if (status === 404) {
              console.log(
                "AZUKA: no daily score for",
                selectedDate,
              );

              score = null;
            } else {
              throw error;
            }
          }

          // ==================================================
          // RECENT SCORES
          // ==================================================

          /*
           * Recent scores are kept separately.
           *
           * They are used for charts/trends.
           *
           * They are NEVER assigned to dailyScore.
           */

          const scores =
            await getRecentScores(
              userId,
              7,
            );

          // ==================================================
          // RACE CONDITION CHECK
          // ==================================================

          if (
            requestId !==
            dailyDataRequestRef.current
          ) {
            console.log(
              "AZUKA: ignoring stale daily-data request:",
              requestId,
              "current:",
              dailyDataRequestRef.current,
            );

            return;
          }

          // ==================================================
          // SET CURRENT DATE DATA
          // ==================================================

          setDailyState(state);

          setDailyScore(score);

          setRecentScores(
            scores ?? [],
          );

          setError(null);

          console.log(
            "AZUKA: finished loading daily data for:",
            selectedDate,
          );
        } catch (error) {
          // --------------------------------------------------
          // IGNORE STALE REQUEST ERRORS
          // --------------------------------------------------

          if (
            requestId !==
            dailyDataRequestRef.current
          ) {
            console.log(
              "AZUKA: ignoring error from stale request:",
              requestId,
            );

            return;
          }

          console.error(
            "AZUKA: failed to fetch daily data:",
            error,
          );

          setDailyState(null);
          setDailyScore(null);

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load daily data.",
          );

          throw error;
        }
      },
      [userId],
    );
  // ==========================================================
  // START NEW MENSTRUAL CYCLE
  // ==========================================================

  const startNewCycle = useCallback(
    async (
      startDate: string = getTodayDate(),
    ): Promise<CycleHistory> => {
      if (!userId) {
        throw new Error(
          "Cannot start cycle: MongoDB user ID is missing.",
        );
      }

      const cycleLength =
        userProfile?.general_state?.average_cycle_length ?? 28;

      const periodDuration =
        userProfile?.general_state?.period_duration ?? 5;

      console.log("========================================");
      console.log("AZUKA: STARTING NEW CYCLE");
      console.log("AZUKA: MongoDB user ID:", userId);
      console.log("AZUKA: cycle start date:", startDate);
      console.log("AZUKA: cycle length:", cycleLength);
      console.log("AZUKA: period duration:", periodDuration);
      console.log("========================================");

      // --------------------------------------------------------
      // PREVENT DUPLICATE CYCLE CREATION
      // --------------------------------------------------------

      const existingCycle = cycleHistory.find(
        (cycle) =>
          cycle.period_start_date === startDate,
      );

      if (existingCycle) {
        console.log(
          "AZUKA: cycle already exists for this date.",
          existingCycle,
        );

        // Still make sure latestCycle points to it.
        setLatestCycle(existingCycle);

        return existingCycle;
      }

      // --------------------------------------------------------
      // ESTIMATE PERIOD END DATE
      //
      // At the moment the user starts a period, we don't know
      // the actual end date yet.
      //
      // We temporarily use the user's usual period duration.
      // When the period actually ends, this can be updated.
      // --------------------------------------------------------

      const start = parseDate(startDate);

      const estimatedEnd = new Date(start);
      estimatedEnd.setDate(
        estimatedEnd.getDate() + periodDuration - 1,
      );

      const estimatedEndDate = [
        estimatedEnd.getFullYear(),
        String(estimatedEnd.getMonth() + 1).padStart(2, "0"),
        String(estimatedEnd.getDate()).padStart(2, "0"),
      ].join("-");

      // --------------------------------------------------------
      // CREATE CYCLE IN DATABASE
      // --------------------------------------------------------

      const newCycle = await createCycle(userId, {
        period_start_date: startDate,
        period_end_date: estimatedEndDate,
        cycle_length: cycleLength,
        period_duration: periodDuration,
      });

      console.log(
        "AZUKA: new cycle created successfully:",
        newCycle,
      );

      // --------------------------------------------------------
      // UPDATE CONTEXT IMMEDIATELY
      // --------------------------------------------------------

      setCycleHistory((previous) => [
        ...previous,
        newCycle,
      ]);

      setLatestCycle(newCycle);

      // --------------------------------------------------------
      // KEEP USER PROFILE CYCLE IN SYNC
      //
      // UserProfile is still used by parts of the app, so keep
      // its last_period_start_date synchronized as well.
      // --------------------------------------------------------

      setUserProfile((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          cycle: {
            ...previous.cycle,
            last_period_start_date: startDate,
          },
        };
      });

      // --------------------------------------------------------
      // PERSIST PROFILE CYCLE START DATE
      // --------------------------------------------------------

      try {
        await updateUserProfile(userId, {
          cycle: {
            ...(userProfile?.cycle ?? {}),
            last_period_start_date: startDate,
          },
        });

        console.log(
          "AZUKA: user profile cycle start date updated.",
        );
      } catch (error) {
        // The cycle itself has already been successfully created.
        // Don't undo the local cycle state if this secondary
        // synchronization fails.
        console.error(
          "AZUKA: failed to update profile cycle date:",
          error,
        );
      }

      return newCycle;
    },
    [
      userId,
      userProfile,
      cycleHistory,
    ],
  );
  // ==========================================================
  // SAVE DAILY CHECK-IN
  // ==========================================================

  const saveDailyCheckIn =
    useCallback(
      async (
        data: Partial<DailyState>,
        date: string = getTodayDate(),
      ): Promise<DailyState> => {
        if (!userId) {
          throw new Error(
            "Cannot save daily state: MongoDB user ID is missing.",
          );
        }

        console.log(
          "========================================",
        );

        console.log(
          "AZUKA: SAVING DAILY CHECK-IN",
        );

        console.log(
          "AZUKA: MongoDB user ID:",
          userId,
        );

        console.log(
          "AZUKA: date:",
          date,
        );

        console.log(
          "========================================",
        );

        // ====================================================
        // DETECT PERIOD START / END ACTIONS
        // ====================================================

        /*
         * Starting a period means:
         * - a brand-new cycle begins today
         * - today becomes Cycle Day 1
         * - today's phase becomes Menstrual
         *
         * Ending a period means:
         * - do NOT create a new cycle
         * - close the current cycle using today's date
         * - today's DailyState becomes period-ended
         */

        const isStartingNewCycle =
          data.period?.started_today === true &&
          data.period?.is_period_active === true &&
          data.period?.start_date === date;

        const isEndingCurrentCycle =
          data.period?.ended_today === true &&
          data.period?.is_period_active === false;

        // ----------------------------------------------------
        // IMPORTANT:
        //
        // We keep a LOCAL cycle reference because startNewCycle()
        // updates React state asynchronously.
        //
        // If we used latestCycle immediately after calling
        // startNewCycle(), it could still point to the OLD cycle.
        // ----------------------------------------------------

        let cycleForCalculation =
          latestCycle;

        // ====================================================
        // START NEW CYCLE
        // ====================================================

        if (isStartingNewCycle) {
          console.log(
            "AZUKA: period started today — creating new cycle.",
          );

          cycleForCalculation =
            await startNewCycle(date);

          console.log(
            "AZUKA: new cycle available for today's calculation:",
            cycleForCalculation,
          );
        }

        // ====================================================
        // GET CURRENT CYCLE SETTINGS
        // ====================================================

        const periodStartDate =
          cycleForCalculation?.period_start_date ??
          userProfile?.cycle?.last_period_start_date;

        const cycleLength =
          cycleForCalculation?.cycle_length ??
          userProfile?.general_state
            ?.average_cycle_length ??
          28;

        let periodDuration =
          cycleForCalculation?.period_duration ??
          userProfile?.general_state
            ?.period_duration ??
          5;

        // ====================================================
        // END CURRENT PERIOD / UPDATE CYCLE HISTORY
        // ====================================================

        if (
          isEndingCurrentCycle &&
          cycleForCalculation?._id
        ) {
          console.log(
            "AZUKA: period ended today — closing current cycle.",
          );

          let actualPeriodDuration =
            cycleForCalculation.period_duration ||
            periodDuration;

          if (
            cycleForCalculation.period_start_date
          ) {
            const daysFromStart =
              differenceInDays(
                cycleForCalculation.period_start_date,
                date,
              );

            /*
             * Period duration is inclusive:
             *
             * Start Sep 6
             * End   Sep 10
             *
             * = 5 days
             */
            actualPeriodDuration =
              Math.max(1, daysFromStart + 1);
          }

          const updatedCycle =
            await updateCycle(
              cycleForCalculation._id,
              {
                period_end_date: date,
                period_duration:
                  actualPeriodDuration,
              },
            );

          // Use the actual duration for today's phase
          // calculation as well.
          periodDuration =
            actualPeriodDuration;

          console.log(
            "AZUKA: current cycle closed successfully:",
            updatedCycle,
          );

          cycleForCalculation =
            updatedCycle;

          // --------------------------------------------------
          // UPDATE CONTEXT IMMEDIATELY
          // --------------------------------------------------

          setCycleHistory((previous) =>
            previous.map((cycle) =>
              cycle._id === updatedCycle._id
                ? updatedCycle
                : cycle,
            ),
          );

          setLatestCycle(
            updatedCycle,
          );
        }

        // ====================================================
        // CALCULATE CYCLE DAY + PHASE
        // ====================================================

        let phase = data.phase;
        let day = data.day;

        /*
         * Cycle information comes from the actual cycle when
         * available, otherwise from UserProfile.
         */

        if (periodStartDate) {
          const daysSinceStart =
            differenceInDays(
              periodStartDate,
              date,
            );

          let calculatedCycleDay =
            daysSinceStart + 1;

          // --------------------------------------------------
          // DATE BEFORE CYCLE START
          // --------------------------------------------------

          if (calculatedCycleDay < 1) {
            calculatedCycleDay = 1;
          }

          // --------------------------------------------------
          // WRAP AFTER CYCLE LENGTH
          // --------------------------------------------------

          if (
            calculatedCycleDay >
            cycleLength
          ) {
            calculatedCycleDay =
              ((calculatedCycleDay - 1) %
                cycleLength) +
              1;
          }

          day = calculatedCycleDay;

          phase =
            calculateCyclePhase(
              calculatedCycleDay,
              periodDuration,
              cycleLength,
            );

          /*
           * If the period was just started today, this should
           * naturally produce:
           *
           * day   = 1
           * phase = Menstrual
           */
        }

        console.log(
          "AZUKA: calculated cycle day:",
          day,
        );

        console.log(
          "AZUKA: calculated phase:",
          phase,
        );

        // ====================================================
        // BUILD DAILY STATE PAYLOAD
        // ====================================================

        const dailyStateData: Partial<DailyState> = {
          ...data,
          date,
          phase,
          day,
        };

        // ====================================================
        // UPDATE EXISTING DOCUMENT
        // OR CREATE IF IT DOESN'T EXIST
        // ====================================================

        let savedState: DailyState;

        try {
          savedState =
            await updateDailyState(
              userId,
              date,
              dailyStateData,
            );

          console.log(
            "AZUKA: daily state updated successfully.",
            savedState,
          );
        } catch (error) {
          const status =
            error instanceof Error &&
              "status" in error
              ? (
                  error as Error & {
                    status?: number;
                  }
                ).status
              : undefined;

          // --------------------------------------------------
          // ONLY 404 SHOULD FALL THROUGH TO CREATE
          // --------------------------------------------------

          if (status !== 404) {
            console.error(
              "AZUKA: failed to update daily state:",
              error,
            );

            throw error;
          }

          // --------------------------------------------------
          // CREATE NEW DAILY STATE
          // --------------------------------------------------

          savedState =
            await createDailyState(
              userId,
              {
                ...dailyStateData,
                user_id: userId,
                date,
                phase,
                day,
              } as DailyState,
            );

          console.log(
            "AZUKA: daily state created successfully.",
            savedState,
          );
        }

        // ====================================================
        // UPDATE CONTEXT IMMEDIATELY
        // ====================================================

        setDailyState(savedState);

        return savedState;
      },
      [
        userId,
        userProfile,
        latestCycle,
        cycleHistory,
        startNewCycle,
      ],
    );

  // ==========================================================
  // WORKOUT DATA
  // ==========================================================

  const refreshWorkoutData =
    useCallback(async () => {
      if (!userId) {
        return;
      }

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

        setNextWorkouts(
          next ?? [],
        );

        setWorkoutHistory(
          history ?? [],
        );
      } catch (error) {
        console.error(
          "AZUKA: failed to fetch workout data:",
          error,
        );

        throw error;
      }
    }, [userId]);

  // ==========================================================
  // RECIPES
  // ==========================================================

  const refreshRecipes =
    useCallback(async () => {
      if (!userId) {
        return;
      }

      try {
        const data =
          await getRecipes(userId);

        setRecipes(
          data ?? [],
        );
      } catch (error) {
        console.error(
          "AZUKA: failed to fetch recipes:",
          error,
        );

        throw error;
      }
    }, [userId]);

  // ==========================================================
  // ENSURE TODAY'S PLAN EXISTS
  // ==========================================================

  const ensureTodayPlanExists =
    useCallback(async () => {
      if (
        !userId ||
        isGeneratingRef.current
      ) {
        return;
      }

      const today = getTodayDate();

      console.log(
        "AZUKA: checking today's plan:",
        today,
      );

      let existingScore:
        | DailyScore
        | null = null;

      try {
        existingScore =
          await getDailyScore(
            userId,
            today,
          );
      } catch (error) {
        /*
         * A missing score means there is no plan yet.
         *
         * Other errors are also allowed to fall through
         * here so plan generation can attempt to recover.
         */

        console.log(
          "AZUKA: today's plan does not exist yet.",
        );
      }

      if (existingScore) {
        console.log(
          "AZUKA: today's plan already exists.",
        );

        return;
      }

      console.log(
        "AZUKA: today's plan missing.",
      );

      console.log(
        "AZUKA: generating daily plan...",
      );

      isGeneratingRef.current = true;

      setIsGeneratingPlan(true);

      try {
        await generateDailyPlan(
          userId,
        );

        console.log(
          "AZUKA: daily plan generated and saved.",
        );
      } finally {
        isGeneratingRef.current = false;

        setIsGeneratingPlan(false);
      }
    }, [userId]);

  // ==========================================================
  // REFRESH EVERYTHING
  // ==========================================================

  const refreshData =
    useCallback(async () => {
      if (
        authLoading ||
        !isAuthenticated ||
        !userId
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const errors: string[] = [];

      const runSection =
        async (
          label: string,
          task: () => Promise<void>,
        ) => {
          try {
            await task();
          } catch (err) {
            console.error(
              `AZUKA: failed to fetch ${label}:`,
              err,
            );

            errors.push(
              err instanceof Error
                ? err.message
                : `Failed to load ${label}.`,
            );
          }
        };

      console.log(
        "========================================",
      );

      console.log(
        "AZUKA: STARTING DATA INITIALIZATION",
      );

      console.log(
        "AZUKA: MongoDB user ID:",
        userId,
      );

      console.log(
        "========================================",
      );

      // ======================================================
      // PROFILE + CYCLE DATA
      // ======================================================

      await Promise.all([
        runSection(
          "user profile",
          refreshUserProfile,
        ),

        runSection(
          "cycle data",
          refreshCycleData,
        ),
      ]);

      // ======================================================
      // ENSURE PLAN EXISTS
      // ======================================================

      await runSection(
        "daily plan generation",
        ensureTodayPlanExists,
      );

      // ======================================================
      // DAILY + WORKOUT + RECIPES
      // ======================================================

      await Promise.all([
        runSection(
          "daily data",
          refreshDailyData,
        ),

        runSection(
          "workout data",
          refreshWorkoutData,
        ),

        runSection(
          "recipes",
          refreshRecipes,
        ),
      ]);

      // ======================================================
      // ERROR HANDLING
      // ======================================================

      if (errors.length > 0) {
        setError(errors[0]);
      }

      console.log(
        "AZUKA: data initialization finished.",
      );

      setIsLoading(false);
    }, [
      authLoading,
      isAuthenticated,
      userId,
      refreshUserProfile,
      refreshCycleData,
      ensureTodayPlanExists,
      refreshDailyData,
      refreshWorkoutData,
      refreshRecipes,
    ]);

  // ==========================================================
  // MANUAL PLAN GENERATION
  // ==========================================================

  const generatePlan =
    useCallback(async () => {
      if (!userId) {
        throw new Error(
          "Cannot generate plan: MongoDB user ID is missing.",
        );
      }

      if (
        isGeneratingRef.current
      ) {
        return;
      }

      isGeneratingRef.current = true;

      setIsGeneratingPlan(true);

      setError(null);

      try {
        console.log(
          "AZUKA: manually generating daily plan...",
        );

        await generateDailyPlan(
          userId,
        );

        /*
         * Refresh everything generated by the plan.
         *
         * This keeps:
         * - DailyScore
         * - DailyState
         * - Workouts
         * - Recipes
         *
         * synchronized with the backend.
         */

        await Promise.all([
          refreshDailyData(),
          refreshWorkoutData(),
          refreshRecipes(),
        ]);

        console.log(
          "AZUKA: manual plan generation complete.",
        );
      } catch (error) {
        console.error(
          "AZUKA: manual plan generation failed:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to generate daily plan.",
        );

        throw error;
      } finally {
        isGeneratingRef.current = false;

        setIsGeneratingPlan(false);
      }
    }, [
      userId,
      refreshDailyData,
      refreshWorkoutData,
      refreshRecipes,
    ]);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated ||
      !userId
    ) {
      return;
    }

    const today = getTodayDate();

    const initializationKey =
      `${userId}:${today}`;

    if (
      initializedForRef.current ===
      initializationKey
    ) {
      return;
    }

    initializedForRef.current =
      initializationKey;

    refreshData();
  }, [
    authLoading,
    isAuthenticated,
    userId,
    refreshData,
  ]);

  // ==========================================================
  // LOG AUTH CONNECTION
  // ==========================================================

  useEffect(() => {
    console.log(
      "AZUKA AUTH USER:",
      user,
    );

    console.log(
      "AZUKA MONGO USER ID:",
      userId,
    );

    console.log(
      "AZUKA USER EMAIL:",
      user?.email,
    );
  }, [
    user,
    userId,
  ]);

  // ==========================================================
  // CLEAR DATA ON LOGOUT
  // ==========================================================

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    // --------------------------------------------------------
    // INVALIDATE IN-FLIGHT DAILY DATA REQUEST
    // --------------------------------------------------------

    dailyDataRequestRef.current += 1;

    initializedForRef.current = null;

    // --------------------------------------------------------
    // CLEAR ALL USER DATA
    // --------------------------------------------------------

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

    setIsGeneratingPlan(false);
  }, [isAuthenticated]);

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value =
    useMemo<AzukaContextValue>(
      () => ({
        // ----------------------------------------------------
        // USER
        // ----------------------------------------------------

        userId,

        userProfile,

        // ----------------------------------------------------
        // CYCLE
        // ----------------------------------------------------

        cycleHistory,

        latestCycle,

        // ----------------------------------------------------
        // DAILY
        // ----------------------------------------------------

        dailyState,

        dailyScore,

        recentScores,

        // ----------------------------------------------------
        // WORKOUT
        // ----------------------------------------------------

        todayWorkout,

        nextWorkouts,

        workoutHistory,

        // ----------------------------------------------------
        // RECIPES
        // ----------------------------------------------------

        recipes,

        // ----------------------------------------------------
        // LOADING / ERROR
        // ----------------------------------------------------

        isLoading,

        isGeneratingPlan,

        error,

        // ----------------------------------------------------
        // FUNCTIONS
        // ----------------------------------------------------

        refreshData,

        refreshUserProfile,


        refreshCycleData,
        startNewCycle,
        refreshDailyData,

        refreshWorkoutData,

        refreshRecipes,

        generatePlan,

        saveDailyCheckIn,
      }),
      [
        userId,
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
        isGeneratingPlan,
        error,

        refreshData,
        refreshCycleData,
        startNewCycle,
        refreshDailyData,
        refreshDailyData,
        refreshWorkoutData,
        refreshRecipes,

        generatePlan,
        saveDailyCheckIn,
      ],
    );

  // ==========================================================
  // PROVIDER
  // ==========================================================

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
      "useAzuka must be used inside an AzukaProvider",
    );
  }

  return context;
}