"""Arabic NLP service for sentiment analysis and emotion classification."""

import re
import logging
from typing import Dict, List, Optional, Tuple
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
from arabic_reshaper import reshape
from bidi.algorithm import get_display

logger = logging.getLogger(__name__)

class ArabicNLPService:
    """Arabic NLP service using MARBERT for sentiment and emotion analysis."""
    
    def __init__(self):
        self.sentiment_classifier = None
        self.emotion_classifier = None
        self.crisis_classifier = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.is_loaded = False
        
        # Arabic text normalization patterns
        self.normalization_patterns = [
            # Remove diacritics
            (r'[\u064B-\u065F\u0670\u0640]', ''),
            # Normalize alef variants
            (r'[\u0622\u0623\u0625]', '\u0627'),
            # Normalize teh marbuta
            (r'\u0629', '\u0647'),
            # Normalize yeh variants
            (r'[\u064A\u0649]', '\u064A'),
            # Remove repeated punctuation
            (r'([.!?]){2,}', r'\1'),
            # Normalize whitespace
            (r'\s+', ' '),
        ]
        
        # Crisis detection keywords (Arabic and English)
        self.crisis_keywords = {
            'ar': [
                'انتحار', 'قتل نفسي', 'لا أريد العيش', 'أريد الموت', 'لا جدوى', 
                'لا فائدة', 'أشعر باليأس', 'لا أستطيع', 'أريد أن أنتهي',
                'لا أستحق العيش', 'أفضل الموت', 'لا أريد أن أكون هنا'
            ],
            'en': [
                'suicide', 'kill myself', 'end it all', 'not worth living', 
                'want to die', 'better off dead', 'no point', 'hopeless',
                'can\'t go on', 'give up', 'end my life'
            ]
        }

    async def initialize(self):
        """Initialize the NLP models."""
        if self.is_loaded:
            return
            
        try:
            logger.info("Loading Arabic NLP models...")
            
            # Load MARBERT for sentiment analysis
            self.sentiment_classifier = pipeline(
                "text-classification",
                model="UBC-NLP/MARBERT",
                device=self.device,
                return_all_scores=True
            )
            
            # Load emotion classification model (we'll use a multilingual one for now)
            self.emotion_classifier = pipeline(
                "text-classification",
                model="j-hartmann/emotion-english-distilroberta-base",
                device=self.device,
                return_all_scores=True
            )
            
            self.is_loaded = True
            logger.info("Arabic NLP models loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load NLP models: {e}")
            raise

    def normalize_arabic_text(self, text: str) -> str:
        """Normalize Arabic text for better processing."""
        normalized_text = text
        
        # Apply normalization patterns
        for pattern, replacement in self.normalization_patterns:
            normalized_text = re.sub(pattern, replacement, normalized_text)
        
        # Remove extra whitespace
        normalized_text = ' '.join(normalized_text.split())
        
        return normalized_text

    def detect_language(self, text: str) -> str:
        """Simple language detection for Arabic vs English."""
        arabic_chars = len(re.findall(r'[\u0600-\u06FF]', text))
        total_chars = len(re.sub(r'\s', '', text))
        
        if total_chars == 0:
            return 'unknown'
        
        arabic_ratio = arabic_chars / total_chars
        return 'ar' if arabic_ratio > 0.3 else 'en'

    def detect_crisis_content(self, text: str) -> Tuple[bool, float, str]:
        """Detect potential crisis content in text."""
        if not text.strip():
            return False, 0.0, ""
        
        text_lower = text.lower()
        language = self.detect_language(text)
        keywords = self.crisis_keywords.get(language, [])
        
        crisis_score = 0.0
        matched_keywords = []
        
        for keyword in keywords:
            if keyword.lower() in text_lower:
                crisis_score += 0.2
                matched_keywords.append(keyword)
        
        is_crisis = crisis_score > 0.3
        return is_crisis, crisis_score, "; ".join(matched_keywords)

    async def analyze_text(self, text: str) -> Dict:
        """Analyze text for sentiment, emotion, and safety."""
        if not self.is_loaded:
            await self.initialize()
        
        if not text.strip():
            return {
                'sentiment': 'neutral',
                'sentiment_score': 0.0,
                'emotion': 'neutral',
                'emotion_confidence': 0.0,
                'language': 'unknown',
                'crisis_detected': False,
                'crisis_score': 0.0,
                'normalized_text': '',
                'confidence': 0.0
            }
        
        # Normalize text
        normalized_text = self.normalize_arabic_text(text)
        
        # Detect language
        language = self.detect_language(normalized_text)
        
        # Crisis detection
        is_crisis, crisis_score, matched_keywords = self.detect_crisis_content(text)
        
        try:
            # Sentiment analysis
            sentiment_results = self.sentiment_classifier(normalized_text)
            sentiment_label = sentiment_results[0]['label']
            sentiment_score = sentiment_results[0]['score']
            
            # Convert sentiment to our format
            if sentiment_label in ['POSITIVE', 'positive']:
                sentiment = 'positive'
                sentiment_score = abs(sentiment_score)
            elif sentiment_label in ['NEGATIVE', 'negative']:
                sentiment = 'negative'
                sentiment_score = -abs(sentiment_score)
            else:
                sentiment = 'neutral'
                sentiment_score = 0.0
            
            # Emotion analysis (using English model for now, will improve later)
            emotion_results = self.emotion_classifier(normalized_text)
            emotion_label = emotion_results[0]['label']
            emotion_confidence = emotion_results[0]['score']
            
            # Map emotions to our system
            emotion_mapping = {
                'joy': 'joy',
                'love': 'joy',
                'optimism': 'anticipation',
                'sadness': 'sadness',
                'anger': 'anger',
                'fear': 'fear',
                'surprise': 'surprise',
                'disgust': 'disgust'
            }
            
            emotion = emotion_mapping.get(emotion_label.lower(), 'other')
            
            # Calculate overall confidence
            overall_confidence = (sentiment_score + emotion_confidence) / 2
            
            return {
                'sentiment': sentiment,
                'sentiment_score': sentiment_score,
                'emotion': emotion,
                'emotion_confidence': emotion_confidence,
                'language': language,
                'crisis_detected': is_crisis,
                'crisis_score': crisis_score,
                'crisis_keywords': matched_keywords,
                'normalized_text': normalized_text,
                'confidence': overall_confidence,
                'raw_sentiment_results': sentiment_results,
                'raw_emotion_results': emotion_results
            }
            
        except Exception as e:
            logger.error(f"Error analyzing text: {e}")
            return {
                'sentiment': 'neutral',
                'sentiment_score': 0.0,
                'emotion': 'other',
                'emotion_confidence': 0.0,
                'language': language,
                'crisis_detected': is_crisis,
                'crisis_score': crisis_score,
                'crisis_keywords': matched_keywords,
                'normalized_text': normalized_text,
                'confidence': 0.0,
                'error': str(e)
            }

    async def get_intervention_suggestion(self, analysis_result: Dict) -> Dict:
        """Get personalized intervention based on analysis."""
        emotion = analysis_result.get('emotion', 'other')
        sentiment = analysis_result.get('sentiment', 'neutral')
        intensity = 'high' if abs(analysis_result.get('sentiment_score', 0)) > 0.6 else 'medium' if abs(analysis_result.get('sentiment_score', 0)) > 0.3 else 'low'
        is_crisis = analysis_result.get('crisis_detected', False)
        
        if is_crisis:
            return {
                'type': 'crisis_support',
                'title': 'أحتاج دعم فوري' if analysis_result.get('language') == 'ar' else 'Immediate Support Needed',
                'description': 'نحن هنا لمساعدتك. يرجى التواصل مع الخط الساخن المحلي.' if analysis_result.get('language') == 'ar' else 'We\'re here to help. Please contact your local crisis hotline.',
                'action': 'contact_crisis_line',
                'priority': 'high'
            }
        
        interventions = {
            'sadness': {
                'low': {
                    'type': 'behavioral_activation',
                    'title': 'نشاط بسيط' if analysis_result.get('language') == 'ar' else 'Simple Activity',
                    'description': 'جرب نشاطاً صغيراً تحبه' if analysis_result.get('language') == 'ar' else 'Try a small activity you enjoy',
                    'action': 'suggest_activity'
                },
                'medium': {
                    'type': 'gratitude_practice',
                    'title': 'ممارسة الامتنان' if analysis_result.get('language') == 'ar' else 'Gratitude Practice',
                    'description': 'اكتب ثلاثة أشياء تشعر بالامتنان لها' if analysis_result.get('language') == 'ar' else 'Write down three things you\'re grateful for',
                    'action': 'gratitude_journal'
                },
                'high': {
                    'type': 'professional_support',
                    'title': 'دعم متخصص' if analysis_result.get('language') == 'ar' else 'Professional Support',
                    'description': 'فكر في التحدث مع مستشار' if analysis_result.get('language') == 'ar' else 'Consider talking to a counselor',
                    'action': 'suggest_counseling'
                }
            },
            'anger': {
                'low': {
                    'type': 'mindfulness',
                    'title': 'تأمل قصير' if analysis_result.get('language') == 'ar' else 'Short Meditation',
                    'description': 'خذ نفساً عميقاً وعد إلى 10' if analysis_result.get('language') == 'ar' else 'Take a deep breath and count to 10',
                    'action': 'breathing_exercise'
                },
                'medium': {
                    'type': 'reframing',
                    'title': 'إعادة التفكير' if analysis_result.get('language') == 'ar' else 'Reframing',
                    'description': 'ما هي طريقة أخرى للنظر إلى هذا الموقف؟' if analysis_result.get('language') == 'ar' else 'What\'s another way to look at this situation?',
                    'action': 'cognitive_reframing'
                },
                'high': {
                    'type': 'cooling_down',
                    'title': 'تهدئة النفس' if analysis_result.get('language') == 'ar' else 'Cool Down',
                    'description': 'اتخذ خطوة للخلف وخذ وقتاً للتهدئة' if analysis_result.get('language') == 'ar' else 'Step back and take time to cool down',
                    'action': 'cooling_strategies'
                }
            },
            'fear': {
                'low': {
                    'type': 'grounding',
                    'title': 'تمارين التأريض' if analysis_result.get('language') == 'ar' else 'Grounding Exercises',
                    'description': 'اذكر 5 أشياء تراها حولك' if analysis_result.get('language') == 'ar' else 'Name 5 things you can see around you',
                    'action': 'grounding_technique'
                },
                'medium': {
                    'type': 'breathing',
                    'title': 'تمرين التنفس' if analysis_result.get('language') == 'ar' else 'Breathing Exercise',
                    'description': 'تنفس ببطء: 4 ثوان شهيق، 4 ثوان حبس، 4 ثوان زفير' if analysis_result.get('language') == 'ar' else 'Breathe slowly: 4 seconds in, 4 seconds hold, 4 seconds out',
                    'action': 'breathing_exercise'
                },
                'high': {
                    'type': 'gradual_exposure',
                    'title': 'مواجهة تدريجية' if analysis_result.get('language') == 'ar' else 'Gradual Exposure',
                    'description': 'ابدأ بخطوات صغيرة نحو ما تخاف منه' if analysis_result.get('language') == 'ar' else 'Start with small steps toward what you fear',
                    'action': 'exposure_therapy'
                }
            },
            'joy': {
                'low': {
                    'type': 'celebration',
                    'title': 'احتفل' if analysis_result.get('language') == 'ar' else 'Celebrate',
                    'description': 'شارك شعورك الإيجابي مع الآخرين' if analysis_result.get('language') == 'ar' else 'Share your positive feeling with others',
                    'action': 'social_sharing'
                },
                'medium': {
                    'type': 'gratitude',
                    'title': 'امتنان' if analysis_result.get('language') == 'ar' else 'Gratitude',
                    'description': 'اكتب ما يجلب لك السعادة اليوم' if analysis_result.get('language') == 'ar' else 'Write down what brings you joy today',
                    'action': 'joy_journal'
                },
                'high': {
                    'type': 'sharing_joy',
                    'title': 'مشاركة الفرح' if analysis_result.get('language') == 'ar' else 'Sharing Joy',
                    'description': 'انشر السعادة واجعل يوم شخص آخر أفضل' if analysis_result.get('language') == 'ar' else 'Spread happiness and make someone else\'s day better',
                    'action': 'random_act_kindness'
                }
            }
        }
        
        emotion_interventions = interventions.get(emotion, {})
        intervention = emotion_interventions.get(intensity, emotion_interventions.get('medium', {
            'type': 'general_wellbeing',
            'title': 'رعاية ذاتية' if analysis_result.get('language') == 'ar' else 'Self Care',
            'description': 'خذ وقتاً للعناية بنفسك' if analysis_result.get('language') == 'ar' else 'Take time to care for yourself',
            'action': 'self_care'
        }))
        
        return {
            **intervention,
            'priority': 'high' if intensity == 'high' or is_crisis else 'medium' if intensity == 'medium' else 'low'
        }

# Global instance
arabic_nlp_service = ArabicNLPService()

