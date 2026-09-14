from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.user_routes import router as user_router
from app.routes.cycle_routes import router as cycle_router
from app.routes.daily_state_routes import router as daily_state_router
from app.routes.daily_score_routes import router as daily_score_router
from app.routes.daily_intake_routes import router as daily_intake_router
from app.routes.recipe_routes import router as recipe_router
from app.routes.workout_routes import router as workout_router
from app.routes.agent_routes import router as agent_router
from app.routes.vision_routes import (
    router as vision_router
)


app = FastAPI(
    title="Azuka API",
    version="1.0.0"
)

# ============================================================
# CORS MIDDLEWARE
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("[BACKEND STARTUP] CORS middleware configured")


app.include_router(user_router)
print("[BACKEND STARTUP] User router included")

app.include_router(cycle_router)
print("[BACKEND STARTUP] Cycle router included")

app.include_router(daily_state_router)
print("[BACKEND STARTUP] Daily state router included")

app.include_router(daily_score_router)
print("[BACKEND STARTUP] Daily score router included")

app.include_router(daily_intake_router)
print("[BACKEND STARTUP] Daily intake router included")

app.include_router(recipe_router)
print("[BACKEND STARTUP] Recipe router included")

app.include_router(workout_router)
print("[BACKEND STARTUP] Workout router included")

app.include_router(agent_router)
print("[BACKEND STARTUP] Agent router included")

app.include_router(
    vision_router
)
print("[BACKEND STARTUP] Vision router included")



@app.get("/")
def root():
    print("[BACKEND] GET / - root endpoint called")
    return {
        "message": "Azuka API is running"
    }