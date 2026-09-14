import os
from ai.schemas.input import GeneralState, UserState
from ai.schemas.output import (
    AzukaDailyOutput, 
    FoodVisionOutput, 
    OverallState, 
    WorkoutDayItem, 
    ExerciseDetails, 
    RecipeItem, 
    Micronutrients
)

USE_MOCK_AI = os.getenv("USE_MOCK_AI", "false").lower() == "true"

class AIController:
    @staticmethod
    def generate_daily_plan(general_state: GeneralState, user_state: UserState) -> AzukaDailyOutput:
        """
        Controller logic to execute the daily bio-adaptive intelligence agent.
        """
        if USE_MOCK_AI:
            return AzukaDailyOutput(
                overall=OverallState(
                    daily_recovery_score=85,
                    stress_level="Low",
                    phase_energy_score="High",
                    strain_output_balance_score=90,
                    comment="Estrogen is rising smoothly, supporting great recovery and stable energy output today."
                ),
                workout=[
                    WorkoutDayItem(
                        date="2026-06-06",
                        info_tag="Strength & Core",
                        intensity_tag="Moderate",
                        activities=[
                            ExerciseDetails(activity_name="Bodyweight Squats", type="strength", sets=3, reps=12),
                            ExerciseDetails(activity_name="Plank Hold", type="endurance", duration_mins=3)
                        ]
                    )
                ],
                recipes=[
                    RecipeItem(
                        name="High-Protein Quinoa Buddha Bowl",
                        tags=["Energy Boost", "Follicular"],
                        description="A nutrient-dense bowl combining plant protein, complex carbohydrates, and leafy greens.",
                        calories=520,
                        protein=42,
                        carbohydrates=85,
                        fats=18,
                        ingredients=["Quinoa", "Chickpeas", "Fresh Spinach", "Tahini dressing"],
                        comments="High iron and magnesium content to support recovery and sustain stable energy."
                    )
                ],
                food_comment="Focus on hydrating foods and balanced complex carbs to match your current cycle phase."
            )

        # Real execution path
        from ai.agents.daily_agent import run_azuka_daily_agent
        return run_azuka_daily_agent(general_state=general_state, user_state=user_state)

    @staticmethod
    def analyze_food_image(image_bytes: bytes, mime_type: str = "image/jpeg") -> FoodVisionOutput:
        """
        Controller logic to execute the computer vision meal scanning agent.
        """
        if USE_MOCK_AI:
            return FoodVisionOutput(
                name="Avocado Toast with Poached Egg",
                protein=42,
                calories=420,
                carbohydrates=34,
                fats=24,
                micronutrients=Micronutrients(
                    fiber=9.0,
                    magnesium=85.0,
                    iron=3.2,
                    zinc=2.1
                ),
                insight="Excellent balance of healthy monounsaturated fats and complete proteins for sustained morning focus."
            )

        # Real execution path
        from ai.agents.vision_agent import run_azuka_vision_agent
        return run_azuka_vision_agent(image_bytes=image_bytes, mime_type=mime_type)