from fastapi import APIRouter, File, UploadFile

from app.controllers.vision_controller import (
    analyze_food_image
)


router = APIRouter(
    prefix="/api/food",
    tags=["Food Vision"]
)


@router.post("/vision")
def analyze_food(
    image: UploadFile = File(...)
):
    return analyze_food_image(
        image
    )