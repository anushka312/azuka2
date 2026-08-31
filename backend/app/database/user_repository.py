from bson import ObjectId

from app.database.mongodb import db


users_collection = db["users"]


async def create_user(user_data: dict):
    result = await users_collection.insert_one(user_data)

    return str(result.inserted_id)


async def get_user_by_id(user_id: str):
    return await users_collection.find_one(
        {
            "_id": ObjectId(user_id)
        }
    )


async def get_user_by_email(email: str):
    return await users_collection.find_one(
        {
            "email": email
        }
    )


async def update_user(user_id: str, update_data: dict):
    result = await users_collection.update_one(
        {
            "_id": ObjectId(user_id)
        },
        {
            "$set": update_data
        }
    )

    return result.modified_count > 0