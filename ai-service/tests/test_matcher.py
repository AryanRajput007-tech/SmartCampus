import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "SmartCampus" in data["service"]

def test_exact_match_generates_high_score():
    payload = {
        "student_skills": ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
        "student_profile_text": "Built multiple full-stack web applications with React, Express, and MongoDB.",
        "required_skills": ["React", "TypeScript", "Node.js", "MongoDB"],
        "job_description": "Looking for a full stack engineer skilled in React, TypeScript, and Node.js with MongoDB."
    }
    response = client.post("/ai/match", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert 0 <= data["match_score"] <= 100
    assert data["match_score"] >= 80
    assert len(data["matched_skills"]) == 4
    assert len(data["missing_skills"]) == 0
    assert "Excellent match" in data["recommendation"]

def test_partial_match_generates_balanced_feedback():
    payload = {
        "student_skills": ["Python", "SQL"],
        "student_profile_text": "Basic Python and relational database querying.",
        "required_skills": ["Python", "FastAPI", "Docker", "Machine Learning"],
        "job_description": "We need a machine learning developer proficient with Python, FastAPI, and Docker."
    }
    response = client.post("/ai/match", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert 0 <= data["match_score"] <= 100
    assert "Python" in data["matched_skills"]
    assert "FastAPI" in data["missing_skills"]
    assert "Docker" in data["missing_skills"]

def test_zero_overlap_generates_low_score():
    payload = {
        "student_skills": ["Java", "Spring Boot"],
        "student_profile_text": "Enterprise Java backend developer.",
        "required_skills": ["Python", "PyTorch", "Computer Vision"],
        "job_description": "Deep learning researcher with PyTorch experience."
    }
    response = client.post("/ai/match", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["match_score"] < 40
    assert len(data["missing_skills"]) == 3
    assert "Low compatibility" in data["recommendation"]

def test_empty_skills_handled_gracefully():
    payload = {
        "student_skills": [],
        "student_profile_text": "",
        "required_skills": ["React", "Node.js"],
        "job_description": ""
    }
    response = client.post("/ai/match", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["match_score"] >= 0
    assert len(data["missing_skills"]) == 2
