from fastapi import HTTPException, status
from app.services.agent_service import generate_daily_plan

async def generate_user_daily_plan(user_id: str):
    """
    Invokes the agent service to generate a bio-adaptive daily plan.
    The service retrieves all required context from MongoDB internally.
    """
    try:
        print(f"[AGENT_CONTROLLER] generate_user_daily_plan called for user_id: {user_id}")
        result = await generate_daily_plan(user_id)
        print(f"[AGENT_CONTROLLER] Daily plan generated successfully")
        return result

    except ValueError as ve:
        print(f"[AGENT_CONTROLLER] ValueError: {ve}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve)
        )
    except HTTPException as he:
        print(f"[AGENT_CONTROLLER] HTTPException: {he.detail}")
        raise he
    except Exception as e:
        print(f"[AGENT_CONTROLLER] Exception: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing daily plan for user: {str(e)}"
        )