from fastapi import APIRouter, HTTPException, UploadFile, File, Query, status
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

from controllers.ai_controller import AIController
from ai.schemas.input import GeneralState, UserState
from ai.schemas.output import AzukaDailyOutput, FoodVisionOutput
from ai.models.user_models import (
    UserProfileDocument,
    DailyPlanSubDoc,
    VisionScanSubDoc,
    WorkoutLogSubDoc,
    MealLogSubDoc,
    CheckInSubDoc,
)

router = APIRouter()


# ==========================================
# INPUT SCHEMAS FOR USER INTERACTIONS
# ==========================================

class WorkoutLogInput(BaseModel):
    date: Optional[str] = None
    completed_exercises: List[str] = Field(default_factory=list)
    actual_activities: List[Dict[str, Any]] = Field(default_factory=list)
    duration_mins: Optional[int] = None
    calories_burned: Optional[int] = None
    notes: Optional[str] = None


class MealLogInput(BaseModel):
    dish_name: str
    calories: int = 0
    protein: int = 0
    carbohydrates: int = 0
    fats: int = 0
    micronutrients: Optional[Dict[str, float]] = None
    source: str = "manual"  # "vision_scan", "recipe", "manual"
    date: Optional[str] = None


class CheckInInput(BaseModel):
    sleep_hours: Optional[float] = None
    sleep_quality: Optional[str] = None
    stress_level: Optional[str] = None
    symptoms: Optional[Dict[str, Any]] = None
    phase: Optional[str] = None
    cycle_day: Optional[int] = None
    date: Optional[str] = None


# ==========================================
# HELPER FUNCTIONS
# ==========================================

async def get_or_create_user_profile(user_id: str = "default_user") -> UserProfileDocument:
    """
    Retrieve an existing UserProfileDocument from MongoDB by user_id, 
    or instantiate a new default user profile if none exists.
    """
    user_profile = await UserProfileDocument.find_one(UserProfileDocument.user_id == user_id)
    if not user_profile:
        user_profile = UserProfileDocument(
            user_id=user_id,
            name="Anushka",
            daily_plans=[],
            vision_scans=[],
            completed_workouts=[],
            meal_logs=[],
            check_ins=[],
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
    return user_profile


# ==========================================
# AI GENERATION ENDPOINTS
# ==========================================

@router.post("/daily-plan", response_model=AzukaDailyOutput, status_code=status.HTTP_200_OK)
async def get_daily_plan(
    general_state: GeneralState, 
    user_state: UserState,
    user_id: str = Query(default="default_user", description="ID of the user profile")
):
    """
    API Endpoint to generate or update today's bio-adaptive plan based on 
    the user's persistent profile (GeneralState) and real-time logs (UserState).
    
    Automatically persists the generated plan sub-document into the user's 
    aggregate profile in MongoDB using Beanie's .save() method.
    """
    try:
        # 1. Run AI generation controller
        daily_plan = AIController.generate_daily_plan(general_state, user_state)
        
        # 2. Serialize plan output for MongoDB sub-document payload
        plan_dict = daily_plan.model_dump() if hasattr(daily_plan, "model_dump") else daily_plan.dict()
        
        # 3. Create DailyPlanSubDoc instance
        plan_subdoc = DailyPlanSubDoc(
            created_at=datetime.now(timezone.utc),
            plan_payload=plan_dict
        )
        
        # 4. Fetch existing user profile or initialize default
        user_profile = await get_or_create_user_profile(user_id)
        
        # 5. Append new sub-document and update timestamp
        user_profile.daily_plans.append(plan_subdoc)
        user_profile.updated_at = datetime.now(timezone.utc)
        
        # 6. Save aggregate document cleanly via Beanie
        await user_profile.save()
        
        return daily_plan
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating or saving daily plan: {str(e)}"
        )


@router.get("/daily-plan/latest", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
async def get_latest_daily_plan(
    user_id: str = Query(default="default_user", description="ID of the user profile")
):
    """
    Fetch the most recently generated daily plan from the user's profile document.
    """
    user_profile = await get_or_create_user_profile(user_id)
    if user_profile.daily_plans:
        latest_plan = user_profile.daily_plans[-1]
        return latest_plan.plan_payload
    
    # Return mock default plan if no plan was previously generated
    from controllers.ai_controller import USE_MOCK_AI
    if USE_MOCK_AI:
        mock_general = GeneralState(
            age=28, cycle_tracking_mode="Natural Cycle", average_cycle_length=28,
            period_duration=5, fitness_focus="Strength", current_fitness_level="Intermediate",
            equipment="Home", average_daily_stress=3, diet="Omnivore"
        )
        mock_user = UserState(phase="Luteal", cycle_day=22)
        default_plan = AIController.generate_daily_plan(mock_general, mock_user)
        return default_plan.model_dump()

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="No daily plans found for this user."
    )


