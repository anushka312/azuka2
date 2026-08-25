from beanie import Document
from pydantic import Field
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List


class DailyPlanSubDoc(Document):
    """Sub-document for generated daily bio-adaptive plans."""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    plan_payload: Dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "daily_plans"


class VisionScanSubDoc(Document):
    """Sub-document for food photo vision scans."""
    scanned_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    image_metadata: Optional[str] = None
    scan_results: Dict[str, Any] = Field(default_factory=dict)

    class Settings:
        name = "vision_scans"


class WorkoutLogSubDoc(Document):
    """Sub-document for logged user workout sessions."""
    logged_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    completed_exercises: List[str] = Field(default_factory=list)
    actual_activities: List[Dict[str, Any]] = Field(default_factory=list)
    duration_mins: Optional[int] = None
    calories_burned: Optional[int] = None
    notes: Optional[str] = None

    class Settings:
        name = "workout_logs"


class MealLogSubDoc(Document):
    """Sub-document for logged meals and nutritional intake adjustments."""
    logged_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    dish_name: str
    calories: int = 0
    protein: int = 0
    carbohydrates: int = 0
    fats: int = 0
    micronutrients: Optional[Dict[str, float]] = None
    source: str = "manual"  # e.g. "vision_scan", "recipe", "manual"

    class Settings:
        name = "meal_logs"


class CheckInSubDoc(Document):
    """Sub-document for daily wellness check-ins (sleep, symptoms, biometrics)."""
    logged_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    sleep_hours: Optional[float] = None
    sleep_quality: Optional[str] = None
    stress_level: Optional[str] = None
    symptoms: Optional[Dict[str, Any]] = None
    phase: Optional[str] = None
    cycle_day: Optional[int] = None

    class Settings:
        name = "check_ins"


class UserProfileDocument(Document):
    """
    Aggregate root document for a user in MongoDB.
    Contains embedded arrays of historical plans, scans, workout logs, meal logs, and check-ins.
    """
    user_id: str = Field(default="default_user", unique=True)
    name: str = "Anushka"
    primary_goal: Optional[str] = None
    
    # Embedded collections
    daily_plans: List[DailyPlanSubDoc] = Field(default_factory=list)
    vision_scans: List[VisionScanSubDoc] = Field(default_factory=list)
    completed_workouts: List[WorkoutLogSubDoc] = Field(default_factory=list)
    meal_logs: List[MealLogSubDoc] = Field(default_factory=list)
    check_ins: List[CheckInSubDoc] = Field(default_factory=list)
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "user_profiles"