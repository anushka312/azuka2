from fastapi import APIRouter, HTTPException

from app.controllers.agent_controller import (
    generate_user_daily_plan
)


router = APIRouter(
    prefix="/api/agent",
    tags=["AI Agent"]
)


@router.post("/daily/{user_id}")
def generate_daily(
    user_id: str,
):

    try:

        result = generate_user_daily_plan(
            user_id
        )

        return result

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )