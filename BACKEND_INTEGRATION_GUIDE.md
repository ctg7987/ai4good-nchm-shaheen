# Backend API Integration for Comic Generation

## Overview

The Shaheen app uses **Ollama LLM** for narrative generation and **emotional analysis** before creating comics. Here's how the frontend connects to the backend.

---

## 🔌 API Endpoints

### 1. Generate Narrative with Ollama
**Endpoint**: `POST /api/ollama/generate`  
**Purpose**: Generate therapeutic narrative using Ollama LLM

#### Request:
```typescript
interface OllamaRequest {
  prompt: string;
  model?: string;           // Default: "llama2"
  system_prompt?: string;   // Therapeutic context
  temperature?: number;     // Default: 0.7
  max_tokens?: number;      // Default: 500
}
```

#### Example Request:
```typescript
const response = await fetch('http://localhost:8000/api/ollama/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "I am feeling anxious about my exam tomorrow",
    system_prompt: "You are a compassionate mental health supporter for Arabic-speaking youth. Generate a therapeutic narrative using metaphors.",
    temperature: 0.7,
    max_tokens: 300
  })
});

const data = await response.json();
// data.response contains the narrative
```

#### Response:
```typescript
interface OllamaResponse {
  response: string;         // Generated narrative
  model: string;           // Model used
  temperature: number;
  max_tokens: number;
}
```

---

### 2. Generate Narrative with Emotion Analysis
**Endpoint**: `POST /api/narrative`  
**Purpose**: Full pipeline - emotion classification → Ollama narrative → reflection questions

#### Request:
```typescript
interface NarrativeRequest {
  text_ar: string;  // User's story in Arabic or English
  mood?: string;    // Optional mood hint
}
```

#### Example Request:
```typescript
const response = await fetch('http://localhost:8000/api/narrative', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text_ar: "أشعر بالقلق قبل الامتحان"
  })
});

const data = await response.json();
```

#### Response:
```typescript
interface NarrativeResponse {
  metaphor: string;           // Therapeutic metaphor
  scene: string;              // Visualization scene
  questions_ar: string[];     // Reflection questions
  safety_flags: string[];     // Clinical advice warnings
  non_clinical_disclaimer: string;
}
```

---

### 3. Generate Comic Panels
**Endpoint**: `POST /api/art/generate-comic-panels`  
**Purpose**: Generate 4-panel comic based on emotions

#### Request:
```typescript
interface ComicPanelRequest {
  emotion: string;        // Primary emotion (joy, sadness, fear, etc.)
  narrative: string;      // Story context
  character: string;      // Character ID
}
```

#### Example Request:
```typescript
const response = await fetch('http://localhost:8000/api/art/generate-comic-panels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emotion: "anxiety",
    narrative: "Feeling stressed about exam",
    character: "falcon"
  })
});

const data = await response.json();
```

#### Response:
```typescript
interface ComicPanelResponse {
  panels: Array<{
    panel_number: number;
    image_url: string;
    caption: string;
    emotion_prompt: string;
  }>;
  narrative_arc: {
    struggle: string;
    insight: string;
    action: string;
    growth: string;
  };
  model_used: string;  // "Stable Diffusion v2.1"
}
```

---

## 🔄 Frontend Integration (Story.tsx)

### Current Implementation (Simulated):

```typescript
const handleGenerateComic = async () => {
  if (!UsageTracker.canGenerateComic()) {
    openPremiumModal();
    return;
  }

  if (selectedCharacter && hasConsent) {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    UsageTracker.trackComicGenerated();
    setComicsRemaining(UsageTracker.getComicsRemaining());
    
    try {
      // Simulated progress
      const progressSteps = [
        { progress: 10, message: 'Connecting to Ollama AI...' },
        { progress: 20, message: 'Analyzing emotions with AI...' },
        { progress: 35, message: 'Ollama generating narrative arc...' },
        // ... more steps
      ];
      
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setGenerationProgress(step.progress);
      }
      
    } catch (error) {
      console.error('Error generating comic:', error);
    }
    
    // Navigate to comic page
    navigate('/comic', { state: { /* comic data */ } });
  }
};
```

---

### ✅ Production-Ready Implementation:

