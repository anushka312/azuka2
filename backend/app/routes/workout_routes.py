from fastapi import APIRouter, HTTPException

from app.controllers.workout_controller import (
get_today_workout,
get_next_workouts,
update_today_workout,
get_workout_history
)

router = APIRouter(
prefix="/api/workout",
tags=["Workout"]
)

@router.get("/today/{user_id}")
def get_today(user_id: str):


    try:
        return get_today_workout(
            user_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.get("/next/{user_id}")
def get_next(user_id: str):


    try:
        return get_next_workouts(
            user_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.put("/today/{user_id}")
def update_today(
user_id: str,
update_data: dict
):


    try:
        return update_today_workout(
            user_id,
            update_data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.get("/history/{user_id}")
def get_history(user_id: str):


    try:
        return get_workout_history(
            user_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

