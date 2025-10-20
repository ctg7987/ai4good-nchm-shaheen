"""ArTST API router for Arabic speech recognition."""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional

from app.models.schemas import (
    ArTSTTranscriptionRequest,
    ArTSTTranscriptionResponse,
    ArTSTHealthResponse
)
from app.services.artst_client import artst_client

router = APIRouter()


@router.post("/transcribe", response_model=ArTSTTranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form(default="ar"),
    return_timestamps: bool = Form(default=False)
) -> ArTSTTranscriptionResponse:
    """Transcribe Arabic audio to text using ArTST."""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400, 
                detail="File must be an audio file"
            )
        
        # Read audio data
        audio_data = await file.read()
        
        if len(audio_data) == 0:
            raise HTTPException(
                status_code=400, 
                detail="Empty audio file"
            )
        
        # Transcribe using ArTST
        result = await artst_client.transcribe_audio(
            audio_data=audio_data,
            language=language,
            return_timestamps=return_timestamps
        )
        
        # Handle errors
        if "error" in result:
            raise HTTPException(
                status_code=500, 
                detail=f"Transcription failed: {result['error']}"
            )
        
        return ArTSTTranscriptionResponse(
            transcription=result["transcription"],
            language=result["language"],
            confidence=result["confidence"],
            duration=result["duration"],
            model=result["model"],
            timestamps=result.get("timestamps")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transcribe-bytes", response_model=ArTSTTranscriptionResponse)
async def transcribe_audio_bytes(
    request: ArTSTTranscriptionRequest,
    audio_data: bytes
) -> ArTSTTranscriptionResponse:
    """Transcribe audio from raw bytes using ArTST."""
    try:
        if len(audio_data) == 0:
            raise HTTPException(
                status_code=400, 
                detail="Empty audio data"
            )
        
        # Transcribe using ArTST
        result = await artst_client.transcribe_audio(
            audio_data=audio_data,
            language=request.language,
            return_timestamps=request.return_timestamps
        )
        
        # Handle errors
        if "error" in result:
            raise HTTPException(
                status_code=500, 
                detail=f"Transcription failed: {result['error']}"
            )
        
        return ArTSTTranscriptionResponse(
            transcription=result["transcription"],
            language=result["language"],
            confidence=result["confidence"],
            duration=result["duration"],
            model=result["model"],
            timestamps=result.get("timestamps")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health", response_model=ArTSTHealthResponse)
async def check_health() -> ArTSTHealthResponse:
    """Check ArTST service health."""
    try:
        health_data = await artst_client.check_health()
        
        return ArTSTHealthResponse(
            status=health_data["status"],
            model=health_data["model"],
            device=health_data["device"],
            is_loaded=health_data["is_loaded"],
            supported_languages=health_data.get("supported_languages", []),
            error=health_data.get("error")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/languages")
async def get_supported_languages():
    """Get supported languages for ArTST."""
    try:
        languages = await artst_client.get_supported_languages()
        return {
            "languages": languages,
            "model": "ArTST",
            "primary_language": "ar"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/initialize")
async def initialize_artst():
    """Initialize ArTST model (useful for preloading)."""
    try:
        await artst_client.initialize()
        return {
            "status": "success",
            "message": "ArTST model initialized successfully",
            "device": artst_client.device,
            "model": "ArTST"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to initialize ArTST: {str(e)}"
        )

