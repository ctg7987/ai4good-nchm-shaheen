"""Arabic NLP API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from app.services.arabic_nlp import arabic_nlp_service
from app.models.schemas import (
    ArabicNLPAnalysisRequest,
    ArabicNLPAnalysisResponse,
    InterventionSuggestionResponse,
    ArabicNLPHealthResponse
)

router = APIRouter()

@router.post("/initialize", response_model=dict)
async def initialize_arabic_nlp(background_tasks: BackgroundTasks):
    """
    Initialize Arabic NLP models in the background.
    """
    try:
        # Run initialization in background to avoid blocking the request
        background_tasks.add_task(arabic_nlp_service.initialize)
        return JSONResponse(
            status_code=202, 
            content={
                "status": "accepted", 
                "message": "Arabic NLP models initialization started in background."
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start Arabic NLP initialization: {e}")

@router.post("/analyze", response_model=ArabicNLPAnalysisResponse)
async def analyze_text(request: ArabicNLPAnalysisRequest):
    """
    Analyze Arabic or English text for sentiment, emotion, and safety.
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        analysis_result = await arabic_nlp_service.analyze_text(request.text)
        return ArabicNLPAnalysisResponse(**analysis_result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Defensive text analysis failed: {e}")

@router.post("/suggest-intervention", response_model=InterventionSuggestionResponse)
async def suggest_intervention(request: ArabicNLPAnalysisRequest):
    """
    Get personalized intervention suggestion based on text analysis.
    """
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Analyze text first
        analysis_result = await arabic_nlp_service.analyze_text(request.text)
        
        # Get intervention suggestion
        intervention = await arabic_nlp_service.get_intervention_suggestion(analysis_result)
        
        return InterventionSuggestionResponse(**intervention)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to suggest intervention: {e}")

@router.get("/health", response_model=ArabicNLPHealthResponse)
async def get_arabic_nlp_health():
    """
    Check the health and status of the Arabic NLP service.
    """
    try:
        return ArabicNLPHealthResponse(
            status="healthy" if arabic_nlp_service.is_loaded else "unhealthy",
            models_loaded=arabic_nlp_service.is_loaded,
            device=arabic_nlp_service.device,
            supported_languages=["ar", "en"],
            error=None if arabic_nlp_service.is_loaded else "Models not loaded"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Arabic NLP health check failed: {e}")

@router.get("/supported-languages")
async def get_supported_languages():
    """
    Returns the languages supported by the Arabic NLP service.
    """
    try:
        return {
            "languages": ["ar", "en"],
            "primary_language": "ar",
            "description": "Supports Modern Standard Arabic, Arabic dialects, and English"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve supported languages: {e}")

