from bson import ObjectId

from app.database.mongodb import db


cycle_history_collection = db["cycle_history"]


async def create_cycle(cycle_data: dict):
    result = await cycle_history_collection.insert_one(
        cycle_data
    )

    return str(result.inserted_id)


async def get_cycle_by_id(cycle_id: str):
    return await cycle_history_collection.find_one(
        {
            "_id": ObjectId(cycle_id)
        }
    )


async def get_latest_cycle(user_id: str):
    return await cycle_history_collection.find_one(
        {
            "user_id": ObjectId(user_id)
        },
        sort=[
            ("period_start_date", -1)
        ]
    )


async def get_cycle_history(user_id: str):
    return await list(
        cycle_history_collection.find(
            {
                "user_id": ObjectId(user_id)
            }
        ).sort(
            "period_start_date",
            -1
        )
    )


async def update_cycle(cycle_id: str, update_data: dict):
    result = await cycle_history_collection.update_one(
        {
            "_id": ObjectId(cycle_id)
        },
        {
            "$set": update_data
        }
    )

    return result.modified_count > 0