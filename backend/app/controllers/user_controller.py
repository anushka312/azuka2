from fastapi import HTTPException

from app.database.user_repository import (
    create_user,
    get_user_by_id,
    get_user_by_email,
    update_user
)

from app.schemas.user_schema import (
    UserProfileCreate,
    UserProfileUpdate
)


def create_user_profile(user_data: UserProfileCreate):

    # Check whether email is already registered
    existing_user = get_user_by_email(user_data.email)

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="A user with this email already exists."
        )

    # Convert Pydantic model to dictionary
    user_dict = user_data.model_dump()

    # Create user
    user_id = create_user(user_dict)

    return {
        "user_id": user_id,
        "message": "User profile created successfully."
    }


def get_user_profile(user_id: str):

    try:
        user = get_user_by_id(user_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id."
        )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # Convert ObjectId to string
    user["_id"] = str(user["_id"])

    return user


def update_user_profile(
    user_id: str,
    user_data: UserProfileUpdate
):

    try:
        existing_user = get_user_by_id(user_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid user_id."
        )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # Only update fields that were actually provided
    update_data = user_data.model_dump(
        exclude_unset=True
    )

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No fields provided for update."
        )

    update_user(
        user_id,
        update_data
    )

    return {
        "user_id": user_id,
        "message": "User profile updated successfully."
    }