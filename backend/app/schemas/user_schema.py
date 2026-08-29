from typing import Optional, List
from pydantic import BaseModel, EmailStr


class GeneralState(BaseModel):
    age: int
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None

    cycle_tracking_mode: str
    average_cycle_length: int
    period_duration: int

    phase_symptoms: Optional[List[str]] = None

    fitness_focus: str
    current_fitness_level: str
    equipment: str

    average_daily_stress: int

    diet: str
    allergies: Optional[List[str]] = None
    nutrition_friction: Optional[List[str]] = None


class CycleState(BaseModel):
    last_period_start_date: Optional[str] = None


class UserProfileCreate(BaseModel):
    name: str
    email: EmailStr

    general_state: GeneralState
    cycle: CycleState


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

    general_state: Optional[GeneralState] = None
    cycle: Optional[CycleState] = None