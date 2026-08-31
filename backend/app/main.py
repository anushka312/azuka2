from fastapi import FastAPI

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


app.include_router(user_router)
app.include_router(cycle_router)
app.include_router(daily_state_router)
app.include_router(daily_score_router)
app.include_router(daily_intake_router)
app.include_router(recipe_router)
app.include_router(workout_router)
app.include_router(agent_router)
app.include_router(
    vision_router
)



@app.get("/")
def root():

    return {
        "message": "Azuka API is running"
    }