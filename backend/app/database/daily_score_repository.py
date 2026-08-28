from bson import ObjectId

from app.database.mongodb import db


daily_scores_collection = db["daily_scores"]


def create_daily_score(score_data: dict):

    result = daily_scores_collection.insert_one(
        score_data
    )

    return str(result.inserted_id)


def get_daily_score(user_id: str, date):

    return daily_scores_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "date": date
        }
    )


def get_recent_scores(
    user_id: str,
    limit: int = 7
):

    return list(
        daily_scores_collection.find(
            {
                "user_id": ObjectId(user_id)
            }
        )
        .sort("date", -1)
        .limit(limit)
    )