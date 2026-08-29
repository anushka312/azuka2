from typing import Optional

from pydantic import BaseModel


class CycleCreate(BaseModel):
    period_start_date: str
    period_end_date: Optional[str] = None

    cycle_length: Optional[int] = None
    period_duration: Optional[int] = None


class CycleUpdate(BaseModel):
    period_start_date: Optional[str] = None
    period_end_date: Optional[str] = None

    cycle_length: Optional[int] = None
    period_duration: Optional[int] = None