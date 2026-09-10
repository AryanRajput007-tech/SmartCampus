from fastapi import APIRouter, HTTPException, status
from app.models.schemas import MatchRequest, MatchResponse
from app.services.matcher import JobMatcherService

router = APIRouter(prefix="/ai", tags=["AI Job Matcher"])

@router.post("/match", response_model=MatchResponse, status_code=status.HTTP_200_OK)
async def match_job_profile(request: MatchRequest):
    """
    Computes explainable compatibility between a student's profile/skills
    and a job posting using TF-IDF, Cosine Similarity, and Keyword overlap.
    """
    try:
        return JobMatcherService.match(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing AI matching pipeline: {str(e)}"
        )
