"""Narrative generation router."""

from fastapi import APIRouter, HTTPException

from app.models.schemas import NarrativeRequest, NarrativeResponse, StoryRequest, StoryResponse
from app.services.emotion_classifier import emotion_classifier
from app.services.narrative_generator import narrative_generator
from app.services.qdrant_client import qdrant_client

router = APIRouter()


@router.post("/narrative", response_model=NarrativeResponse)
async def generate_narrative(request: NarrativeRequest) -> NarrativeResponse:
    """Generate a therapeutic narrative based on Arabic text input."""
    try:
        # Set up Qdrant client for corpus retrieval
        narrative_generator.set_qdrant_client(qdrant_client)
        
        # Classify emotion from the Arabic text
        emotion_classification = emotion_classifier.classify_emotion(request.text_ar)
        
        # Check for clinical advice requests
        is_clinical_request = narrative_generator.check_for_clinical_advice_request(request.text_ar)
        
        # Generate metaphor and scene
        metaphor_data = narrative_generator.generate_metaphor_and_scene(emotion_classification)
        
        # Generate reflection questions
        questions_ar = narrative_generator.generate_reflection_questions(emotion_classification)
        
        # Get corpus insights
        corpus_insights = narrative_generator.get_corpus_insights(request.text_ar, emotion_classification)
        
        # Enhance questions with corpus insights if available
        if corpus_insights:
            # Add insights as additional reflection points
            questions_ar.extend(corpus_insights)
            # Keep only the first 3 questions to maintain structure
            questions_ar = questions_ar[:3]
        
        # Prepare safety flags
        safety_flags = []
        if is_clinical_request:
            safety_flags.append("clinical_advice_request")
        
        # Prepare disclaimer
        disclaimer = "غير سريري — أداة للتعلم العاطفي فقط"
        if is_clinical_request:
            disclaimer = "تنبيه: هذا التطبيق غير سريري ولا يقدم تشخيصاً أو علاجاً طبياً. يرجى استشارة متخصص في الصحة النفسية للحصول على المساعدة المناسبة."
        
        return NarrativeResponse(
            metaphor=metaphor_data['metaphor'],
            scene=metaphor_data['scene'],
            questions_ar=questions_ar,
            safety_flags=safety_flags,
            non_clinical_disclaimer=disclaimer
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating narrative: {str(e)}")


@router.post("/story", response_model=StoryResponse)
async def generate_story(request: StoryRequest) -> StoryResponse:
    """Generate a therapeutic story based on mood and context."""
    # TODO: Implement actual story generation with AI
    # For now, return mock data
    return StoryResponse(
        metaphor="مثل شجرة في عاصفة، أوراقها تتساقط لكن جذورها تبقى قوية",
        scene="تخيل نفسك كشجرة عريقة في حديقة، الرياح تهز أغصانك لكنك تبقى ثابتاً",
        questions=[
            "ما الذي يجعلك تشعر بالقوة في هذا الوقت؟",
            "كيف يمكنك أن تكون مثل هذه الشجرة؟",
            "ما هي الجذور التي تحافظ عليك؟"
        ]
    )


@router.get("/story/{story_id}")
async def get_story(story_id: str):
    """Get a specific story by ID."""
    # TODO: Implement story retrieval
    raise HTTPException(status_code=501, detail="Not implemented yet")


@router.get("/corpus/stats")
async def get_corpus_stats():
    """Get corpus statistics and status."""
    try:
        stats = qdrant_client.get_corpus_stats()
        return {
            "status": "success",
            "data": stats
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to get corpus stats: {str(e)}"
        }
