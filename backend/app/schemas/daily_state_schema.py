from typing import Optional, List

from pydantic import BaseModel


class Symptom(BaseModel):
    id: str
    name: str
    category: str
    detail: Optional[str] = None


class PeriodState(BaseModel):
    is_period_active: bool
    flow_rate: Optional[str] = None
    started_today: bool = False
    ended_today: bool = False
    start_date: Optional[str] = None
    estimated_end_date: Optional[str] = None


class SleepState(BaseModel):
    sleep_hours: Optional[float] = None


class DailyStateCreate(BaseModel):
    date: str

    phase: Optional[str] = None
    day: Optional[int] = None

    symptoms: List[Symptom] = []

    period: Optional[PeriodState] = None

    sleep: Optional[SleepState] = None


class DailyStateUpdate(BaseModel):
    phase: Optional[str] = None
    day: Optional[int] = None

    symptoms: Optional[List[Symptom]] = None

    period: Optional[PeriodState] = None

    sleep: Optional[SleepState] = None