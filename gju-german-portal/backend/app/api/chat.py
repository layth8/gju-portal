import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_agent import generate_chat_response

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["AI Advisor Chat"])


@router.post("", response_model=ChatResponse)
async def chat_with_advisor(payload: ChatRequest) -> ChatResponse:
    """
    Chat with the GJU German Year Advisor.
    Executes tool calling for deterministic budget calculations.
    """
    if not payload.messages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message history cannot be empty.",
        )

    try:
        response = await generate_chat_response(payload.messages, language=payload.language)
        return response
    except Exception as e:
        logger.error("Error during advisor chat processing: %s", e, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The AI Advisor encountered a temporary issue. Please try again in a moment.",
        )
