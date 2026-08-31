# app/database/daily_intake_repository.py

from bson import ObjectId

from app.database.mongodb import db

daily_intake_collection = db["daily_intake"]

async def get_daily_intake(
user_id: str,
date: str
):


    return await daily_intake_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        }
    )


async def create_daily_intake(
intake_data: dict
):


    result = await daily_intake_collection.insert_one(
        intake_data
    )

    return str(result.inserted_id)


async def update_daily_intake(
user_id: str,
date: str,
update_data: dict
):


    return await daily_intake_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$set": update_data
        }
    )

