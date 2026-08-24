from typing import Optional
from pydantic import BaseModel


# "general_state": {
#         "age": 29,
#         "cycle_tracking_mode" : "Natural Cycle",
#         "average_cycle_length" : 28,
#         "period_duration": 5,
#         "phase_symptoms": ["High Fatigue", "Intense Cravings"] | null,
#         "fitness_focus": "Weight Loss",
#         "current_fitness_level" : "Intermediate",
#         "equipment": "Home",
#         "average_daily_stress" : 3,
#         "diet": "Omnivore",
#         "allergies": ["Dairy-Free", "Gluten-Free"] | null,
#         "nutrition_friction": ["Late-night Cravings", "Lack of Prep Time"] | null

#     }


class GeneralState(BaseModel):
    age: int

    cycle_tracking_mode: str
    average_cycle_length: int
    period_duration: int

    phase_symptoms: Optional[list[str]] = None

    fitness_focus: str
    current_fitness_level: str
    equipment: str

    average_daily_stress: int

    diet: str
    allergies: Optional[list[str]] = None
    nutrition_friction: Optional[list[str]] = None



# "user_state":{
#         "phase":  "Luteal Phase",
#         "cycle_day" : 22,
#         "sleep" : {
#             "duration" : 7.5 | null,
#             "quality": "Restful" | null
#         },
#         "symptoms" : {
#             "pain": ["Cramps", "Headache"] | null,
#             "energy" : ["Fatigue", "Low Energy"] | null,
#             "digestive": ["Bloating", "Nausea"] | null,
#             "appetite": "Food Cravings" | null,
#             "mood": ["irritability", "Low Mood"] | null,
#             "physical": ["Breast Tenderness", "Dizziness"] | null
#         }, 
#         "food":{
#             "calories" : 1850 | null,
#             "protein": 95 | null,
#             "carbohydrates" : 180 | null,
#             "fats" : 50 | null
#         },
#         "workout" : [
#             {
#                 "activity": "Swimming" | null,
#                 "estimated_calories" : 240 | null
#             },
#             {
#                 "activity": "Running" | null,
#                 "estimated_calories": 300 | null
#             },
#             {
#                 "comments" : "I did this yada yada" | null
#             }
#         ]
#     },

class SleepState(BaseModel):
    duration: Optional[float] = None
    quality: Optional[str] = None


class Symptoms(BaseModel):
    pain: Optional[list[str]] = None
    energy: Optional[list[str]] = None
    digestive: Optional[list[str]] = None
    appetite: Optional[str] = None
    mood: Optional[list[str]] = None
    physical: Optional[list[str]] = None


class FoodState(BaseModel):
    calories: Optional[int] = None
    protein: Optional[int] = None
    carbohydrates: Optional[int] = None
    fats: Optional[int] = None


class WorkoutActivity(BaseModel):
    activity: Optional[str] = None
    estimated_calories: Optional[int] = None


class WorkoutState(BaseModel):
    activities: Optional[list[WorkoutActivity]] = None
    comments: Optional[str] = None


class UserState(BaseModel):
    phase: Optional[str] = None
    cycle_day: Optional[int] = None

    sleep: Optional[SleepState] = None
    symptoms: Optional[Symptoms] = None
    food: Optional[FoodState] = None
    workout: Optional[WorkoutState] = None