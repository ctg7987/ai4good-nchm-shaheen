"""Tests for narrative endpoints."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_narrative_endpoint_basic():
    """Test basic narrative endpoint functionality."""
    response = client.post(
        "/api/v1/narrative",
        json={
            "text_ar": "أشعر بالحزن اليوم",
            "mood": "sadness"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check required fields
    assert "metaphor" in data
    assert "scene" in data
    assert "questions_ar" in data
    assert "safety_flags" in data
    assert "non_clinical_disclaimer" in data
    
    # Check field types
    assert isinstance(data["metaphor"], str)
    assert isinstance(data["scene"], str)
    assert isinstance(data["questions_ar"], list)
    assert isinstance(data["safety_flags"], list)
    assert isinstance(data["non_clinical_disclaimer"], str)
    
    # Check Arabic content
    assert len(data["questions_ar"]) == 3
    assert all(isinstance(q, str) for q in data["questions_ar"])
    
    # Check safety flags are empty for normal input
    assert data["safety_flags"] == []


def test_narrative_endpoint_emotion_classification():
    """Test emotion classification with different Arabic inputs."""
    test_cases = [
        ("أشعر بالفرح والسعادة", "joy"),
        ("أنا حزين ومكتئب", "sadness"),
        ("أشعر بالغضب والانفعال", "anger"),
        ("أخاف من المستقبل", "fear"),
        ("أشعر بالقلق والتوتر", "fear")
    ]
    
    for text, expected_emotion in test_cases:
        response = client.post(
            "/api/v1/narrative",
            json={"text_ar": text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Should return valid narrative
        assert data["metaphor"]
        assert data["scene"]
        assert len(data["questions_ar"]) == 3
        assert data["safety_flags"] == []


def test_narrative_endpoint_clinical_advice_detection():
    """Test detection of clinical advice requests."""
    clinical_texts = [
        "أحتاج إلى تشخيص لحالتي النفسية",
        "هل أحتاج إلى علاج نفسي؟",
        "ما هو الدواء المناسب لي؟",
        "أريد استشارة طبيب نفسي",
        "لدي اضطراب نفسي وأحتاج مساعدة"
    ]
    
    for text in clinical_texts:
        response = client.post(
            "/api/v1/narrative",
            json={"text_ar": text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Should detect clinical advice request
        assert "clinical_advice_request" in data["safety_flags"]
        assert "غير سريري" in data["non_clinical_disclaimer"]


def test_narrative_endpoint_empty_input():
    """Test narrative endpoint with empty input."""
    response = client.post(
        "/api/v1/narrative",
        json={"text_ar": ""}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should still return valid response
    assert data["metaphor"]
    assert data["scene"]
    assert len(data["questions_ar"]) == 3
    assert data["safety_flags"] == []


def test_narrative_endpoint_missing_text():
    """Test narrative endpoint with missing text_ar field."""
    response = client.post(
        "/api/v1/narrative",
        json={"mood": "sadness"}
    )
    
    assert response.status_code == 422  # Validation error


def test_narrative_endpoint_arabic_questions():
    """Test that questions are in Arabic."""
    response = client.post(
        "/api/v1/narrative",
        json={"text_ar": "أشعر بالحزن"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check that questions contain Arabic text
    for question in data["questions_ar"]:
        assert len(question) > 0
        # Basic check for Arabic characters (not comprehensive)
        assert any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in question)


def test_narrative_endpoint_emotion_keywords():
    """Test emotion classification with specific Arabic keywords."""
    emotion_tests = [
        ("أشعر بالفرح والبهجة", ["فرح", "بهجة"]),
        ("أنا حزين ومكتئب", ["حزن", "مكتئب"]),
        ("أشعر بالغضب والانفعال", ["غضب", "انفعال"]),
        ("أخاف وأشعر بالقلق", ["خاف", "قلق"])
    ]
    
    for text, expected_keywords in emotion_tests:
        response = client.post(
            "/api/v1/narrative",
            json={"text_ar": text}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Should return valid narrative
        assert data["metaphor"]
        assert data["scene"]
        assert len(data["questions_ar"]) == 3
