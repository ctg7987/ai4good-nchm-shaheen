"""Emotion classification service using Plutchik wheel."""

import json
import os
from typing import Dict, List, Optional, Tuple
from pathlib import Path


class EmotionClassifier:
    """Classifies emotions in Arabic text using Plutchik wheel."""
    
    def __init__(self):
        """Initialize the emotion classifier with Plutchik data."""
        self.plutchik_data = self._load_plutchik_data()
        self.emotions = self.plutchik_data.get('emotions', [])
        self.emotion_synonyms = self._build_synonym_map()
    
    def _load_plutchik_data(self) -> Dict:
        """Load Plutchik emotion data from JSON file."""
        try:
            # Try to load from the assets directory
            assets_path = Path(__file__).parent.parent.parent / "assets" / "plutchik.json"
            if assets_path.exists():
                with open(assets_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            
            # Fallback to hardcoded data if file not found
            return self._get_fallback_data()
        except Exception as e:
            print(f"Warning: Could not load Plutchik data: {e}")
            return self._get_fallback_data()
    
    def _get_fallback_data(self) -> Dict:
        """Fallback Plutchik data if file loading fails."""
        return {
            "emotions": [
                {
                    "id": "joy",
                    "name_ar": "فرح",
                    "synonyms_ar": ["سعادة", "بهجة", "سرور", "انبساط", "طمأنينة"],
                    "intensity_levels": [
                        {"level": 1, "name_ar": "رضا"},
                        {"level": 2, "name_ar": "فرح"},
                        {"level": 3, "name_ar": "ابتهاج"}
                    ]
                },
                {
                    "id": "sadness",
                    "name_ar": "حزن",
                    "synonyms_ar": ["أسى", "كآبة", "حزن", "غم", "ألم"],
                    "intensity_levels": [
                        {"level": 1, "name_ar": "أسى"},
                        {"level": 2, "name_ar": "حزن"},
                        {"level": 3, "name_ar": "كآبة"}
                    ]
                },
                {
                    "id": "anger",
                    "name_ar": "غضب",
                    "synonyms_ar": ["غضب", "إزعاج", "انفعال", "سخط", "غيظ"],
                    "intensity_levels": [
                        {"level": 1, "name_ar": "إزعاج"},
                        {"level": 2, "name_ar": "غضب"},
                        {"level": 3, "name_ar": "غضب شديد"}
                    ]
                },
                {
                    "id": "fear",
                    "name_ar": "خوف",
                    "synonyms_ar": ["قلق", "رهبة", "فزع", "رعب", "اضطراب"],
                    "intensity_levels": [
                        {"level": 1, "name_ar": "قلق"},
                        {"level": 2, "name_ar": "خوف"},
                        {"level": 3, "name_ar": "رعب"}
                    ]
                }
            ]
        }
    
    def _build_synonym_map(self) -> Dict[str, Dict]:
        """Build a map of Arabic synonyms to emotion data."""
        synonym_map = {}
        for emotion in self.emotions:
            emotion_id = emotion.get('id')
            name_ar = emotion.get('name_ar', '')
            synonyms = emotion.get('synonyms_ar', [])
            
            # Add the main name
            if name_ar:
                synonym_map[name_ar] = {
                    'emotion_id': emotion_id,
                    'emotion': emotion,
                    'intensity': 2  # Default medium intensity
                }
            
            # Add synonyms with varying intensities
            for i, synonym in enumerate(synonyms):
                intensity = min(3, max(1, i + 1))  # Distribute intensities
                synonym_map[synonym] = {
                    'emotion_id': emotion_id,
                    'emotion': emotion,
                    'intensity': intensity
                }
        
        return synonym_map
    
    def classify_emotion(self, text_ar: str) -> Dict[str, any]:
        """
        Classify emotion in Arabic text.
        
        Args:
            text_ar: Arabic text to analyze
            
        Returns:
            Dict with primary emotion, intensity, and keywords found
        """
        if not text_ar or not text_ar.strip():
            return {
                'primary': 'neutral',
                'intensity': 1,
                'keywords': [],
                'confidence': 0.0
            }
        
        # Simple keyword matching approach
        text_lower = text_ar.lower().strip()
        found_emotions = []
        keywords_found = []
        
        # Check for emotion keywords
        for keyword, emotion_data in self.emotion_synonyms.items():
            if keyword in text_lower:
                found_emotions.append(emotion_data)
                keywords_found.append(keyword)
        
        if not found_emotions:
            return {
                'primary': 'neutral',
                'intensity': 1,
                'keywords': [],
                'confidence': 0.0
            }
        
        # Find the most intense emotion
        primary_emotion = max(found_emotions, key=lambda x: x['intensity'])
        
        return {
            'primary': primary_emotion['emotion_id'],
            'intensity': primary_emotion['intensity'],
            'keywords': keywords_found,
            'confidence': min(1.0, len(keywords_found) * 0.3)  # Simple confidence score
        }
    
    def get_emotion_by_id(self, emotion_id: str) -> Optional[Dict]:
        """Get emotion data by ID."""
        for emotion in self.emotions:
            if emotion.get('id') == emotion_id:
                return emotion
        return None


# Global instance
emotion_classifier = EmotionClassifier()
