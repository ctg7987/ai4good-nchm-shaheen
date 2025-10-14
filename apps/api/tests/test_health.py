"""Tests for health endpoints."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Test the health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"ok": True}


def test_health_detailed():
    """Test the detailed health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "ok" in data
    assert "version" in data
    assert "timestamp" in data
    assert data["ok"] is True


def test_root_endpoint():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "status" in data
    assert "disclaimer" in data
    assert data["disclaimer"] == "غير سريري — أداة للتعلم العاطفي فقط"
