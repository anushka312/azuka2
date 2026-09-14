import asyncio
from datetime import date, datetime, timezone, timedelta
from bson import ObjectId

from app.database.user_repository import get_user_by_id
from app.database.cycle_repository import get_latest_cycle
from app.database.daily_state_repository import get_daily_state
from app.database.daily_score_repository import create_daily_score
from app.database.daily_intake_repository import get_daily_intake
from app.database.workout_repository import (
    get_workouts,
    create_workout,
)
from app.database.recipe_repository import (
    create_daily_recipes,
)

from ai.schemas.input import (
    GeneralState,
    UserState,
    SleepState,
    Symptoms,
    FoodState,
    WorkoutState,
    WorkoutActivity,
)
from ai.schemas.output import AzukaDailyOutput

from ai.agents.daily_agent import run_azuka_daily_agent



# ============================================================
# BUILD GENERAL STATE
# ============================================================

def build_general_state(user: dict) -> GeneralState:

    general_state = user.get(
        "general_state",
        {}
    )

    return GeneralState(
        age=general_state.get("age"),

        weight_kg=general_state.get(
            "weight_kg"
        ),

        height_cm=general_state.get(
            "height_cm"
        ),

        cycle_tracking_mode=general_state.get(
            "cycle_tracking_mode"
        ),

        average_cycle_length=general_state.get(
            "average_cycle_length"
        ),

        period_duration=general_state.get(
            "period_duration"
        ),

        phase_symptoms=general_state.get(
            "phase_symptoms"
        ),

        fitness_focus=general_state.get(
            "fitness_focus"
        ),

        current_fitness_level=general_state.get(
            "current_fitness_level"
        ),

        equipment=general_state.get(
            "equipment"
        ),

        average_daily_stress=general_state.get(
            "average_daily_stress"
        ),

        diet=general_state.get(
            "diet"
        ),

        allergies=general_state.get(
            "allergies"
        ),

        nutrition_friction=general_state.get(
            "nutrition_friction"
        ),
    )


# ============================================================
# BUILD USER STATE
# ============================================================

def build_user_state(
    daily_state: dict | None,
    daily_intake: dict | None,
    recent_workouts: list,
) -> UserState:

    # No daily state yet = new/sparse user
    if not daily_state:
        return UserState()

    # --------------------------------------------------------
    # SLEEP
    # --------------------------------------------------------

    sleep = None

    sleep_data = daily_state.get(
        "sleep"
    )

    if sleep_data:

        sleep = SleepState(
            duration=sleep_data.get(
                "sleep_hours"
            ),
            quality=sleep_data.get(
                "quality"
            ),
        )

    # --------------------------------------------------------
    # SYMPTOMS
    # --------------------------------------------------------

    symptoms = None

    symptoms_data = daily_state.get(
        "symptoms"
    )

    if symptoms_data:

        symptoms = Symptoms(
            pain=symptoms_data.get("pain"),
            energy=symptoms_data.get("energy"),
            digestive=symptoms_data.get("digestive"),
            appetite=symptoms_data.get("appetite"),
            mood=symptoms_data.get("mood"),
            physical=symptoms_data.get("physical"),
        )

    # --------------------------------------------------------
    # FOOD
    # --------------------------------------------------------

    food = None

    if daily_intake:

        food = FoodState(
            calories=daily_intake.get(
                "calories"
            ),
            protein=daily_intake.get(
                "protein"
            ),
            carbohydrates=daily_intake.get(
                "carbohydrates"
            ),
            fats=daily_intake.get(
                "fats"
            ),
        )

    # --------------------------------------------------------
    # WORKOUT
    # --------------------------------------------------------

    workout_activities = []

    for workout in recent_workouts:

        for activity in workout.get(
            "activities",
            []
        ):

            workout_activities.append(
                WorkoutActivity(
                    activity=activity.get(
                        "activity_name"
                    ),
                    estimated_calories=None,
                )
            )

    workout = None

    if workout_activities:

        workout = WorkoutState(
            activities=workout_activities,
            comments=None,
        )

    # --------------------------------------------------------
    # USER STATE
    # --------------------------------------------------------

    return UserState(
        phase=daily_state.get(
            "phase"
        ),

        cycle_day=daily_state.get(
            "day"
        ),

        sleep=sleep,

        symptoms=symptoms,

        food=food,

        workout=workout,
    )


# ============================================================
# GET AGENT CONTEXT
# ============================================================

async def get_agent_context(
    user_id: str,
):

    today = date.today().isoformat()

    # Validate user ID before touching MongoDB
    try:
        ObjectId(user_id)
    except Exception:

        raise ValueError(
            "Invalid user_id"
        )

    # --------------------------------------------------------
    # USER
    # --------------------------------------------------------

    user = await get_user_by_id(
        user_id
    )

    if not user:

        raise ValueError(
            "User not found"
        )

    # --------------------------------------------------------
    # DAILY STATE
    # --------------------------------------------------------

    daily_state = await get_daily_state(
        user_id,
        today
    )

    # --------------------------------------------------------
    # DAILY INTAKE
    # --------------------------------------------------------

    daily_intake = await get_daily_intake(
        user_id,
        today
    )

    # --------------------------------------------------------
    # LATEST CYCLE
    # --------------------------------------------------------

    latest_cycle = await get_latest_cycle(
        user_id
    )

    # --------------------------------------------------------
    # TODAY'S / RECENT WORKOUTS
    # --------------------------------------------------------

    recent_workouts = await get_workouts(
        user_id,
        today,
        today
    )

    # --------------------------------------------------------
    # BUILD PYDANTIC INPUT
    # --------------------------------------------------------

    general_state = build_general_state(
        user
    )

    user_state = build_user_state(
        daily_state,
        daily_intake,
        recent_workouts
    )

    return {
        "general_state": general_state,
        "user_state": user_state,
        "latest_cycle": latest_cycle,
    }


