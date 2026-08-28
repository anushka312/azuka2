from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from dotenv import load_dotenv

from routes.ai_routes import router as ai_router
from ai.models.user_models import (
    UserProfileDocument,
    DailyPlanSubDoc,
    VisionScanSubDoc,
    WorkoutLogSubDoc,
    MealLogSubDoc,
    CheckInSubDoc,
)

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017/azuka_db")
    app.mongodb_client = AsyncIOMotorClient(mongodb_url)
    
    # Initialize Beanie with all document models
    await init_beanie(
        database=app.mongodb_client.azuka_db,
        document_models=[
            UserProfileDocument,
            DailyPlanSubDoc,
            VisionScanSubDoc,
            WorkoutLogSubDoc,
            MealLogSubDoc,
            CheckInSubDoc,
        ]
    )
    print("[OK] Connected to MongoDB successfully via Beanie!")
    
    yield
    
    # Shutdown: Close connection
    app.mongodb_client.close()
    print("[OK] Closed MongoDB connection.")

app = FastAPI(
    lifespan=lifespan,
    title="Azuka Bio-Adaptive AI Backend",
    version="1.0.0",
    description="Bio-adaptive intelligence engine with MongoDB persistence for Azuka."
)

# Enable CORS for React Native and Web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount AI Engine routes
app.include_router(ai_router, prefix="/api/ai", tags=["AI Engine"])

@app.get("/")
def root():
    return {
        "service": "Azuka Bio-Adaptive AI Backend",
        "status": "online",
        "database": "MongoDB connected via Beanie"
    }