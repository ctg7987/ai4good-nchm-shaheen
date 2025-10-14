"""Tests for corpus and retrieval functionality."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_corpus_stats_endpoint():
    """Test corpus statistics endpoint."""
    response = client.get("/api/v1/corpus/stats")
    
    assert response.status_code == 200
    data = response.json()
    
    # Should return status and data
    assert "status" in data
    assert "data" in data or "message" in data


def test_narrative_with_corpus_insights():
    """Test narrative generation with corpus insights."""
    response = client.post(
        "/api/v1/narrative",
        json={
            "text_ar": "أشعر بالحزن والكآبة اليوم",
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
    
    # Questions should be in Arabic
    assert len(data["questions_ar"]) == 3
    assert all(isinstance(q, str) for q in data["questions_ar"])
    
    # Safety flags should be empty for normal input
    assert data["safety_flags"] == []


def test_narrative_emotion_classification():
    """Test emotion classification with different Arabic emotions."""
    test_cases = [
        ("أشعر بالفرح والسعادة", "joy"),
        ("أنا حزين ومكتئب", "sadness"),
        ("أشعر بالغضب والانفعال", "anger"),
        ("أخاف من المستقبل", "fear")
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


def test_narrative_clinical_detection():
    """Test detection of clinical advice requests."""
    clinical_texts = [
        "أحتاج إلى تشخيص لحالتي النفسية",
        "هل أحتاج إلى علاج نفسي؟",
        "ما هو الدواء المناسب لي؟"
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


def test_narrative_arabic_content():
    """Test that all returned content is in Arabic."""
    response = client.post(
        "/api/v1/narrative",
        json={"text_ar": "أشعر بالحزن"}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check that metaphor and scene are in Arabic
    assert data["metaphor"]
    assert data["scene"]
    
    # Check that questions are in Arabic
    for question in data["questions_ar"]:
        assert len(question) > 0
        # Basic check for Arabic characters
        assert any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in question)


def test_narrative_error_handling():
    """Test error handling for invalid input."""
    # Test with missing required field
    response = client.post(
        "/api/v1/narrative",
        json={"mood": "sadness"}
    )
    
    assert response.status_code == 422  # Validation error


def test_narrative_empty_input():
    """Test narrative with empty text."""
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
