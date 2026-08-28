import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

# user_profiles = db["users"]
# cycle_history = db["cycle_history"]
# daily_states = db["daily_states"]
# daily_scores = db["daily_scores"]
# recipes = db["recipes"]
# daily_intake = db["daily_intake"]
# workout_today = db["workout_today"]
# workout_upcoming = db["workout_upcoming"]
# workout_history = db["workout_history"]




