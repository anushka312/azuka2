from typing import Optional

from pydantic import BaseModel


class GeneralState(BaseModel):
    age: int

    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None

    cycle_tracking_mode: str
    average_cycle_length: int
    period_duration: int

    phase_symptoms: Optional[list[str]] = None

    fitness_focus: str
    current_fitness_level: str
    equipment: str

    average_daily_stress: int

    diet: str

    allergies: Optional[list[str]] = None
    nutrition_friction: Optional[list[str]] = None


class SleepState(BaseModel):
    duration: Optional[float] = None
    quality: Optional[str] = None


class Symptoms(BaseModel):
    pain: Optional[list[str]] = None
    energy: Optional[list[str]] = None
    digestive: Optional[list[str]] = None
    appetite: Optional[str] = None
    mood: Optional[list[str]] = None
    physical: Optional[list[str]] = None


class FoodState(BaseModel):
    calories: Optional[int] = None
    protein: Optional[int] = None
    carbohydrates: Optional[int] = None
    fats: Optional[int] = None


class WorkoutActivity(BaseModel):
    activity: Optional[str] = None
    estimated_calories: Optional[int] = None


class WorkoutState(BaseModel):
    activities: Optional[list[WorkoutActivity]] = None
    comments: Optional[str] = None


class UserState(BaseModel):
    phase: Optional[str] = None
    cycle_day: Optional[int] = None

    sleep: Optional[SleepState] = None
    symptoms: Optional[Symptoms] = None
    food: Optional[FoodState] = None
    workout: Optional[WorkoutState] = None