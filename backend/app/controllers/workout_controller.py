from datetime import date, timedelta

from app.database.workout_repository import (
get_workout,
get_workouts,
update_workout
)

def get_today_workout(user_id: str):


    today = date.today().isoformat()

    workout = get_workout(
        user_id,
        today
    )

    if not workout:
        raise ValueError(
            "Today's workout not found"
        )

    workout["_id"] = str(
        workout["_id"]
    )
    workout["user_id"] = str(
        workout["user_id"]
    )

    return workout


def get_next_workouts(user_id: str):


    today = date.today()
    end_date = today + timedelta(days=7)

    workouts = get_workouts(
        user_id,
        today.isoformat(),
        end_date.isoformat()
    )

    for workout in workouts:
        workout["_id"] = str(
            workout["_id"]
        )
        workout["user_id"] = str(
            workout["user_id"]
        )

    return workouts


def update_today_workout(
user_id: str,
update_data: dict
):


    today = date.today().isoformat()

    workout = get_workout(
        user_id,
        today
    )

    if not workout:
        raise ValueError(
            "Today's workout not found"
        )

    update_workout(
        user_id,
        today,
        update_data
    )

    updated_workout = get_workout(
        user_id,
        today
    )

    updated_workout["_id"] = str(
        updated_workout["_id"]
    )
    updated_workout["user_id"] = str(
        updated_workout["user_id"]
    )

    return updated_workout


def get_workout_history(user_id: str):


    today = date.today()
    start_date = today - timedelta(days=30)

    workouts = get_workouts(
        user_id,
        start_date.isoformat(),
        today.isoformat()
    )

    for workout in workouts:
        workout["_id"] = str(
            workout["_id"]
        )
        workout["user_id"] = str(
            workout["user_id"]
        )

    return workouts

