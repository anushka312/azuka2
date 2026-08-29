from fastapi import APIRouter

from app.controllers.daily_state_controller import (
    create_user_daily_state,
    get_user_daily_state,
    update_user_daily_state
)

from app.schemas.daily_state_schema import (
    DailyStateCreate,
    DailyStateUpdate
)


router = APIRouter(
    prefix="/api/daily-state",
    tags=["Daily State"]
)


@router.post("/{user_id}")
def create_daily_state(
    user_id: str,
    daily_state: DailyStateCreate
):
    return create_user_daily_state(
        user_id,
        daily_state
    )


@router.get("/{user_id}/{date}")
def get_daily_state(
    user_id: str,
    date: str
):
    return get_user_daily_state(
        user_id,
        date
    )


@router.put("/{user_id}/{date}")
def update_daily_state(
    user_id: str,
    date: str,
    daily_state: DailyStateUpdate
):
    return update_user_daily_state(
        user_id,
        date,
        daily_state
    )