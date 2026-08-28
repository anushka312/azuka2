from bson import ObjectId

from app.database.mongodb import db


daily_intake_collection = db["daily_intake"]


def create_daily_intake(intake_data: dict):

    result = daily_intake_collection.insert_one(
        intake_data
    )

    return str(result.inserted_id)


def get_daily_intake(
    user_id: str,
    date
):

    return daily_intake_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        }
    )


def update_daily_intake(
    user_id: str,
    date,
    update_data: dict
):

    result = daily_intake_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$set": update_data
        }
    )

    return result.modified_count