# ============================================================
# GENERATE DAILY PLAN
# ============================================================

# ============================================================
# GENERATE DAILY PLAN
# ============================================================

async def generate_daily_plan(
    user_id: str,
) -> AzukaDailyOutput:

    context = await get_agent_context(user_id)

    general_state = context["general_state"]
    user_state = context["user_state"]

    print(
        "[AGENT_SERVICE] Sending user state to daily_agent.py"
    )

    print(
        f"[AGENT_SERVICE] General state keys: "
        f"{general_state.model_dump(exclude_none=True).keys()}"
    )

    print(
        f"[AGENT_SERVICE] User state keys: "
        f"{user_state.model_dump(exclude_none=True).keys()}"
    )

    # --------------------------------------------------------
    # CALL DAILY AGENT
    # --------------------------------------------------------
    #
    # daily_agent.py owns:
    # - Gemini client
    # - model selection
    # - fallback models
    # - Gemini prompt
    # - response schema
    #
    # Run the synchronous Gemini call in a worker thread so
    # we do not block the FastAPI async event loop.
    # --------------------------------------------------------

    try:
        result = await asyncio.to_thread(
            run_azuka_daily_agent,
            general_state,
            user_state,
        )

        print(
            "[AGENT_SERVICE] daily_agent.py returned successfully"
        )

        print(
            f"[AGENT_SERVICE] Result type: {type(result)}"
        )

    except Exception as e:
        print(
            f"[AGENT_SERVICE] ERROR from daily_agent.py: {e}"
        )
        print(
            f"[AGENT_SERVICE] Error type: {type(e)}"
        )
        raise

    # --------------------------------------------------------
    # VALIDATE RESULT
    # --------------------------------------------------------

    if not isinstance(result, AzukaDailyOutput):
        raise ValueError(
            "daily_agent.py did not return AzukaDailyOutput"
        )

    # --------------------------------------------------------
    # SAVE AI OUTPUT
    # --------------------------------------------------------

    await save_daily_output(
        user_id,
        result,
    )

    return result


# ============================================================
# SAVE DAILY OUTPUT
# ============================================================

async def save_daily_output(
    user_id: str,
    output: AzukaDailyOutput
):
    mongo_user_id = ObjectId(user_id)

    now = datetime.now(timezone.utc)

    # Backend owns the actual calendar date.
    # Never rely on Gemini to determine "today".
    today = date.today()

    # ============================================================
    # 1. SAVE DAILY SCORE
    # ============================================================

    score_data = {
        "_id": ObjectId(),
        "user_id": mongo_user_id,
        "date": today.isoformat(),

        "daily_recovery_score": output.overall.daily_recovery_score,
        "stress_level": output.overall.stress_level,
        "phase_energy_score": output.overall.phase_energy_score,
        "strain_output_balance_score": (
            output.overall.strain_output_balance_score
        ),
        "comment": output.overall.comment,

        "created_at": now,
        "updated_at": now,
    }

    await create_daily_score(score_data)

    # ============================================================
    # 2. SAVE WORKOUTS
    # ============================================================

    for index, workout_day in enumerate(output.workout):

        # IMPORTANT:
        # Do NOT use workout_day.date here.
        #
        # Gemini may return "Today", "Tomorrow", etc.
        # The backend is the source of truth.
        #
        # index 0 -> today
        # index 1 -> tomorrow
        # index 2 -> day after tomorrow
        # etc.

        workout_date = (
            today + timedelta(days=index)
        ).isoformat()

        workout_data = {
            "_id": ObjectId(),

            "user_id": mongo_user_id,

            # Backend-generated ISO date.
            "date": workout_date,

            "status": "planned",

            "info_tag": workout_day.info_tag,

            "intensity_tag": workout_day.intensity_tag,

            "activities": [
                {
                    "activity_name": activity.activity_name,
                    "type": activity.type,
                    "duration_mins": activity.duration_mins,
                    "sets": activity.sets,
                    "reps": activity.reps,
                    "completed": False,
                }
                for activity in workout_day.activities
            ],

            "actual_activities": [],

            "created_at": now,
            "generated_at": now,
            "completed_at": None,
            "updated_at": now,
        }

        await create_workout(workout_data)

    # ============================================================
    # 3. SAVE RECIPES
    # ============================================================

    recipes = [
        {
            "name": recipe.name,
            "tags": recipe.tags,
            "description": recipe.description,
            "calories": recipe.calories,
            "protein": recipe.protein,
            "carbohydrates": recipe.carbohydrates,
            "fats": recipe.fats,
            "ingredients": recipe.ingredients,
            "comments": recipe.comments,
        }
        for recipe in output.recipes
    ]

    recipe_data = {
        "_id": ObjectId(),

        "user_id": mongo_user_id,

        "date": today.isoformat(),

        "recipes": recipes,

        "food_comment": output.food_comment,

        "created_at": now,
        "updated_at": now,
    }

    await create_daily_recipes(recipe_data)

    return output