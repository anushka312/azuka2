from datetime import date

from app.database.daily_intake_repository import (
    get_daily_intake,
    create_daily_intake,
    update_daily_intake
)

async def get_today_intake(user_id: str):

    today = date.today().isoformat()

    intake = await get_daily_intake(
        user_id,
        today
    )

    if not intake:
        return None

    intake["_id"] = str(
        intake["_id"]
    )
    intake["user_id"] = str(
        intake["user_id"]
    )

    return intake


async def create_today_intake(
    user_id: str,
    intake_data: dict
):

    today = date.today().isoformat()

    intake_data["user_id"] = user_id
    intake_data["date"] = today

    intake_id = await create_daily_intake(
        intake_data
    )

    return {
        "id": intake_id,
        "user_id": user_id,
        "date": today
    }


async def update_today_intake(
    user_id: str,
    update_data: dict
):

    today = date.today().isoformat()

    existing_intake = await get_daily_intake(
        user_id,
        today
    )

    if not existing_intake:
        raise ValueError(
            "Today's intake not found"
        )

    await update_daily_intake(
        user_id,
        today,
        update_data
    )

    updated_intake = await get_daily_intake(
        user_id,
        today
    )

    updated_intake["_id"] = str(
        updated_intake["_id"]
    )
    updated_intake["user_id"] = str(
        updated_intake["user_id"]
    )

    return updated_intake
