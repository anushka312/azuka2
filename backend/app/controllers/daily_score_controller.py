from datetime import date

from app.database.daily_score_repository import (
    get_recent_scores,
)


async def get_user_daily_scores(user_id: str):

    scores = await get_recent_scores(
        user_id,
        7
    )

    for score in scores:
        score["_id"] = str(
            score["_id"]
        )

        score["user_id"] = str(
            score["user_id"]
        )

    today = date.today().isoformat()

    today_score = None
    history = []

    for score in scores:

        if score["date"] == today:
            today_score = score
        else:
            history.append(score)

    return {
        "today": today_score,
        "history": history
    }


async def get_user_recent_scores(
    user_id: str,
    limit: int = 7
):

    scores = await get_recent_scores(
        user_id,
        limit
    )

    for score in scores:

        score["_id"] = str(
            score["_id"]
        )

        score["user_id"] = str(
            score["user_id"]
        )

    return scores