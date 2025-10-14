"""Application settings and configuration."""

import os
from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # App Configuration
    app_name: str = "NCMH Wellbeing API"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # API Configuration
    api_v1_prefix: str = "/api/v1"
    
    # CORS Configuration
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Database Configuration
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str = ""
    
    # AI Configuration
    openai_api_key: str = ""
    replicate_api_token: str = ""
    
    # Telemetry
    allow_telemetry: bool = False
    
    # Security
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
