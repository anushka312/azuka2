from fastapi import FastAPI
from routes.ai_routes import router as ai_router

app = FastAPI(title="Azuka Backend API", version="1.0.0")

app.include_router(ai_router)

@app.get("/")
def root():
    return {"message": "Azuka API is running"}