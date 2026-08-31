from typing import Optional, List

from pydantic import BaseModel


class OverallState(BaseModel):
    daily_recovery_score: int
    stress_level: str
    phase_energy_score: int
    strain_output_balance_score: int
    comment: str


class ExerciseDetails(BaseModel):
    activity_name: str
    type: str

    duration_mins: Optional[int] = None
    sets: Optional[int] = None
    reps: Optional[int] = None


class WorkoutDayItem(BaseModel):
    date: str
    info_tag: str
    intensity_tag: str
    activities: List[ExerciseDetails]


class RecipeItem(BaseModel):
    name: str
    tags: List[str]
    description: str
    calories: int
    protein: int
    carbohydrates: int
    fats: int
    ingredients: List[str]
    comments: str


class AzukaDailyOutput(BaseModel):
    overall: OverallState
    workout: List[WorkoutDayItem]
    recipes: List[RecipeItem]
    food_comment: str


class Micronutrients(BaseModel):
    fiber: float
    magnesium: float
    iron: float
    zinc: float


class FoodVisionOutput(BaseModel):
    name: str
    protein: int
    calories: int
    carbohydrates: int
    fats: int
    micronutrients: Micronutrients