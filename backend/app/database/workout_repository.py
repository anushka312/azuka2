# app/database/workout_repository.py

from bson import ObjectId

from app.database.mongodb import db

workouts_collection = db["workouts"]

async def create_workout(
workout_data: dict
):


    result = await workouts_collection.insert_one(
        workout_data
    )

    return str(result.inserted_id)


async def get_workout(
user_id: str,
date: str
):


    return await workouts_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        }
    )


async def get_workouts(
user_id: str,
start_date: str,
end_date: str
):


    return await list(
        workouts_collection.find(
            {
                "user_id": ObjectId(user_id),
                "date": {
                    "$gte": start_date,
                    "$lte": end_date
                }
            }
        ).sort(
            "date",
            1
        )
    )


async def update_workout(
user_id: str,
date: str,
update_data: dict
):


    return await workouts_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$set": update_data
        }
    )


async def add_actual_activity(
user_id: str,
date: str,
activity: dict
):


    return await workouts_collection.update_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        },
        {
            "$push": {
                "actual_activities": activity
            }
        }
    )

