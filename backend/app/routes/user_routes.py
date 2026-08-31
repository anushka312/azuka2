
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
def create_profile(
    user_data: UserProfileCreate
):
    return create_user_profile(user_data)


@router.get("/email/{email}")
def get_profile_by_email(
    email: str
):
    return get_user_profile_by_email(email)


@router.get("/{user_id}")
def get_profile(
    user_id: str
):
    return get_user_profile(user_id)


@router.put("/{user_id}")
def update_profile(
    user_id: str,
    user_data: UserProfileUpdate
):
    return update_user_profile(
        user_id,
        user_data
    )

