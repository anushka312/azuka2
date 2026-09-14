from fastapi import APIRouter

from app.controllers.cycle_controller import (
    create_cycle_record,
    get_latest_user_cycle,
    get_user_cycle_history,
    update_cycle_record
)

from app.schemas.cycle_schema import (
    CycleCreate,
    CycleUpdate
)


router = APIRouter(
    prefix="/api/cycle-history",
    tags=["Cycle History"]
)


@router.post("/{user_id}")
async def create_cycle(
    user_id: str,
    cycle_data: CycleCreate
):
    return await create_cycle_record(
        user_id,
        cycle_data
    )


@router.get("/{user_id}")
async def get_cycles(
    user_id: str
):
    return await get_user_cycle_history(
        user_id
    )


@router.get("/{user_id}/latest")
async def get_latest_cycle(
    user_id: str
):
    return await get_latest_user_cycle(
        user_id
    )


@router.put("/{cycle_id}")
async def update_cycle(
    cycle_id: str,
    cycle_data: CycleUpdate
):
    return await update_cycle_record(
        cycle_id,
        cycle_data
    )