from app.services.agent_service import (
    generate_daily_plan
)


def generate_user_daily_plan(
    user_id: str,
):

    return generate_daily_plan(
        user_id
    )