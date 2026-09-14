
from fastapi import APIRouter

from app.controllers.user_controller import (
    create_user_profile,
    get_user_profile,
    get_user_profile_by_email,
    update_user_profile
)

from app.schemas.user_schema import (
    UserProfileCreate,
    UserProfileUpdate
)


router = APIRouter(
    prefix="/api/user-profile",
    tags=["User Profile"]
)


@router.post("")
async def create_profile(
    user_data: UserProfileCreate
):
    print("[BACKEND] POST /api/user-profile received")
    print(f"[BACKEND] User email: {user_data.email}")
    try:
        result = await create_user_profile(user_data)
        print(f"[BACKEND] Profile created successfully. user_id={result.get('user_id')}")
        return result
    except Exception as e:
        print(f"[BACKEND] ERROR creating profile: {str(e)}")
        raise


@router.get("/email/{email}")
async def get_profile_by_email(
    email: str
):
    return await get_user_profile_by_email(email)


@router.get("/{user_id}")
async def get_profile(
    user_id: str
):
    return await get_user_profile(user_id)


@router.put("/{user_id}")
async def update_profile(
    user_id: str,
    user_data: UserProfileUpdate
):
    return await update_user_profile(
        user_id,
        user_data
    )
