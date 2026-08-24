from fastapi import APIRouter, HTTPException, UploadFile, File, status
from controllers.ai_controller import AIController
from ai.schemas.input import GeneralState, UserState
from ai.schemas.output import AzukaDailyOutput, FoodVisionOutput



router = APIRouter(prefix="/api/ai", tags=["AI Engine"])

@router.post("/daily-plan", response_model=AzukaDailyOutput, status_code=status.HTTP_200_OK)
def get_daily_plan(general_state: GeneralState, user_state: UserState):
    """
    API Endpoint to generate or update today's bio-adaptive plan based on 
    the user's persistent profile (GeneralState) and real-time logs (UserState).
    """
    try:
        daily_plan = AIController.generate_daily_plan(general_state, user_state)
        return daily_plan
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating daily plan: {str(e)}"
        )

@router.post("/vision-scan", response_model=FoodVisionOutput, status_code=status.HTTP_200_OK)
async def scan_meal_image(file: UploadFile = File(...)):
    """
    API Endpoint for on-demand food photo uploads. Extracts macros, calories, 
    and micronutrients using the vision agent.
    """
    # Validate file type is an image
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload a valid image file (JPEG, PNG, etc.)."
        )
    
    try:
        image_bytes = await file.read()
        mime_type = file.content_type
        
        vision_output = AIController.analyze_food_image(image_bytes=image_bytes, mime_type=mime_type)
        return vision_output
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing food image: {str(e)}"
        )