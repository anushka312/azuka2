import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient


load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")

DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "azuka_db"
)


client = AsyncIOMotorClient(MONGO_URI)

db = client[DATABASE_NAME]