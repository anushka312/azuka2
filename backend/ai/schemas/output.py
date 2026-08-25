from typing import Optional, List
from pydantic import BaseModel

class OverallState(BaseModel):
    daily_recovery_score: int
    stress_level: str
    phase_energy_score: str
    strain_output_balance_score: int
    comment: str


class ExerciseDetails(BaseModel):
    activity_name: str
    type: str 
    # duration or sets
    duration_mins: Optional[int] = None
    sets: Optional[int] = None
    reps: Optional[int] = None

class WorkoutDayItem(BaseModel):
    date: str
    info_tag: str
    intensity_tag: str
    activities: List[ExerciseDetails]

# "recipes":[
    #     {
    #         "name": "High-protein Buddha Bowl",
    #         "tags": ["Energy Boost", "ovulatory"],
    #         "description" : "2-3 lines about the food",
    #         "calories" : 520,
    #         "protein": 42,
    #         "carbohydrates" : 85,
    #         "fats" : 78,
    #         "Ingredients": ["Quinoa", "chickpeas"],
    #         "comments" : "description about why is this recommended"
    #     }
    # ]
class RecipeItem(BaseModel):
    name: str
    tags: List[str]
    description: str
    calories: int
    protein: int
    carbohydrates: int
    fats: int
    ingredients: List[str]
    comments: str

class AzukaDailyOutput(BaseModel):
    overall: OverallState
    workout: List[WorkoutDayItem]
    recipes: List[RecipeItem]
    food_comment: str


# food vision

# {

#     "name": "avocado toast",
#     "protein" : 42,
#     "calories": 420,
#     "carbohydrates" : 34,
#     "fats": 24,
#     "micronutrients" : {
#         "fiber": 9,
#         "magnesium": 85,
#         "iron": 3.2,
#         "zinc":2.1
#     },
#     "insight": "description about food"
# }

class Micronutrients(BaseModel):
    fiber: float
    magnesium: float
    iron: float
    zinc: float

class FoodVisionOutput(BaseModel):
    name: str
    protein: int
    calories: int
    carbohydrates: int
    fats: int
    micronutrients: Micronutrients
