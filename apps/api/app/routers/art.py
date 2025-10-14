"""Art generation router (stub)."""

from fastapi import APIRouter, HTTPException

from app.models.schemas import ArtRequest, ArtResponse

router = APIRouter()


@router.post("/generate", response_model=ArtResponse)
async def generate_art(request: ArtRequest) -> ArtResponse:
    """Generate art based on prompt (stub implementation)."""
    # TODO: Implement actual art generation with AI
    return ArtResponse(
        image_url="https://via.placeholder.com/512x512/05585F/FFFFFF?text=Art+Placeholder",
        prompt_used=request.prompt
    )


@router.get("/styles")
async def get_art_styles():
    """Get available art styles."""
    return {
        "styles": [
            {"id": "therapeutic", "name": "Therapeutic", "description": "Calming and soothing"},
            {"id": "abstract", "name": "Abstract", "description": "Abstract emotional expression"},
            {"id": "nature", "name": "Nature", "description": "Natural and organic"}
        ]
    }
