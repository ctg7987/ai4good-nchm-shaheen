#!/bin/bash

echo "🚀 Installing ArTST dependencies for enhanced Arabic speech recognition..."

# Navigate to API directory
cd apps/api

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install torch>=2.0.0 transformers>=4.46.3 librosa>=0.10.0 soundfile>=0.12.0

# Install fairseq (required for ArTST)
echo "🔧 Installing fairseq..."
pip install fairseq

# Initialize ArTST model (this will download the model on first use)
echo "🤖 Initializing ArTST model..."
python -c "
import asyncio
from app.services.artst_client import artst_client

async def init_artst():
    try:
        await artst_client.initialize()
        print('✅ ArTST model initialized successfully!')
    except Exception as e:
        print(f'⚠️  ArTST model initialization failed: {e}')
        print('The model will be downloaded automatically on first use.')

asyncio.run(init_artst())
"

echo "✅ ArTST installation complete!"
echo ""
echo "🎯 Features added:"
echo "  • Enhanced Arabic speech recognition using ArTST"
echo "  • Automatic fallback to browser speech recognition"
echo "  • Voice input in CheckIn and OllamaChat pages"
echo "  • Real-time transcription with confidence scores"
echo ""
echo "🌐 Access points:"
echo "  • Main app: http://localhost:5174"
echo "  • Ollama Chat: http://localhost:5174/ollama"
echo "  • API docs: http://localhost:8000/docs"
echo ""
echo "📝 Note: The ArTST model will be downloaded automatically on first use."
echo "   This may take a few minutes depending on your internet connection."

