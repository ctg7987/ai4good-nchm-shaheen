"""Narrative generation service with Arabic reflection questions."""

import json
import random
from typing import List, Dict
from pathlib import Path


class NarrativeGenerator:
    """Generates therapeutic narratives and reflection questions in Arabic."""
    
    def __init__(self):
        """Initialize the narrative generator."""
        self.prompts_data = self._load_prompts_data()
        self.therapeutic_metaphors = self._get_therapeutic_metaphors()
        self.qdrant_client = None
    
    def _load_prompts_data(self) -> Dict:
        """Load prompts data from JSON file."""
        try:
            assets_path = Path(__file__).parent.parent.parent / "assets" / "prompts.json"
            if assets_path.exists():
                with open(assets_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Warning: Could not load prompts data: {e}")
        
        # Fallback data
        return {
            "journaling_prompts": [
                "اكتب عن مشاعرك اليوم. ما الذي جعلك تشعر بالفرح أو الحزن؟",
                "ما هي التحديات التي واجهتها اليوم؟ كيف تعاملت معها؟",
                "اكتب عن شيء تشعر بالامتنان له اليوم.",
                "ما هي نقاط قوتك؟ كيف يمكنك استخدامها في حياتك؟",
                "اكتب رسالة لنفسك المستقبلية. ما الذي تريد أن تتذكره؟"
            ],
            "reflection_prompts": [
                "ما الذي تعلمته عن نفسك اليوم؟",
                "كيف تغيرت مشاعرك منذ بداية اليوم؟",
                "ما هي الخطوات الصغيرة التي يمكنك اتخاذها غداً؟",
                "ما الذي يجعلك تشعر بالأمل؟",
                "كيف يمكنك أن تكون أكثر لطفاً مع نفسك؟"
            ]
        }
    
    def _get_therapeutic_metaphors(self) -> Dict[str, Dict]:
        """Get therapeutic metaphors for different emotions."""
        return {
            'joy': {
                'metaphor': 'مثل شجرة تزهر في الربيع، أوراقها خضراء وأزهارها تتفتح',
                'scene': 'تخيل نفسك كشجرة جميلة في حديقة، الشمس تشرق عليها والرياح العذبة تهب عليها',
                'questions': [
                    'ما الذي يجعلك تشعر بالحيوية والنمو؟',
                    'كيف يمكنك أن تكون مثل هذه الشجرة المزهرة؟',
                    'ما هي الأزهار الجميلة في حياتك؟'
                ]
            },
            'sadness': {
                'metaphor': 'مثل شجرة في الخريف، أوراقها تتساقط لكن جذورها تبقى قوية',
                'scene': 'تخيل نفسك كشجرة عريقة في حديقة، الرياح تهز أغصانك لكنك تبقى ثابتاً',
                'questions': [
                    'ما الذي يجعلك تشعر بالقوة في هذا الوقت؟',
                    'كيف يمكنك أن تكون مثل هذه الشجرة؟',
                    'ما هي الجذور التي تحافظ عليك؟'
                ]
            },
            'anger': {
                'metaphor': 'مثل بركان يثور، لكن الحمم تبرد وتتحول إلى أرض خصبة',
                'scene': 'تخيل نفسك كجبل عظيم، البركان يثور في داخلك لكنه يهدأ تدريجياً',
                'questions': [
                    'ما الذي يجعلك تشعر بالثورة؟',
                    'كيف يمكنك أن تهدأ مثل البركان؟',
                    'ما هي الطرق الصحية للتعبير عن غضبك؟'
                ]
            },
            'fear': {
                'metaphor': 'مثل طائر صغير يتعلم الطيران، يخاف من السقوط لكنه يجد قوته',
                'scene': 'تخيل نفسك كطائر صغير على حافة العش، تريد الطيران لكنك تخاف',
                'questions': [
                    'ما الذي يخيفك في هذا الوقت؟',
                    'كيف يمكنك أن تجد شجاعتك مثل الطائر؟',
                    'ما هي الخطوات الصغيرة التي يمكنك اتخاذها؟'
                ]
            },
            'neutral': {
                'metaphor': 'مثل بحيرة هادئة، مياهها صافية وهادئة',
                'scene': 'تخيل نفسك كبحيرة جميلة في الصباح، المياه هادئة والطبيعة ساكنة',
                'questions': [
                    'ما الذي يجعلك تشعر بالهدوء؟',
                    'كيف يمكنك الحفاظ على هذا الهدوء؟',
                    'ما هي الأشياء البسيطة التي تجلب لك السلام؟'
                ]
            }
        }
    
    def generate_reflection_questions(self, emotion_classification: Dict) -> List[str]:
        """Generate 3 reflection questions based on emotion classification."""
        primary_emotion = emotion_classification.get('primary', 'neutral')
        intensity = emotion_classification.get('intensity', 1)
        
        # Get base questions for the emotion
        metaphor_data = self.therapeutic_metaphors.get(primary_emotion, self.therapeutic_metaphors['neutral'])
        base_questions = metaphor_data['questions']
        
        # Add some general reflection prompts
        general_prompts = self.prompts_data.get('reflection_prompts', [])
        
        # Combine and select 3 questions
        all_questions = base_questions + general_prompts
        selected_questions = random.sample(all_questions, min(3, len(all_questions)))
        
        return selected_questions
    
    def generate_metaphor_and_scene(self, emotion_classification: Dict) -> Dict[str, str]:
        """Generate therapeutic metaphor and scene based on emotion."""
        primary_emotion = emotion_classification.get('primary', 'neutral')
        metaphor_data = self.therapeutic_metaphors.get(primary_emotion, self.therapeutic_metaphors['neutral'])
        
        return {
            'metaphor': metaphor_data['metaphor'],
            'scene': metaphor_data['scene']
        }
    
    def check_for_clinical_advice_request(self, text_ar: str) -> bool:
        """Check if the text requests clinical advice."""
        clinical_keywords = [
            'تشخيص', 'علاج', 'طبيب', 'دواء', 'مرض', 'اضطراب',
            'نفسي', 'طبيب نفسي', 'علاج نفسي', 'أعراض',
            'حالة', 'مشكلة نفسية', 'مساعدة طبية'
        ]
        
        text_lower = text_ar.lower()
        return any(keyword in text_lower for keyword in clinical_keywords)
    
    def set_qdrant_client(self, qdrant_client):
        """Set the Qdrant client for corpus retrieval."""
        self.qdrant_client = qdrant_client
    
    def get_corpus_insights(self, text_ar: str, emotion_classification: Dict) -> List[str]:
        """Get relevant insights from the corpus."""
        if not self.qdrant_client:
            return []
        
        try:
            # Retrieve similar fragments
            similar_fragments = self.qdrant_client.retrieve_similar(text_ar, k=2)
            
            insights = []
            for fragment in similar_fragments:
                # Extract relevant insights
                if fragment.get('lesson'):
                    insights.append(f"💡 {fragment['lesson']}")
                if fragment.get('metaphor'):
                    insights.append(f"🌱 {fragment['metaphor']}")
            
            return insights[:2]  # Limit to 2 insights
            
        except Exception as e:
            print(f"Error retrieving corpus insights: {e}")
            return []


# Global instance
narrative_generator = NarrativeGenerator()
