# Ollama Setup Guide for Shaheen App

## ⚠️ Current Status
Ollama is **not installed** on your system. You need to install it to test the full AI narrative generation.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Ollama

```bash
# Install Ollama (macOS)
curl -fsSL https://ollama.com/install.sh | sh

# Or download from: https://ollama.com/download
```

### Step 2: Verify Installation

```bash
# Check if Ollama is installed
ollama --version

# Should output something like: ollama version 0.1.x
```

### Step 3: Pull the Mistral Model

```bash
# Pull Mistral (recommended for Shaheen - good for bilingual Arabic/English)
ollama pull mistral

# This downloads ~4GB, takes 2-5 minutes depending on your connection
```

### Step 4: Start Ollama Server

```bash
# Start Ollama server (runs in background)
ollama serve

# Should output: "Ollama is running on http://localhost:11434"
```

### Step 5: Test the API Call

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "mistral",
  "prompt": "You are a compassionate Arabic-English bilingual writer creating supportive micro-narratives for Saudi youth mental health. Convert the following paragraph about how someone feels into a 4-sentence short story that gently acknowledges emotions, shows reflection, and ends with hope. Avoid clinical terms or judgment. Keep it culturally sensitive, relatable to Saudi teens, and suitable for educational use.\n\nInput:\nI feel overwhelmed with studies and my friends don't understand what I am going through.\n\nOutput:",
  "stream": false
}'
```

**Expected Response:**
```json
{
  "model": "mistral",
  "created_at": "2025-10-23T...",
  "response": "Ahmad sat at his desk, books piled high like mountains around him. He felt the weight of expectations pressing down, while his friends seemed to move through life effortlessly, unaware of his struggle. Taking a deep breath, he reminded himself that everyone's journey is different, and his feelings were valid. Tomorrow, he would try reaching out to someone he trusted, knowing that sharing his burden might lighten the load.",
  "done": true
}
```

---

## 🎯 Alternative: Test Without Installation

If you can't install Ollama right now, you can use OpenAI API or run in demo mode:

### Option 1: Use OpenAI API (Requires API Key)

```bash
# Set your OpenAI API key
export OPENAI_API_KEY="sk-your-key-here"

# Test with OpenAI
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "You are a compassionate Arabic-English bilingual writer for Saudi youth mental health."
      },
      {
        "role": "user",
        "content": "Create a 4-sentence supportive story for: I feel overwhelmed with studies and my friends don't understand."
      }
    ]
  }'
```

### Option 2: Demo Mode (Current)

The app currently runs in **demo mode** with simulated AI responses. The frontend shows:
- "Calling Ollama API..." (simulated)
- Progress indicators
- Pre-generated comic panels

This is perfect for **demonstration purposes** at the hackathon!

---

## 🔌 Integrating Ollama with Backend

Once Ollama is installed and running, update your backend:

### 1. Install Python Ollama Client

```bash
cd apps/api
pip install ollama
```

### 2. Update Backend Service

The file `apps/api/app/services/ollama_client.py` already has the integration code:

```python
import ollama

class OllamaClient:
    def __init__(self):
        self.client = ollama.Client(host='http://localhost:11434')
        self.model = 'mistral'
    
    async def generate_response(self, prompt: str, **kwargs):
        response = self.client.generate(
            model=self.model,
            prompt=prompt,
            **kwargs
        )
        return response['response']
```

### 3. Test Backend Integration

```bash
# Start backend
cd apps/api
uvicorn app.main:app --reload --port 8000

# Test endpoint
curl -X POST http://localhost:8000/api/ollama/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "I feel overwhelmed with studies",
    "system_prompt": "You are a compassionate mental health supporter for Saudi youth."
  }'
```

---

## 📊 Recommended Models for Shaheen

### Option 1: Mistral (Recommended) ⭐
```bash
ollama pull mistral
```
- **Size**: 4.1GB
- **Speed**: Fast
- **Quality**: Excellent for bilingual Arabic/English
- **Best for**: Production use

### Option 2: Llama2 (Alternative)
```bash
ollama pull llama2
```
- **Size**: 3.8GB
- **Speed**: Very fast
- **Quality**: Good
- **Best for**: Development/testing

### Option 3: Llama3 (Most Powerful)
```bash
ollama pull llama3
```
- **Size**: 4.7GB
- **Speed**: Moderate
- **Quality**: Excellent
- **Best for**: Best quality narratives

---

## 🎨 Example Output

With Ollama running, here's what you'd get:

**Input:**
```
I feel overwhelmed with studies and my friends don't understand what I am going through.
```

**Ollama Output (Mistral):**
```
في ليلة هادئة، جلس أحمد يتأمل في كتبه المفتوحة أمامه. The weight of expectations felt heavy on his shoulders, and it seemed like his friends moved through life without the same struggles. لكنه تذكر أن كل شخص يواجه تحدياته الخاصة، وأن مشاعره حقيقية ومهمة. Tomorrow would be a new day, and perhaps sharing his feelings with someone who cares could help lighten the burden he carried.
```

*(Mix of Arabic and English, culturally sensitive, hopeful ending)*

---

## ⚡ Quick Commands Reference

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull model
ollama pull mistral

# Start server
ollama serve

# List models
ollama list

# Test generation
ollama run mistral "Hello, how are you?"

# Stop server
pkill ollama
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused"
```bash
# Make sure Ollama server is running
ollama serve

# Check if running
curl http://localhost:11434/api/tags
```

### Issue: "Model not found"
```bash
# Pull the model first
ollama pull mistral

# Verify it's downloaded
ollama list
```

### Issue: "Slow generation"
- Mistral is faster than Llama3
- Close other applications
- Consider using GPU if available

---

## 🎯 For Hackathon Demo

### Without Ollama:
✅ App works in demo mode  
✅ Shows "Calling Ollama API"  
✅ Displays progress indicators  
✅ Uses pre-generated comics  
✅ Perfect for presentation!

### With Ollama:
✅ Real AI narrative generation  
✅ Dynamic stories based on user input  
✅ Live Arabic/English bilingual content  
✅ Impressive live demo!

---

## 📝 Next Steps

1. **For Hackathon (Quick)**: Keep demo mode, it works great!
2. **For Development (Later)**: Install Ollama and integrate
3. **For Production**: Use cloud-hosted Ollama or OpenAI API

---

**Decision**: Do you want to install Ollama now, or continue with demo mode for the hackathon?

- **Demo mode** = Works now, perfect for judging
- **Ollama setup** = 10-15 minutes, shows real AI

Choose based on your hackathon timeline! ⏰
