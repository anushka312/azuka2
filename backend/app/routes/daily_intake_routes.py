from fastapi import APIRouter, HTTPException

from app.controllers.daily_intake_controller import (
get_today_intake,
create_today_intake,
update_today_intake
)

router = APIRouter(
prefix="/api/daily-intake",
tags=["Daily Intake"]
)

@router.get("/{user_id}")
def get_intake(user_id: str):


    return get_today_intake(
        user_id
    )


@router.post("/{user_id}")
def create_intake(
user_id: str,
intake_data: dict
):


    try:
        return create_today_intake(
            user_id,
            intake_data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.put("/{user_id}")
def update_intake(
user_id: str,
update_data: dict
):


    try:
        return update_today_intake(
            user_id,
            update_data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

