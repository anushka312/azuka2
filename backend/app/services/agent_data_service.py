import os
from datetime import date, datetime, timezone

from bson import ObjectId
from google import genai

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

from ai.prompts.system_prompt import AZUKA_SYSTEM_PROMPT
from ai.prompts.daily_prompt import AZUKA_DAILY_PROMPT


# ============================================================
# GEMINI CLIENT
# ============================================================

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)


# ============================================================
# HELPER: CONVERT MONGODB DATA TO JSON-SAFE DATA
# ============================================================

def make_json_safe(value):
    """
    Converts MongoDB-specific values such as ObjectId and datetime
    into JSON-serializable values before sending data to Gemini.
    """

    if isinstance(value, ObjectId):
        return str(value)

    if isinstance(value, datetime):
        return value.isoformat()

    if isinstance(value, dict):
        return {
            key: make_json_safe(val)
            for key, val in value.items()
        }

    if isinstance(value, list):
        return [
            make_json_safe(item)
            for item in value
        ]

    return value


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
        weight_kg=general_state.get("weight_kg"),
        height_cm=general_state.get("height_cm"),

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

    # --------------------------------------------------------
    # SLEEP
    # --------------------------------------------------------

    sleep = None

    if daily_state:

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

    if daily_state:

        symptoms_data = daily_state.get(
            "symptoms"
        )

        if symptoms_data:

            symptoms = Symptoms(
                pain=symptoms_data.get(
                    "pain"
                ),

                energy=symptoms_data.get(
                    "energy"
                ),

                digestive=symptoms_data.get(
                    "digestive"
                ),

                appetite=symptoms_data.get(
                    "appetite"
                ),

                mood=symptoms_data.get(
                    "mood"
                ),

                physical=symptoms_data.get(
                    "physical"
                ),
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

                    estimated_calories=activity.get(
                        "estimated_calories"
                    ),
                )
            )

    workout = None

    if workout_activities:

        workout = WorkoutState(
            activities=workout_activities,
            comments=None,
        )

    # --------------------------------------------------------
    # PHASE / CYCLE DAY
    # --------------------------------------------------------

    phase = None
    cycle_day = None

    if daily_state:

        phase = daily_state.get(
            "phase"
        )

        cycle_day = daily_state.get(
            "day"
        )

    # --------------------------------------------------------
    # USER STATE
    # --------------------------------------------------------

    return UserState(
        phase=phase,
        cycle_day=cycle_day,
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

    # --------------------------------------------------------
    # VALIDATE USER ID
    # --------------------------------------------------------

    try:
        ObjectId(user_id)

    except Exception:
        raise ValueError(
            "Invalid user_id"
        )

    # --------------------------------------------------------
    # GET USER
    # --------------------------------------------------------

    user = await get_user_by_id(
        user_id
    )

    if not user:

        raise ValueError(
            "User not found"
        )

    # --------------------------------------------------------
    # GET TODAY'S DAILY STATE
    # --------------------------------------------------------

    daily_state = await get_daily_state(
        user_id,
        today
    )

    # --------------------------------------------------------
    # GET TODAY'S FOOD INTAKE
    # --------------------------------------------------------

    daily_intake = await get_daily_intake(
        user_id,
        today
    )

    # --------------------------------------------------------
    # GET LATEST CYCLE
    # --------------------------------------------------------

    latest_cycle = await get_latest_cycle(
        user_id
    )

    # --------------------------------------------------------
    # GET TODAY'S WORKOUTS
    # --------------------------------------------------------

    recent_workouts = await get_workouts(
        user_id,
        today,
        today
    )

    # --------------------------------------------------------
    # BUILD PYDANTIC STATES
    # --------------------------------------------------------

    general_state = build_general_state(
        user
    )

    user_state = build_user_state(
        daily_state,
        daily_intake,
        recent_workouts
    )

    # --------------------------------------------------------
    # RETURN CONTEXT
    # --------------------------------------------------------

    return {
        "general_state": general_state,
        "user_state": user_state,
        "latest_cycle": latest_cycle,
        "daily_state": daily_state,
        "daily_intake": daily_intake,
        "recent_workouts": recent_workouts,
    }


# ============================================================
# GENERATE DAILY PLAN
# ============================================================

async def generate_daily_plan(
    user_id: str,
) -> AzukaDailyOutput:

    # --------------------------------------------------------
    # GET USER DATA
    # --------------------------------------------------------

    context = await get_agent_context(
        user_id
    )

    general_state = context[
        "general_state"
    ]

    user_state = context[
        "user_state"
    ]

    latest_cycle = context[
        "latest_cycle"
    ]

    # --------------------------------------------------------
    # CREATE JSON PAYLOAD
    # --------------------------------------------------------

    input_payload = {

        "general_state":
            general_state.model_dump(
                exclude_none=True
            ),

        "user_state":
            user_state.model_dump(
                exclude_none=True
            ),

        "latest_cycle":
            make_json_safe(
                latest_cycle
            ),
    }

    # --------------------------------------------------------
    # CREATE PROMPT
    # --------------------------------------------------------

    prompt = (
        AZUKA_DAILY_PROMPT
        + "\n\nUSER DATA:\n"
        + str(input_payload)
    )

    # --------------------------------------------------------
    # CALL GEMINI
    # --------------------------------------------------------

    try:

        response = client.models.generate_content(

            model="gemini-2.5-flash",

            contents=prompt,

            config={
                "system_instruction":
                    AZUKA_SYSTEM_PROMPT,

                "response_mime_type":
                    "application/json",

                "response_schema":
                    AzukaDailyOutput,
            },
        )

    except Exception as e:

        raise RuntimeError(
            f"Gemini daily agent failed: {str(e)}"
        )

    # --------------------------------------------------------
    # VALIDATE AI RESPONSE
    # --------------------------------------------------------

    try:

        result = AzukaDailyOutput.model_validate_json(
            response.text
        )

    except Exception as e:

        raise RuntimeError(
            f"Invalid AI response: {str(e)}"
        )

    # --------------------------------------------------------
    # SAVE AI OUTPUT
    # --------------------------------------------------------

    await save_daily_output(
        user_id,
        result
    )

    return result


# ============================================================
# SAVE DAILY OUTPUT
# ============================================================

async def save_daily_output(
    user_id: str,
    output: AzukaDailyOutput,
):

    mongo_user_id = ObjectId(
        user_id
    )

    now = datetime.now(
        timezone.utc
    )

    today = date.today().isoformat()

    # ========================================================
    # DAILY SCORE
    # ========================================================

    score_data = {

        "_id":
            ObjectId(),

        "user_id":
            mongo_user_id,

        "date":
            today,

        "daily_recovery_score":
            output.overall.daily_recovery_score,

        "stress_level":
            output.overall.stress_level,

        "phase_energy_score":
            output.overall.phase_energy_score,

        "strain_output_balance_score":
            output.overall.strain_output_balance_score,

        "comment":
            output.overall.comment,

        "created_at":
            now,
    }

    await create_daily_score(
        score_data
    )

    # ========================================================
    # WORKOUTS
    # ========================================================

    for workout_day in output.workout:

        workout_data = {

            "_id":
                ObjectId(),

            "user_id":
                mongo_user_id,

            "date":
                workout_day.date,

            "status":
                "planned",

            "info_tag":
                workout_day.info_tag,

            "intensity_tag":
                workout_day.intensity_tag,

            "activities": [

                {

                    "activity_name":
                        activity.activity_name,

                    "type":
                        activity.type,

                    "duration_mins":
                        activity.duration_mins,

                    "sets":
                        activity.sets,

                    "reps":
                        activity.reps,

                    "completed":
                        False,

                }

                for activity
                in workout_day.activities
            ],

            "actual_activities":
                [],

            "created_at":
                now,

            "generated_at":
                now,

            "completed_at":
                None,

            "updated_at":
                now,
        }

        await create_workout(
            workout_data
        )

    # ========================================================
    # RECIPES
    # ========================================================

    recipes = []

    for recipe in output.recipes:

        recipes.append({

            "name":
                recipe.name,

            "time":
                None,

            "isConsumed":
                False,

            "tags":
                recipe.tags,

            "description":
                recipe.description,

            "calories":
                recipe.calories,

            "protein":
                recipe.protein,

            "carbohydrates":
                recipe.carbohydrates,

            "fats":
                recipe.fats,

            "ingredients":
                recipe.ingredients,

            "comments":
                recipe.comments,
        })

    recipe_data = {

        "_id":
            ObjectId(),

        "user_id":
            mongo_user_id,

        "date":
            today,

        "recipes":
            recipes,

        "created_at":
            now,

        "updated_at":
            now,
    }

    await create_daily_recipes(
        recipe_data
    )