from fastapi import APIRouter, HTTPException

from app.controllers.recipe_controller import (
get_user_recipes,
get_user_recipes_by_tag
)

router = APIRouter(
prefix="/api/recipes",
tags=["Recipes"]
)

@router.get("/{user_id}")
def get_recipes(user_id: str):


    return get_user_recipes(
        user_id
    )


@router.get("/{user_id}/tag/{tag}")
def get_recipes_by_tag(
user_id: str,
tag: str
):


    return get_user_recipes_by_tag(
        user_id,
        tag
    )

