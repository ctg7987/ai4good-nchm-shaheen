"""Pydantic schemas for API requests and responses."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response."""
    ok: bool
    version: str
    timestamp: str


class NarrativeRequest(BaseModel):
    """Request for narrative generation."""
    text_ar: str
    mood: Optional[str] = None


class NarrativeResponse(BaseModel):
    """Response for narrative generation."""
    metaphor: str
    scene: str
    questions_ar: List[str]
    safety_flags: List[str]
    non_clinical_disclaimer: str


class StoryRequest(BaseModel):
    """Request for story generation."""
    mood: str
    context: Optional[str] = None


class StoryResponse(BaseModel):
    """Response for story generation."""
    metaphor: str
    scene: str
    questions: List[str]


class TaskRequest(BaseModel):
    """Request for task generation."""
    task_type: str  # 'breathing' or 'journal'


class TaskResponse(BaseModel):
    """Response for task generation."""
    type: str
    duration: int
    instructions: str


class ReflectionRequest(BaseModel):
    """Request for reflection submission."""
    session_id: int
    content: str


class MetricsRequest(BaseModel):
    """Request for metrics collection."""
    event_type: str
    data: dict


class ArtRequest(BaseModel):
    """Request for art generation."""
    prompt: str
    style: Optional[str] = None


class ArtResponse(BaseModel):
    """Response for art generation."""
    image_url: str
    prompt_used: str


class OllamaRequest(BaseModel):
    """Request for Ollama generation."""
    prompt: str
    model: Optional[str] = None
    system_prompt: Optional[str] = None
    temperature: float = 0.7
    max_tokens: int = 1000
    stream: bool = False


class OllamaResponse(BaseModel):
    """Response for Ollama generation."""
    response: str
    model: str
    temperature: float
    max_tokens: int


class OllamaModel(BaseModel):
    """Ollama model information."""
    name: str
    size: int
    digest: str
    modified_at: str


class OllamaModelsResponse(BaseModel):
    """Response for listing Ollama models."""
    models: List[OllamaModel]


class OllamaHealthResponse(BaseModel):
    """Ollama health check response."""
    status: str
    version: Optional[str] = None
    base_url: str
    default_model: str
    error: Optional[str] = None


class ArTSTTranscriptionRequest(BaseModel):
    """Request for ArTST transcription."""
    language: str = "ar"
    return_timestamps: bool = False


class ArTSTTranscriptionResponse(BaseModel):
    """Response for ArTST transcription."""
    transcription: str
    language: str
    confidence: float
    duration: float
    model: str
    error: Optional[str] = None
    timestamps: Optional[List[Dict[str, Any]]] = None


class ArTSTHealthResponse(BaseModel):
    """ArTST health check response."""
    status: str
    model: str
    device: str
    is_loaded: bool
    supported_languages: List[str]
    error: Optional[str] = None


class ArabicNLPAnalysisRequest(BaseModel):
    """Request for Arabic NLP text analysis."""
    text: str
    language: Optional[str] = None


class ArabicNLPAnalysisResponse(BaseModel):
    """Response for Arabic NLP text analysis."""
    sentiment: str
    sentiment_score: float
    emotion: str
    emotion_confidence: float
    language: str
    crisis_detected: bool
    crisis_score: float
    crisis_keywords: Optional[str] = None
    normalized_text: str
    confidence: float
    error: Optional[str] = None


class InterventionSuggestionResponse(BaseModel):
    """Response for intervention suggestion."""
    type: str
    title: str
    description: str
    action: str
    priority: str


class ArabicNLPHealthResponse(BaseModel):
    """Arabic NLP health check response."""
    status: str
    models_loaded: bool
    device: str
    supported_languages: List[str]
    error: Optional[str] = None
