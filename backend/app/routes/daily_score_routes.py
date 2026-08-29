from fastapi import APIRouter, HTTPException

from app.controllers.daily_score_controller import (
get_user_daily_scores
)

router = APIRouter(
prefix="/api/daily-scores",
tags=["Daily Scores"]
)

@router.get("/{user_id}")
def get_daily_scores(user_id: str):


    try:
        return get_user_daily_scores(
            user_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

