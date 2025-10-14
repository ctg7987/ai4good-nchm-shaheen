"""Health check router."""

from datetime import datetime
from fastapi import APIRouter

from app.core.settings import settings
from app.models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(
        ok=True,
        version=settings.app_version,
        timestamp=datetime.utcnow().isoformat()
    )
