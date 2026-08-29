# app/database/daily_score_repository.py

from bson import ObjectId

from app.database.mongodb import db

daily_scores_collection = db["daily_scores"]

async def create_daily_score(
score_data: dict
):


    result = await daily_scores_collection.insert_one(
        score_data
    )

    return str(result.inserted_id)


async def get_daily_score(
user_id: str,
date: str
):


    return await daily_scores_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        }
    )


async def get_recent_scores(
user_id: str,
limit: int = 7
):


    return await list(
        daily_scores_collection.find(
            {
                "user_id": ObjectId(user_id)
            }
        )
        .sort(
            "date",
            -1
        )
        .limit(limit)
    )

