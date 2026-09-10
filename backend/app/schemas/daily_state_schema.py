from typing import Optional, List
from pydantic import BaseModel, Field


class SymptomsState(BaseModel):
    pain: List[str] = Field(default_factory=list)
    energy: List[str] = Field(default_factory=list)
    digestive: List[str] = Field(default_factory=list)
    appetite: Optional[str] = None
    mood: List[str] = Field(default_factory=list)
    physical: List[str] = Field(default_factory=list)


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
    symptoms: SymptomsState = Field(
        default_factory=SymptomsState
    )
    period: Optional[PeriodState] = None
    sleep: Optional[SleepState] = None


class DailyStateUpdate(BaseModel):
    phase: Optional[str] = None
    day: Optional[int] = None
    symptoms: Optional[SymptomsState] = None
    period: Optional[PeriodState] = None
    sleep: Optional[SleepState] = None