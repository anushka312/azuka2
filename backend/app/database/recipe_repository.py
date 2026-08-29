# app/database/recipe_repository.py

from bson import ObjectId

from app.database.mongodb import db

recipes_collection = db["recipes"]

async def create_daily_recipes(
recipe_data: dict
):


    result = await recipes_collection.insert_one(
        recipe_data
    )

    return str(result.inserted_id)


async def get_todays_recipes(
user_id: str,
date: str
):


    return await recipes_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        }
    )


async def update_daily_recipes(
user_id: str,
date: str,
recipes: list
):


    return await recipes_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$set": {
                "recipes": recipes
            }
        }
    )

