from datetime import datetime
from bson import ObjectId

from app.database.mongodb import db


workouts_collection = db["workouts"]


def get_workout_by_date(user_id: str, date: str):
    return workouts_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        }
    )


def get_today_workout(user_id: str, date: str):
    return get_workout_by_date(user_id, date)


def save_workout(user_id: str, workout_data: dict):
    now = datetime.utcnow()

    workout = {
        **workout_data,
        "user_id": ObjectId(user_id),
        "updated_at": now
    }

    workouts_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": workout_data["date"]
        },
        {
            "$set": workout,
            "$setOnInsert": {
                "created_at": now,
                "generated_at": now
            }
        },
        upsert=True
    )


def get_upcoming_workouts(
    user_id: str,
    today: str,
    limit: int = 7
):
    return list(
        workouts_collection.find(
            {
                "user_id": ObjectId(user_id),
                "date": {"$gt": today},
                "status": "planned"
            }
        )
        .sort("date", 1)
        .limit(limit)
    )


def get_workout_history(
    user_id: str,
    start_date: str,
    end_date: str
):
    return list(
        workouts_collection.find(
            {
                "user_id": ObjectId(user_id),
                "date": {
                    "$gte": start_date,
                    "$lte": end_date
                }
            }
        )
        .sort("date", -1)
    )


def get_completed_workouts(
    user_id: str,
    start_date: str,
    end_date: str
):
    return list(
        workouts_collection.find(
            {
                "user_id": ObjectId(user_id),
                "date": {
                    "$gte": start_date,
                    "$lte": end_date
                },
                "status": {
                    "$in": [
                        "completed",
                        "partially_completed"
                    ]
                }
            }
        )
        .sort("date", -1)
    )


def update_workout_status(
    user_id: str,
    date: str,
    status: str
):
    now = datetime.utcnow()

    update_data = {
        "status": status,
        "updated_at": now
    }

    if status == "completed":
        update_data["completed_at"] = now

    workouts_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$set": update_data
        }
    )


def update_workout_activities(
    user_id: str,
    date: str,
    activities: list
):
    workouts_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$set": {
                "activities": activities,
                "updated_at": datetime.utcnow()
            }
        }
    )


def add_actual_activity(
    user_id: str,
    date: str,
    activity: dict
):
    workouts_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$push": {
                "actual_activities": activity
            },
            "$set": {
                "updated_at": datetime.utcnow()
            }
        }
    )