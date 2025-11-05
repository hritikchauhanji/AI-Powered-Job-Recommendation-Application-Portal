from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.recommend import router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Job Recommendation Engine", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(router, prefix="/api", tags=["recommendations"])

@app.get("/")
async def root():
    return {
        "message": "AI-Powered Job Recommendation Engine",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "train": "/api/train",
            "recommend": "/api/recommend"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
