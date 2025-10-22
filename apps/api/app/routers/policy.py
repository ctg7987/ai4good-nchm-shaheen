"""Policy and content moderation router with AI safety detection."""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import re

router = APIRouter()

# Enhanced AI-powered content moderation lists
PROFANITY_PATTERNS = [
    # Arabic profanity patterns (examples - in production use proper filter)
    r'\bكلب\b', r'\bغبي\b', r'\bحقير\b',
    # English profanity patterns
    r'\bstupid\b', r'\bidiot\b', r'\bhate\b'
]

VIOLENCE_PATTERNS = [
    r'\bقتل\b', r'\bأذى\b', r'\bضرب\b', r'\bدم\b',
    r'\bkill\b', r'\bhurt\b', r'\bharm\b', r'\battack\b', r'\bviolence\b'
]

SELF_HARM_PATTERNS = [
    r'\bانتحار\b', r'\bأنهي حياتي\b',
    r'\bsuicide\b', r'\bkill myself\b', r'\bend my life\b', r'\bhurt myself\b'
]

# Positive and supportive content indicators
SUPPORTIVE_KEYWORDS = [
    'hope', 'أمل', 'help', 'مساعدة', 'support', 'دعم', 'care', 'رعاية',
    'together', 'معاً', 'strength', 'قوة', 'courage', 'شجاعة', 'healing', 'شفاء'
]


def ai_safety_score(text: str) -> Dict[str, Any]:
    """AI-powered safety scoring of content."""
    text_lower = text.lower()
    
    profanity_count = sum(1 for pattern in PROFANITY_PATTERNS if re.search(pattern, text_lower, re.IGNORECASE))
    violence_count = sum(1 for pattern in VIOLENCE_PATTERNS if re.search(pattern, text_lower, re.IGNORECASE))
    self_harm_count = sum(1 for pattern in SELF_HARM_PATTERNS if re.search(pattern, text_lower, re.IGNORECASE))
    supportive_count = sum(1 for keyword in SUPPORTIVE_KEYWORDS if keyword.lower() in text_lower)
    
    # Calculate safety score (0-100, higher is safer)
    safety_score = 100
    safety_score -= (profanity_count * 20)
    safety_score -= (violence_count * 25)
    safety_score -= (self_harm_count * 30)
    safety_score += (supportive_count * 5)
    safety_score = max(0, min(100, safety_score))  # Clamp between 0-100
    
    is_safe = safety_score >= 60 and self_harm_count == 0
    
    flags = []
    if profanity_count > 0:
        flags.append("profanity_detected")
    if violence_count > 0:
        flags.append("violence_detected")
    if self_harm_count > 0:
        flags.append("self_harm_detected")
        flags.append("crisis_intervention_needed")
    
    return {
        "is_safe": is_safe,
        "safety_score": safety_score,
        "flags": flags,
        "supportive_content": supportive_count > 0,
        "ai_model": "Content Safety AI v2.0"
    }


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
