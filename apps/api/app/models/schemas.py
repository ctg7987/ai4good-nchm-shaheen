"""Pydantic schemas for API requests and responses."""

from typing import List, Optional
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
