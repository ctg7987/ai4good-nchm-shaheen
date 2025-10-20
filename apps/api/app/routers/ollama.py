"""Ollama API router."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import json
from typing import AsyncGenerator

from app.models.schemas import (
    OllamaRequest, 
    OllamaResponse, 
    OllamaModelsResponse, 
    OllamaHealthResponse,
    OllamaModel
)
from app.services.ollama_client import ollama_client

router = APIRouter()


@router.post("/generate", response_model=OllamaResponse)
async def generate_response(request: OllamaRequest) -> OllamaResponse:
    """Generate a response using Ollama."""
    try:
        response_text = await ollama_client.generate_response(
            prompt=request.prompt,
            model=request.model,
            system_prompt=request.system_prompt,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        return OllamaResponse(
            response=response_text,
            model=request.model or ollama_client.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate/stream")
async def generate_streaming_response(request: OllamaRequest) -> StreamingResponse:
    """Generate a streaming response using Ollama."""
    try:
        async def generate_stream() -> AsyncGenerator[str, None]:
            try:
                async for chunk in ollama_client.generate_streaming_response(
                    prompt=request.prompt,
                    model=request.model,
                    system_prompt=request.system_prompt,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens
                ):
                    # Format as Server-Sent Events
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
                
                # Send end signal
                yield f"data: {json.dumps({'done': True})}\n\n"
                
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models", response_model=OllamaModelsResponse)
async def list_models() -> OllamaModelsResponse:
    """List available Ollama models."""
    try:
        models_data = await ollama_client.list_models()
        
        models = [
            OllamaModel(
                name=model.get("name", "unknown"),
                size=model.get("size", 0),
                digest=model.get("digest", ""),
                modified_at=model.get("modified_at", "")
            )
            for model in models_data
        ]
        
        return OllamaModelsResponse(models=models)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health", response_model=OllamaHealthResponse)
async def check_health() -> OllamaHealthResponse:
    """Check Ollama service health."""
    try:
        health_data = await ollama_client.check_health()
        
        return OllamaHealthResponse(
            status=health_data["status"],
            version=health_data.get("version"),
            base_url=health_data["base_url"],
            default_model=health_data["default_model"],
            error=health_data.get("error")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat_with_ollama(request: OllamaRequest) -> OllamaResponse:
    """Chat with Ollama using a therapeutic system prompt."""
    try:
        # Default therapeutic system prompt for wellbeing app
        therapeutic_system_prompt = """You are Shaheen, a wise and compassionate AI assistant for the NCMH Wellbeing App. 
        You help users with emotional learning and self-awareness. You provide supportive, non-clinical guidance.
        
        Guidelines:
        - Be empathetic and understanding
        - Use metaphors and stories when helpful
        - Encourage reflection and self-awareness
        - Never provide medical advice or diagnosis
        - Always remind users this is for emotional learning only
        - Respond in the same language as the user's input
        - Keep responses concise and meaningful"""
        
        system_prompt = request.system_prompt or therapeutic_system_prompt
        
        response_text = await ollama_client.generate_response(
            prompt=request.prompt,
            model=request.model,
            system_prompt=system_prompt,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        return OllamaResponse(
            response=response_text,
            model=request.model or ollama_client.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

