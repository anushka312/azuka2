from datetime import datetime

from bson import ObjectId
from fastapi import HTTPException

from app.database.daily_state_repository import (
    create_daily_state,
    get_daily_state,
    update_daily_state
)

from app.schemas.daily_state_schema import (
    DailyStateCreate,
    DailyStateUpdate
)


def create_user_daily_state(
    user_id: str,
    daily_state: DailyStateCreate
):
    try:
        ObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id."
        )

    # Check if a daily state already exists
    existing_state = get_daily_state(
        user_id,
        daily_state.date
    )

    if existing_state:
        raise HTTPException(
            status_code=409,
            detail="Daily state already exists for this date."
        )

    now = datetime.utcnow()

    daily_state_data = daily_state.model_dump()

    daily_state_data["user_id"] = ObjectId(user_id)

    # Generated later by the AI agent
    daily_state_data["comment"] = None

    daily_state_data["created_at"] = now
    daily_state_data["updated_at"] = now

    daily_state_id = create_daily_state(
        daily_state_data
    )

    return {
        "daily_state_id": daily_state_id,
        "message": "Daily state created successfully."
    }


def get_user_daily_state(
    user_id: str,
    date: str
):
    try:
        ObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id."
        )

    daily_state = get_daily_state(
        user_id,
        date
    )

    if not daily_state:
        raise HTTPException(
            status_code=404,
            detail="Daily state not found."
        )

    daily_state["_id"] = str(
        daily_state["_id"]
    )

    daily_state["user_id"] = str(
        daily_state["user_id"]
    )

    if daily_state.get("created_at"):
        daily_state["created_at"] = (
            daily_state["created_at"].isoformat()
        )

    if daily_state.get("updated_at"):
        daily_state["updated_at"] = (
            daily_state["updated_at"].isoformat()
        )

    return daily_state


def update_user_daily_state(
    user_id: str,
    date: str,
    daily_state: DailyStateUpdate
):
    try:
        ObjectId(user_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id."
        )

    existing_state = get_daily_state(
        user_id,
        date
    )

    if not existing_state:
        raise HTTPException(
            status_code=404,
            detail="Daily state not found."
        )

    update_data = daily_state.model_dump(
        exclude_unset=True
    )

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update."
        )

    update_data["updated_at"] = datetime.utcnow()

    update_daily_state(
        user_id,
        date,
        update_data
    )

    return {
        "message": "Daily state updated successfully."
    }