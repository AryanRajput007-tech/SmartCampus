from typing import List, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.models.schemas import MatchRequest, MatchResponse
from app.utils.text_utils import normalize_text, extract_skill_set

class JobMatcherService:
    """
    Explainable AI Job Matcher combining:
    1. Direct Skill Set Overlap (Exact & Case-Insensitive)
    2. Semantic TF-IDF + Cosine Similarity over Profile vs Job Description
    """

    @classmethod
    def match(cls, request: MatchRequest) -> MatchResponse:
        # Step 1: Direct Skill Matching
        student_skills_norm = extract_skill_set(request.student_skills)
        required_skills_norm = extract_skill_set(request.required_skills)

        # Retain original casing for presentation
        matched_skills: List[str] = []
        missing_skills: List[str] = []

        for req in request.required_skills:
            req_clean = req.strip().lower()
            if req_clean in student_skills_norm:
                matched_skills.append(req.strip())
            else:
                # Also check if any student skill contains this required skill
                partial_match = any(req_clean in s or s in req_clean for s in student_skills_norm)
                if partial_match:
                    matched_skills.append(req.strip())
                else:
                    missing_skills.append(req.strip())

        # Calculate skill overlap ratio
        if len(request.required_skills) > 0:
            skill_overlap_ratio = len(matched_skills) / len(request.required_skills)
        else:
            skill_overlap_ratio = 1.0 if len(request.student_skills) > 0 else 0.5

        # Step 2: TF-IDF & Cosine Similarity
        semantic_similarity = cls._calculate_tfidf_similarity(
            student_skills=request.student_skills,
            student_profile_text=request.student_profile_text or "",
            required_skills=request.required_skills,
            job_description=request.job_description or ""
        )

        # Step 3: Composite Explainable Score
        # Direct skill overlap is the dominant factor (70%), context/semantic match is 30%
        # If student satisfies 100% of required skills, guarantee strong baseline >= 85%
        base_skill_score = skill_overlap_ratio
        if skill_overlap_ratio >= 1.0 and len(request.required_skills) > 0:
            weighted_score = 0.80 + (0.20 * semantic_similarity)
        else:
            weighted_score = (0.70 * skill_overlap_ratio) + (0.30 * semantic_similarity)

        match_score = int(round(weighted_score * 100))
        match_score = max(0, min(100, match_score))

        # Step 4: Generate Actionable Recommendation
        recommendation = cls._generate_recommendation(
            match_score=match_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            total_required=len(request.required_skills)
        )

        return MatchResponse(
            match_score=match_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            recommendation=recommendation,
            semantic_similarity=round(float(semantic_similarity), 3),
            skill_overlap_ratio=round(float(skill_overlap_ratio), 3)
        )

    @classmethod
    def _calculate_tfidf_similarity(
        cls,
        student_skills: List[str],
        student_profile_text: str,
        required_skills: List[str],
        job_description: str
    ) -> float:
        student_corpus = normalize_text(f"{' '.join(student_skills)} {student_profile_text}")
        job_corpus = normalize_text(f"{' '.join(required_skills)} {job_description}")

        if not student_corpus.strip() or not job_corpus.strip():
            return 0.0

        try:
            vectorizer = TfidfVectorizer(
                stop_words='english',
                ngram_range=(1, 2),
                max_features=500
            )
            tfidf_matrix = vectorizer.fit_transform([student_corpus, job_corpus])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(np.clip(similarity, 0.0, 1.0))
        except Exception:
            return 0.0

    @classmethod
    def _generate_recommendation(
        cls,
        match_score: int,
        matched_skills: List[str],
        missing_skills: List[str],
        total_required: int
    ) -> str:
        if match_score >= 80:
            return (
                f"Excellent match ({match_score}%). You satisfy {len(matched_skills)} of {total_required} "
                f"key requirements ({', '.join(matched_skills[:4])}). We strongly recommend applying! "
                "Highlight relevant projects in your application and prepare for technical deep-dives."
            )
        elif match_score >= 60:
            missing_text = f"focus on brushing up on: {', '.join(missing_skills[:3])}" if missing_skills else "review system design concepts"
            return (
                f"Solid competitive match ({match_score}%). You meet several requirements ({', '.join(matched_skills[:3])}). "
                f"To maximize your interview chances, {missing_text}."
            )
        elif match_score >= 40:
            missing_text = f"bridge key gaps in: {', '.join(missing_skills[:4])}" if missing_skills else "expand your project portfolio"
            return (
                f"Moderate match ({match_score}%). Before applying, consider building a portfolio project to {missing_text}."
            )
        else:
            return (
                f"Low compatibility ({match_score}%). This position requires specialized competencies in "
                f"{', '.join(missing_skills[:4]) if missing_skills else 'different areas'}. "
                "Consider targeting positions closer to your current core strengths or completing prerequisites first."
            )