@router.post("/vision-scan", response_model=FoodVisionOutput, status_code=status.HTTP_200_OK)
async def scan_meal_image(
    file: UploadFile = File(...),
    user_id: str = Query(default="default_user", description="ID of the user profile")
):
    """
    API Endpoint for on-demand food photo uploads. Extracts macros, calories, 
    and micronutrients using the vision agent, and automatically persists 
    the scan results into the user's aggregate profile in MongoDB using Beanie's .save().
    """
    # Validate file type is an image
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload a valid image file (JPEG, PNG, etc.)."
        )
    
    try:
        image_bytes = await file.read()
        mime_type = file.content_type
        
        # 1. Run computer vision agent controller
        vision_output = AIController.analyze_food_image(image_bytes=image_bytes, mime_type=mime_type)
        
        # 2. Serialize vision output for MongoDB sub-document payload
        scan_dict = vision_output.model_dump() if hasattr(vision_output, "model_dump") else vision_output.dict()
        
        # 3. Create VisionScanSubDoc instance
        vision_subdoc = VisionScanSubDoc(
            scanned_at=datetime.now(timezone.utc),
            image_metadata=f"filename: {file.filename or 'upload'}, content_type: {mime_type}",
            scan_results=scan_dict
        )
        
        # 4. Fetch existing user profile or initialize default
        user_profile = await get_or_create_user_profile(user_id)
        
        # 5. Append new sub-document and update timestamp
        user_profile.vision_scans.append(vision_subdoc)
        user_profile.updated_at = datetime.now(timezone.utc)
        
        # 6. Save aggregate document cleanly via Beanie
        await user_profile.save()
        
        return vision_output
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing or saving food image: {str(e)}"
        )


# ==========================================
# USER INTERACTION PERSISTENCE ENDPOINTS
# ==========================================

@router.post("/workout/log", status_code=status.HTTP_200_OK)
async def log_workout(
    payload: WorkoutLogInput,
    user_id: str = Query(default="default_user", description="ID of the user profile")
):
    """
    Persist completed workout sessions and recorded activities into the user profile.
    """
    try:
        data = WorkoutLogInput(**payload) if isinstance(payload, dict) else payload
        workout_subdoc = WorkoutLogSubDoc(
            logged_at=datetime.now(timezone.utc),
            date=data.date or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            completed_exercises=data.completed_exercises,
            actual_activities=data.actual_activities,
            duration_mins=data.duration_mins,
            calories_burned=data.calories_burned,
            notes=data.notes,
        )
        user_profile = await get_or_create_user_profile(user_id)
        user_profile.completed_workouts.append(workout_subdoc)
        user_profile.updated_at = datetime.now(timezone.utc)
        await user_profile.save()
        
        return {
            "success": True,
            "message": "Workout logged successfully.",
            "data": workout_subdoc.model_dump()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log workout: {str(e)}"
        )


@router.post("/nutrition/log", status_code=status.HTTP_200_OK)
async def log_meal(
    payload: MealLogInput,
    user_id: str = Query(default="default_user", description="ID of the user profile")
):
    """
    Persist meal logs and nutritional intake adjustments into the user profile.
    """
    try:
        data = MealLogInput(**payload) if isinstance(payload, dict) else payload
        meal_subdoc = MealLogSubDoc(
            logged_at=datetime.now(timezone.utc),
            date=data.date or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            dish_name=data.dish_name,
            calories=data.calories,
            protein=data.protein,
            carbohydrates=data.carbohydrates,
            fats=data.fats,
            micronutrients=data.micronutrients,
            source=data.source,
        )
        user_profile = await get_or_create_user_profile(user_id)
        user_profile.meal_logs.append(meal_subdoc)
        user_profile.updated_at = datetime.now(timezone.utc)
        await user_profile.save()
        
        return {
            "success": True,
            "message": "Meal logged successfully.",
            "data": meal_subdoc.model_dump()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log meal: {str(e)}"
        )


@router.post("/check-in", status_code=status.HTTP_200_OK)
async def log_check_in(
    payload: CheckInInput,
    user_id: str = Query(default="default_user", description="ID of the user profile")
):
    """
    Persist daily check-in states (sleep duration/quality, stress, symptoms, cycle stage).
    """
    try:
        data = CheckInInput(**payload) if isinstance(payload, dict) else payload
        check_in_subdoc = CheckInSubDoc(
            logged_at=datetime.now(timezone.utc),
            date=data.date or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            sleep_hours=data.sleep_hours,
            sleep_quality=data.sleep_quality,
            stress_level=data.stress_level,
            symptoms=data.symptoms,
            phase=data.phase,
            cycle_day=data.cycle_day,
        )
        user_profile = await get_or_create_user_profile(user_id)
        user_profile.check_ins.append(check_in_subdoc)
        user_profile.updated_at = datetime.now(timezone.utc)
        await user_profile.save()
        
        return {
            "success": True,
            "message": "Check-in logged successfully.",
            "data": check_in_subdoc.model_dump()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to log check-in: {str(e)}"
        )


# ==========================================
# USER PROFILE QUERY ENDPOINTS
# ==========================================

@router.get("/profile/{user_id}", response_model=UserProfileDocument, status_code=status.HTTP_200_OK)
async def get_user_profile(user_id: str):
    """
    Retrieve the complete aggregate user profile document including history
    of all generated daily plans, vision scans, workouts, meal logs, and check-ins.
    """
    user_profile = await UserProfileDocument.find_one(UserProfileDocument.user_id == user_id)
    if not user_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User profile with user_id '{user_id}' not found."
        )
    return user_profile


@router.get("/profile", response_model=UserProfileDocument, status_code=status.HTTP_200_OK)
async def get_default_user_profile(
    user_id: str = Query(default="default_user", description="ID of the user profile")
):
    """
    Retrieve or initialize the aggregate user profile document for a user.
    """
    user_profile = await get_or_create_user_profile(user_id)
    if not user_profile.id:
        await user_profile.save()
    return user_profile