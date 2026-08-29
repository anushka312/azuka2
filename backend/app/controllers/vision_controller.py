from fastapi import HTTPException, UploadFile

from app.services.vision_service import (
    run_azuka_vision_agent
)


def analyze_food_image(
    image: UploadFile
):

    try:
        image_bytes = image.file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )

        result = run_azuka_vision_agent(
            image_bytes=image_bytes,
            mime_type=image.content_type
        )

        return result

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Food image analysis failed: {str(error)}"
        )