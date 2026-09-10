from typing import List, Optional
from pydantic import BaseModel, Field

class MatchRequest(BaseModel):
    student_skills: List[str] = Field(default_factory=list, description="Skills listed in student profile")
    student_profile_text: Optional[str] = Field(default="", description="Education, projects, and summary")
    required_skills: List[str] = Field(default_factory=list, description="Required skills listed on job")
    job_description: Optional[str] = Field(default="", description="Full description of the job posting")

class MatchResponse(BaseModel):
    match_score: int = Field(ge=0, le=100, description="Overall compatibility percentage (0-100)")
    matched_skills: List[str] = Field(description="Skills that the student has which match the job")
    missing_skills: List[str] = Field(description="Skills required by the job that the student does not have")
    recommendation: str = Field(description="Actionable, explainable feedback for placement prep")
    semantic_similarity: float = Field(ge=0.0, le=1.0, description="TF-IDF cosine similarity score")
    skill_overlap_ratio: float = Field(ge=0.0, le=1.0, description="Direct skill keyword match ratio")

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, description="Student query or interview question")
    context: Optional[str] = Field(default="Placement and career interview assistance", description="Optional conversation context")

class ChatResponse(BaseModel):
    response: str = Field(description="AI response or placement advice")
    source: str = Field(description="Source of response: 'gemini' or 'fallback'")
