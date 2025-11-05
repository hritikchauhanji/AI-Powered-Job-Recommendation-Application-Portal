from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from utils.tfidf_engine import engine

router = APIRouter()

class CandidateProfile(BaseModel):
    skills: List[str]
    experience: int
    location: str

class JobData(BaseModel):
    _id: str
    title: str
    description: str
    skillsRequired: List[str]
    location: str
    companyName: str

class TrainData(BaseModel):
    jobs: List[JobData]

@router.post("/recommend")
async def get_recommendations(candidate: CandidateProfile, top_n: int = 5):
    """Get job recommendations for a candidate"""
    try:
        if engine.job_vectors is None:
            raise HTTPException(status_code=400, detail="Engine not trained. Call /train first.")
        
        recommendations = engine.recommend(
            {
                "skills": candidate.skills,
                "experience": candidate.experience,
                "location": candidate.location
            },
            top_n=top_n
        )
        
        return {
            "success": True,
            "recommendations": recommendations,
            "count": len(recommendations)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/train")
async def train_model(data: TrainData):
    """Train the recommendation engine with jobs data"""
    try:
        jobs_list = [job.model_dump() for job in data.jobs]
        engine.train(jobs_list)
        
        return {
            "success": True,
            "message": f"Model trained with {len(jobs_list)} jobs"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "engine_trained": engine.job_vectors is not None
    }
