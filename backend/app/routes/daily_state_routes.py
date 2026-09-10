from fastapi import APIRouter

from app.controllers.daily_state_controller import (
    create_user_daily_state,
    get_user_daily_state,
    get_user_daily_states,
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
async def create_daily_state(
    user_id: str,
    daily_state: DailyStateCreate
):
    return await create_user_daily_state(
        user_id,
        daily_state
    )


@router.get("/{user_id}")
async def get_daily_states(
    user_id: str
):
    return await get_user_daily_states(
        user_id
    )


@router.get("/{user_id}/{date}")
async def get_daily_state(
    user_id: str,
    date: str
):
    return await get_user_daily_state(
        user_id,
        date
    )


@router.put("/{user_id}/{date}")
async def update_daily_state(
    user_id: str,
    date: str,
    daily_state: DailyStateUpdate
):
    return await update_user_daily_state(
        user_id,
        date,
        daily_state
    )