"""Ollama API client for local LLM interactions."""

import asyncio
import json
from typing import Dict, Any, Optional, AsyncGenerator
import httpx
from app.core.settings import settings


class OllamaClient:
    """Client for interacting with Ollama API."""
    
    def __init__(self):
        self.base_url = settings.ollama_base_url
        self.model = settings.ollama_model
        self.client = httpx.AsyncClient(timeout=60.0)
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
    
    async def generate_response(
        self, 
        prompt: str, 
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """Generate a response from Ollama."""
        model = model or self.model
        
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        try:
            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            response.raise_for_status()
            
            result = response.json()
            return result.get("response", "")
            
        except httpx.RequestError as e:
            raise Exception(f"Ollama request failed: {str(e)}")
        except httpx.HTTPStatusError as e:
            raise Exception(f"Ollama API error: {e.response.status_code} - {e.response.text}")
        except Exception as e:
            raise Exception(f"Unexpected error calling Ollama: {str(e)}")
    
    async def generate_streaming_response(
        self, 
        prompt: str, 
        model: Optional[str] = None,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> AsyncGenerator[str, None]:
        """Generate a streaming response from Ollama."""
        model = model or self.model
        
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": True,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        try:
            async with self.client.stream(
                "POST",
                f"{self.base_url}/api/generate",
                json=payload
            ) as response:
                response.raise_for_status()
                
                async for line in response.aiter_lines():
                    if line.strip():
                        try:
                            data = json.loads(line)
                            if "response" in data:
                                yield data["response"]
                            if data.get("done", False):
                                break
                        except json.JSONDecodeError:
                            continue
                            
        except httpx.RequestError as e:
            raise Exception(f"Ollama streaming request failed: {str(e)}")
        except httpx.HTTPStatusError as e:
            raise Exception(f"Ollama streaming API error: {e.response.status_code} - {e.response.text}")
        except Exception as e:
            raise Exception(f"Unexpected error in Ollama streaming: {str(e)}")
    
    async def list_models(self) -> list:
        """List available models in Ollama."""
        try:
            response = await self.client.get(f"{self.base_url}/api/tags")
            response.raise_for_status()
            
            result = response.json()
            return result.get("models", [])
            
        except httpx.RequestError as e:
            raise Exception(f"Failed to list Ollama models: {str(e)}")
        except httpx.HTTPStatusError as e:
            raise Exception(f"Ollama API error listing models: {e.response.status_code} - {e.response.text}")
    
    async def check_health(self) -> Dict[str, Any]:
        """Check if Ollama is running and accessible."""
        try:
            response = await self.client.get(f"{self.base_url}/api/version", timeout=5.0)
            response.raise_for_status()
            
            version_info = response.json()
            return {
                "status": "healthy",
                "version": version_info.get("version", "unknown"),
                "base_url": self.base_url,
                "default_model": self.model
            }
            
        except httpx.RequestError:
            return {
                "status": "unhealthy",
                "error": "Cannot connect to Ollama",
                "base_url": self.base_url,
                "default_model": self.model
            }
        except httpx.HTTPStatusError as e:
            return {
                "status": "unhealthy",
                "error": f"Ollama API error: {e.response.status_code}",
                "base_url": self.base_url,
                "default_model": self.model
            }


# Global instance
ollama_client = OllamaClient()

