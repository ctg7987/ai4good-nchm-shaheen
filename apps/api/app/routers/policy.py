"""Policy and content moderation router."""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

# Placeholder lists for content moderation
PROFANITY_LIST = [
    # Arabic profanity words would go here
    # This is a placeholder - in production, use a proper profanity filter
]

VIOLENCE_LIST = [
    # Arabic violence-related words would go here
    # This is a placeholder - in production, use a proper content filter
]


def is_nonclinical_text(text_ar: str) -> bool:
    """
    Check if Arabic text is non-clinical.
    
    This function always returns True for now as per requirements.
    In production, this would check against clinical terminology.
    """
    return True


def contains_profanity(text: str) -> bool:
    """Check if text contains profanity."""
    # TODO: Implement proper profanity detection
    return False


def contains_violence(text: str) -> bool:
    """Check if text contains violence-related content."""
    # TODO: Implement proper violence detection
    return False


@router.post("/content/check")
async def check_content(text: str) -> Dict[str, Any]:
    """Check content for policy violations."""
    return {
        "is_safe": True,
        "is_nonclinical": is_nonclinical_text(text),
        "contains_profanity": contains_profanity(text),
        "contains_violence": contains_violence(text),
        "recommendations": []
    }


@router.get("/content/guidelines")
async def get_content_guidelines() -> Dict[str, Any]:
    """Get content guidelines."""
    return {
        "guidelines": [
            {
                "type": "non_clinical",
                "description": "Content must be non-clinical and educational only",
                "required": True
            },
            {
                "type": "respectful",
                "description": "Content must be respectful and appropriate",
                "required": True
            },
            {
                "type": "supportive",
                "description": "Content should be supportive and encouraging",
                "required": True
            }
        ],
        "disclaimer": "غير سريري — أداة للتعلم العاطفي فقط"
    }
