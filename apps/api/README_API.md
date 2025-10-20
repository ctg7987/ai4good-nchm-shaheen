# Shaheen API

## تنبيه مهم - إخلاء المسؤولية الطبية

**غير سريري — أداة للتعلم العاطفي فقط**

هذا التطبيق مصمم للتعلم العاطفي والوعي الذاتي فقط. لا يقدم تشخيصاً أو علاجاً طبياً. إذا كنت تعاني من مشاكل نفسية خطيرة، يرجى التوجه إلى متخصص في الصحة النفسية.

## Important Disclaimer - Non-Clinical Tool

**Non-clinical — Emotional learning tool only**

This application is designed for emotional learning and self-awareness only. It does not provide medical diagnosis or treatment. If you are experiencing serious mental health issues, please consult a mental health professional.

---

## Quick Start

### Prerequisites

- Python 3.11+
- pip

### Installation

1. Create virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -e .
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your API keys
```

### Running the API

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Health
- `GET /health` - Basic health check
- `GET /health` - Detailed health information

### Narrative
- `POST /api/v1/story` - Generate therapeutic story
- `GET /api/v1/story/{story_id}` - Get specific story

### Metrics
- `POST /api/v1/metrics` - Collect anonymous metrics
- `GET /api/v1/metrics/summary` - Get metrics summary

### Art
- `POST /api/v1/generate` - Generate art (stub)
- `GET /api/v1/styles` - Get available art styles

### Policy
- `POST /api/v1/content/check` - Check content for violations
- `GET /api/v1/content/guidelines` - Get content guidelines

## Testing

```bash
pytest
```

## Development

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run linting
ruff check .
black --check .
isort --check-only .

# Run type checking
mypy .
```

## Environment Variables

- `ALLOW_TELEMETRY` - Enable/disable telemetry (default: false)
- `QDRANT_URL` - Vector database URL
- `OPENAI_API_KEY` - OpenAI API key
- `REPLICATE_API_TOKEN` - Replicate API token

## Architecture

- **FastAPI** - Web framework
- **Pydantic** - Data validation
- **Qdrant** - Vector database for embeddings
- **OpenAI** - Language model integration
- **Replicate** - AI model hosting
