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


async def create_user_profile(user_data: UserProfileCreate):

    print(f"[USER_CONTROLLER] create_user_profile called with email: {user_data.email}")

    # Check whether email is already registered
    print(f"[USER_CONTROLLER] Checking if user {user_data.email} already exists...")
    existing_user = await get_user_by_email(user_data.email)

    if existing_user:
        print(f"[USER_CONTROLLER] User {user_data.email} already exists!")
        raise HTTPException(
            status_code=409,
            detail="A user with this email already exists."
        )

    print(f"[USER_CONTROLLER] User {user_data.email} does not exist, creating...")
    # Convert Pydantic model to dictionary
    user_dict = user_data.model_dump()

    # Create user
    print(f"[USER_CONTROLLER] Calling create_user...")
    user_id = await create_user(user_dict)
    print(f"[USER_CONTROLLER] User created successfully with id: {user_id}")

    return {
        "user_id": user_id,
        "message": "User profile created successfully."
    }


async def get_user_profile(user_id: str):

    try:
        user = await get_user_by_id(user_id)

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

async def get_user_profile_by_email(email: str):

    print(f"[USER_CONTROLLER] get_user_profile_by_email called for: {email}")
    user = await get_user_by_email(email)

    if not user:
        print(f"[USER_CONTROLLER] User not found for email: {email}")
        raise HTTPException(
            status_code=404,
            detail="User profile not found",
        )

    print(f"[USER_CONTROLLER] User found for email: {email}, converting _id...")
    user["_id"] = str(user["_id"])

    return user

async def update_user_profile(
    user_id: str,
    user_data: UserProfileUpdate
):

    try:
        existing_user = await get_user_by_id(user_id)

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

    await update_user(
        user_id,
        update_data
    )

    return {
        "user_id": user_id,
        "message": "User profile updated successfully."
    }