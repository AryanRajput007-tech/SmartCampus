from fastapi import APIRouter, HTTPException, status
from app.models.schemas import ChatRequest, ChatResponse
from app.services.gemini_service import GeminiAssistantService

router = APIRouter(prefix="/ai", tags=["AI Placement Assistant"])

@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_with_assistant(request: ChatRequest):
    """
    Answers placement, interview, and career questions using Google Gemini API
    with automatic, graceful fallback if Gemini is offline or unconfigured.
    """
    try:
        response_text, source = GeminiAssistantService.generate_response(
            message=request.message,
            context=request.context or ""
        )
        return ChatResponse(response=response_text, source=source)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating chat response: {str(e)}"
        )
