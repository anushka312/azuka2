from bson import ObjectId

from app.database.mongodb import db


recipes_collection = db["recipes"]


def get_recipe_by_id(recipe_id: str):

    return recipes_collection.find_one(
        {
            "_id": ObjectId(recipe_id)
        }
    )


def get_recipes_by_ids(recipe_ids: list[str]):

    object_ids = [
        ObjectId(recipe_id)
        for recipe_id in recipe_ids
    ]

    return list(
        recipes_collection.find(
            {
                "_id": {
                    "$in": object_ids
                }
            }
        )
    )


def get_recipes_by_tags(tags: list[str]):

    return list(
        recipes_collection.find(
            {
                "tags": {
                    "$in": tags
                }
            }
        )
    )