```typescript
const handleGenerateComic = async () => {
  if (!UsageTracker.canGenerateComic()) {
    openPremiumModal();
    return;
  }

  if (selectedCharacter && hasConsent) {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    UsageTracker.trackComicGenerated();
    setComicsRemaining(UsageTracker.getComicsRemaining());
    
    try {
      // STEP 1: Connect to Ollama (10%)
      setGenerationProgress(10);
      
      // STEP 2: Generate narrative with Ollama (10% → 35%)
      setGenerationProgress(20);
      const narrativeResponse = await fetch('http://localhost:8000/api/ollama/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: storyText,
          system_prompt: "You are a compassionate therapist. Create a supportive narrative for an Arabic-speaking youth dealing with: " + storyText,
          temperature: 0.7,
          max_tokens: 300
        })
      });
      
      if (!narrativeResponse.ok) {
        throw new Error('Failed to generate narrative');
      }
      
      const narrativeData = await narrativeResponse.json();
      setGenerationProgress(35);
      
      // STEP 3: Analyze emotions (35% → 50%)
      setGenerationProgress(40);
      const emotionResponse = await fetch('http://localhost:8000/api/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text_ar: storyText
        })
      });
      
      const emotionData = await emotionResponse.json();
      setGenerationProgress(50);
      
      // STEP 4: Generate comic panels (50% → 95%)
      setGenerationProgress(60);
      const comicResponse = await fetch('http://localhost:8000/api/art/generate-comic-panels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotion: emotionData.primary_emotion || 'neutral',
          narrative: narrativeData.response,
          character: selectedCharacter.id
        })
      });
      
      const comicData = await comicResponse.json();
      setGenerationProgress(85);
      
      // STEP 5: Finalize (85% → 100%)
      await new Promise(resolve => setTimeout(resolve, 500));
      setGenerationProgress(100);
      
      // Navigate to comic with real data
      setTimeout(() => {
        navigate('/comic', {
          state: {
            narrative: narrativeData.response,
            emotion: emotionData,
            panels: comicData.panels,
            character: selectedCharacter,
            storyText: storyText,
            sessionId: Date.now(),
            modelInfo: {
              ollama: "llama2",
              art: comicData.model_used
            }
          }
        });
      }, 500);
      
    } catch (error) {
      console.error('Error generating comic:', error);
      alert('Failed to generate comic. Please check if the backend API is running.');
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }
};
```

---

## 🔧 Backend Setup

### 1. Install Python Dependencies

```bash
cd apps/api
pip install -r requirements.txt
```

Required packages:
- `fastapi`
- `uvicorn`
- `ollama` (Python client)
- `pydantic`
- `python-multipart`

### 2. Start Ollama Service

```bash
# Install Ollama (if not installed)
curl https://ollama.ai/install.sh | sh

# Pull the model
ollama pull llama2

# Verify it's running
ollama list
```

### 3. Start Backend API

```bash
cd apps/api
npm run dev

# Or directly:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Test API

```bash
# Health check
curl http://localhost:8000/api/health

# Test Ollama
curl -X POST http://localhost:8000/api/ollama/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```

---

## 📊 API Flow Diagram

```
Frontend (Story.tsx)
      ↓
   [1] User types story
      ↓
   [2] Select character + consent
      ↓
   [3] Click "Generate Comic"
      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BACKEND API CALLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ↓
   [4] POST /api/ollama/generate
       → Ollama LLM generates narrative
       → Progress: 10% → 35%
      ↓
   [5] POST /api/narrative
       → Emotion classification
       → Progress: 35% → 50%
      ↓
   [6] POST /api/art/generate-comic-panels
       → Stable Diffusion generates 4 panels
       → Progress: 50% → 95%
      ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FRONTEND DISPLAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ↓
   [7] Progress: 95% → 100%
      ↓
   [8] Navigate to /comic with data
      ↓
   [9] Display 4-panel comic
```

---

## 🎨 Emotion → Art Style Mapping

Backend uses this mapping in `apps/api/app/routers/art.py`:

```python
EMOTION_PROMPTS = {
    "joy": "bright, vibrant, warm colors, sunlight, uplifting",
    "sadness": "cool blues, grays, rain, contemplative, gentle",
    "fear": "dark shadows, protective elements, storm clouds",
    "anger": "intense reds, sharp edges, fire elements",
    "trust": "open spaces, bridges, handshakes, warm light",
    "disgust": "barriers, separation, protective shields",
    "anticipation": "horizons, paths forward, dawn breaking",
    "surprise": "burst of light, unexpected elements, sparkles"
}
```

---

## 🔒 Security Considerations

1. **Rate Limiting**: Backend should limit requests per user
2. **Input Validation**: Sanitize user text input
3. **API Keys**: Store Ollama/Stable Diffusion keys in `.env`
4. **CORS**: Configure allowed origins
5. **Content Moderation**: Run `/api/policy/moderate` before Ollama

---

## 📝 Environment Variables

Create `apps/api/.env`:

```env
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2

# Art Generation
STABLE_DIFFUSION_API_KEY=your_key_here
STABLE_DIFFUSION_URL=http://localhost:7860

# Database
QDRANT_HOST=localhost
QDRANT_PORT=6333

# API Settings
API_PORT=8000
LOG_LEVEL=info
```

---

## ✅ Testing Checklist

- [ ] Backend API running on port 8000
- [ ] Ollama service running (`ollama list`)
- [ ] Test `/api/ollama/generate` endpoint
- [ ] Test `/api/narrative` endpoint
- [ ] Test `/api/art/generate-comic-panels` endpoint
- [ ] Frontend connects successfully
- [ ] Error handling works (API offline)
- [ ] Progress updates display correctly
- [ ] Comic data populates correctly

---

## 🎯 Quick Start (Full Stack)

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start Backend
cd apps/api
uvicorn app.main:app --reload --port 8000

# Terminal 3: Start Frontend
cd apps/web
npm run dev

# Open http://localhost:5173
```

---

**Status**: Backend code ready, frontend integration documented!  
**Next**: Install Python deps and start Ollama service for full integration.
