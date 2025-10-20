"""ArTST (Arabic Text and Speech Transformer) client for Arabic speech recognition."""

import asyncio
import io
import logging
import tempfile
from typing import Dict, Any, Optional, List
import torch
import librosa
import soundfile as sf
from transformers import (
    SpeechT5ForSpeechToText,
    SpeechT5Processor,
    SpeechT5Tokenizer,
)
from app.core.settings import settings

logger = logging.getLogger(__name__)


class ArTSTClient:
    """Client for Arabic speech recognition using ArTST models."""
    
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_id = "MBZUAI/ArTST"  # Using the official ArTST model
        self.model = None
        self.processor = None
        self.tokenizer = None
        self.is_loaded = False
        
        # Audio processing parameters
        self.sample_rate = 16000
        self.max_duration = 30  # seconds
        
    async def initialize(self):
        """Initialize the ArTST model."""
        try:
            logger.info(f"Loading ArTST model on {self.device}")
            
            # Load tokenizer, processor, and model
            self.tokenizer = SpeechT5Tokenizer.from_pretrained(self.model_id)
            self.processor = SpeechT5Processor.from_pretrained(
                self.model_id, 
                tokenizer=self.tokenizer
            )
            self.model = SpeechT5ForSpeechToText.from_pretrained(self.model_id).to(self.device)
            
            self.is_loaded = True
            logger.info("ArTST model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load ArTST model: {str(e)}")
            self.is_loaded = False
            raise
    
    async def transcribe_audio(
        self, 
        audio_data: bytes, 
        language: str = "ar",
        return_timestamps: bool = False
    ) -> Dict[str, Any]:
        """
        Transcribe Arabic audio to text using ArTST.
        
        Args:
            audio_data: Raw audio bytes
            language: Language code (currently supports 'ar')
            return_timestamps: Whether to return word-level timestamps
            
        Returns:
            Dict containing transcription results
        """
        if not self.is_loaded:
            await self.initialize()
        
        try:
            # Save audio to temporary file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_audio_path = temp_file.name
            
            try:
                # Load and preprocess audio
                waveform, sample_rate = librosa.load(
                    temp_audio_path, 
                    sr=self.sample_rate,
                    duration=self.max_duration
                )
                
                # Ensure audio is not padding
                if len(waveform) == 0:
                    raise ValueError("Empty audio file")
                
                # Process audio for ArTST
                inputs = self.processor(
                    audio=waveform,
                    sampling_rate=self.sample_rate,
                    return_tensors="pt"
                ).to(self.device)
                
                # Generate transcription
                with torch.no_grad():
                    generated_ids = self.model.generate(
                        inputs["input_values"],
                        attention_mask=inputs["attention_mask"],
                        max_length=512,
                        num_beams=5,
                        early_stopping=True
                    )
                
                # Decode transcription
                transcription = self.tokenizer.batch_decode(
                    generated_ids, 
                    skip_special_tokens=True
                )[0]
                
                # Clean up transcription
                transcription = self._clean_transcription(transcription)
                
                result = {
                    "transcription": transcription,
                    "language": language,
                    "confidence": 0.85,  # ArTST doesn't provide confidence scores
                    "duration": len(waveform) / self.sample_rate,
                    "model": "ArTST"
                }
                
                if return_timestamps:
                    # ArTST doesn't provide word-level timestamps
                    result["timestamps"] = []
                
                return result
                
            finally:
                # Clean up temporary file
                import os
                if os.path.exists(temp_audio_path):
                    os.unlink(temp_audio_path)
                    
        except Exception as e:
            logger.error(f"Transcription failed: {str(e)}")
            return {
                "transcription": "",
                "language": language,
                "confidence": 0.0,
                "error": str(e),
                "model": "ArTST"
            }
    
    def _clean_transcription(self, text: str) -> str:
        """Clean and normalize Arabic transcription."""
        # Remove extra whitespace
        text = " ".join(text.split())
        
        # Basic Arabic text normalization
        # Remove diacritics (optional - can be kept for better accuracy)
        # text = re.sub(r'[\u064B-\u065F\u0670\u0640]', '', text)
        
        return text.strip()
    
    async def transcribe_audio_file(
        self, 
        file_path: str, 
        language: str = "ar"
    ) -> Dict[str, Any]:
        """Transcribe audio from file path."""
        try:
            with open(file_path, "rb") as f:
                audio_data = f.read()
            return await self.transcribe_audio(audio_data, language)
        except Exception as e:
            logger.error(f"Failed to transcribe file {file_path}: {str(e)}")
            return {
                "transcription": "",
                "language": language,
                "confidence": 0.0,
                "error": str(e),
                "model": "ArTST"
            }
    
    async def get_supported_languages(self) -> List[str]:
        """Get list of supported languages."""
        return ["ar"]  # ArTST currently supports Arabic
    
    async def check_health(self) -> Dict[str, Any]:
        """Check if ArTST service is healthy."""
        try:
            if not self.is_loaded:
                await self.initialize()
            
            # Test with a short silence
            import numpy as np
            silence = np.zeros(int(self.sample_rate * 0.1))  # 100ms silence
            test_result = await self.transcribe_audio(
                sf.write(io.BytesIO(), silence, self.sample_rate, format='WAV').read()
            )
            
            return {
                "status": "healthy",
                "model": "ArTST",
                "device": self.device,
                "is_loaded": self.is_loaded,
                "supported_languages": await self.get_supported_languages()
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "model": "ArTST",
                "device": self.device,
                "is_loaded": self.is_loaded
            }
    
    async def close(self):
        """Clean up resources."""
        if self.model is not None:
            del self.model
        if torch.cuda.is_available():
            torch.cuda.empty_cache()


# Global instance
artst_client = ArTSTClient()

