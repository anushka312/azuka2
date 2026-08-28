from bson import ObjectId

from app.database.mongodb import db


users_collection = db["users"]


def create_user(user_data: dict):
    """
    Insert a new user into MongoDB.
    """

    result = users_collection.insert_one(user_data)

    return str(result.inserted_id)


def get_user_by_id(user_id: str):
    """
    Get a user using their MongoDB ObjectId.
    """

    return users_collection.find_one(
        {"_id": ObjectId(user_id)}
    )


def get_user_by_email(email: str):
    """
    Find a user using their email.
    """

    return users_collection.find_one(
        {"email": email}
    )


def update_user(user_id: str, update_data: dict):
    """
    Update user fields.
    """

    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": update_data
        }
    )

    return result.modified_count