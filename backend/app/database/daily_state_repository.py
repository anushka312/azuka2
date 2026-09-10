from bson import ObjectId
from app.database.mongodb import db


daily_states_collection = db["daily_states"]


async def create_daily_state(
    daily_state_data: dict
):
    result = await daily_states_collection.insert_one(
        daily_state_data
    )

    return str(result.inserted_id)


async def get_daily_state_by_id(
    daily_state_id: str
):
    return await daily_states_collection.find_one(
        {
            "_id": ObjectId(daily_state_id)
        }
    )


async def get_daily_state(
    user_id: str,
    date: str
):
    return await daily_states_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        }
    )


async def get_all_daily_states(
    user_id: str
):
    cursor = daily_states_collection.find(
        {
            "user_id": ObjectId(user_id)
        }
    ).sort(
        "date",
        1
    )

    return await cursor.to_list(
        length=None
    )


async def update_daily_state(
    user_id: str,
    date: str,
    update_data: dict
):
    result = await daily_states_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$set": update_data
        }
    )

    return result.modified_count > 0