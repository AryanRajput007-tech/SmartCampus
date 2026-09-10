from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_chat_returns_fallback_gracefully():
    payload = {
        "message": "How should I structure my resume for campus placements?",
        "context": "Final year placement preparation"
    }
    response = client.post("/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "response" in data
    assert len(data["response"]) > 20
    assert data["source"] in ["gemini", "fallback"]

def test_chat_invalid_empty_message_rejected():
    payload = {
        "message": ""
    }
    response = client.post("/ai/chat", json=payload)
    assert response.status_code == 422  # Pydantic validation error for empty string
