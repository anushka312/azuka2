from datetime import date

from app.database.recipe_repository import (
get_todays_recipes
)

def get_user_recipes(user_id: str):


    today = date.today().isoformat()

    recipe_document = get_todays_recipes(
        user_id,
        today
    )

    if not recipe_document:
        return []

    return recipe_document.get(
        "recipes",
        []
    )


def get_user_recipes_by_tag(
user_id: str,
tag: str
):


    recipes = get_user_recipes(
        user_id
    )

    return [
        recipe
        for recipe in recipes
        if tag in recipe.get("tags", [])
    ]

