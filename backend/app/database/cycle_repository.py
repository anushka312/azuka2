from bson import ObjectId

from app.database.mongodb import db


cycle_history_collection = db["cycle_history"]


def add_cycle(cycle_data: dict):

    result = cycle_history_collection.insert_one(
        cycle_data
    )

    return str(result.inserted_id)


def get_latest_cycle(user_id: str):

    return cycle_history_collection.find_one(
        {
            "user_id": ObjectId(user_id)
        },
        sort=[("period_start_date", -1)]
    )


def get_cycle_history(user_id: str):

    return list(
        cycle_history_collection.find(
            {
                "user_id": ObjectId(user_id)
            }
        ).sort(
            "period_start_date",
            -1
        )
    )