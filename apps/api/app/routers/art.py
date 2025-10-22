"""Art generation router with AI comic generation."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
import random

from app.models.schemas import ArtRequest, ArtResponse

router = APIRouter()

# AI-powered prompt templates based on emotions (Plutchik model)
EMOTION_PROMPTS = {
    "joy": "vibrant watercolor illustration, joyful scene with warm golden light, hopeful atmosphere, Arabic calligraphy accents, therapeutic art style",
    "trust": "serene landscape with gentle blues and greens, peaceful gathering, trust and connection theme, Middle Eastern art influence",
    "fear": "stormy sky transitioning to calm, facing challenges, protective falcon imagery, courage visualization, Arabic patterns",
    "surprise": "dynamic composition with bright highlights, discovery moment, wonder and curiosity, Islamic geometric patterns",
    "sadness": "contemplative scene with soft blues and purples, healing journey visualization, rain to rainbow transition, Arabic poetry aesthetic",
    "disgust": "cleansing imagery, purification symbols, lotus emerging from water, renewal and fresh start theme",
    "anger": "intense reds transforming to cool tones, controlled power, justice and strength symbols, ancient Arabic warrior wisdom",
    "anticipation": "sunrise over desert, hopeful journey beginning, path forward, Islamic star patterns, new possibilities"
}

COMIC_STYLES = [
    "emotional journey comic panel, 4-panel layout, Arabic manga style, therapeutic storytelling",
    "Middle Eastern comic art, expressive characters, cultural sensitivity, hope-focused narrative",
    "watercolor comic illustration, soft colors, healing journey visualization, Islamic art influence",
    "digital comic panel, modern Arabic aesthetic, mental wellness theme, uplifting narrative"
]


@router.post("/generate", response_model=ArtResponse)
async def generate_art(request: ArtRequest) -> ArtResponse:
    """Generate art based on prompt using AI models."""
    # In production, this would call Stable Diffusion, DALL-E, or similar
    # For demo: Create enhanced prompts and return structured response
    
    emotion = request.style or "joy"
    base_prompt = EMOTION_PROMPTS.get(emotion, EMOTION_PROMPTS["joy"])
    
    # Combine user prompt with emotion-based enhancement
    enhanced_prompt = f"{request.prompt} {base_prompt}"
    
    # Simulate AI generation with existing comic images
    # In production: await stability_ai.generate(enhanced_prompt)
    comic_images = ["/comic1.png", "/comic2.png", "/comic3.png"]
    selected_image = random.choice(comic_images)
    
    return ArtResponse(
        image_url=selected_image,
        prompt_used=enhanced_prompt
    )


@router.post("/generate-comic", response_model=Dict[str, Any])
async def generate_comic_panels(request: ArtRequest) -> Dict[str, Any]:
    """Generate 4-panel comic based on emotional narrative."""
    emotion = request.style or "joy"
    
    # AI-enhanced panel descriptions
    panels = [
        {
            "panel": 1,
            "description": "Struggling with challenge",
            "prompt": f"{request.prompt} - initial struggle, {EMOTION_PROMPTS.get(emotion, '')}",
            "image_url": "/comic1.png"
        },
        {
            "panel": 2,
            "description": "Recognition and reflection",
            "prompt": f"{request.prompt} - moment of insight, therapeutic visualization",
            "image_url": "/comic2.png"
        },
        {
            "panel": 3,
            "description": "Taking action",
            "prompt": f"{request.prompt} - positive action, healing journey",
            "image_url": "/comic3.png"
        },
        {
            "panel": 4,
            "description": "Growth and hope",
            "prompt": f"{request.prompt} - transformation complete, hopeful future",
            "image_url": "/panel4.png"
        }
    ]
    
    return {
        "status": "success",
        "panels": panels,
        "emotion": emotion,
        "ai_model": "Stable Diffusion v2.1 (simulated)",
        "generation_time_ms": 3500
    }


@router.get("/styles")
async def get_art_styles():
    """Get available art styles."""
    return {
        "styles": [
            {"id": "joy", "name": "Joyful", "description": "Vibrant and uplifting imagery", "emotion": "joy"},
            {"id": "trust", "name": "Trusting", "description": "Peaceful and connecting themes", "emotion": "trust"},
            {"id": "fear", "name": "Courageous", "description": "Overcoming challenges", "emotion": "fear"},
            {"id": "sadness", "name": "Healing", "description": "Contemplative journey to hope", "emotion": "sadness"},
            {"id": "therapeutic", "name": "Therapeutic", "description": "Calming and soothing", "emotion": "neutral"},
            {"id": "abstract", "name": "Abstract", "description": "Abstract emotional expression", "emotion": "surprise"},
            {"id": "nature", "name": "Nature", "description": "Natural and organic", "emotion": "trust"}
        ]
    }
