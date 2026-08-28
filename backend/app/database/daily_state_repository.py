from bson import ObjectId

from app.database.mongodb import db


daily_states_collection = db["daily_states"]


def create_daily_state(state_data: dict):

    result = daily_states_collection.insert_one(
        state_data
    )

    return str(result.inserted_id)


def get_daily_state(user_id: str, date):

    return daily_states_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        }
    )


def update_daily_state(
    user_id: str,
    date,
    update_data: dict
):

    result = daily_states_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$set": update_data
        }
    )

    return result.modified_count