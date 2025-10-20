"""FastAPI application main module."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.settings import settings
from app.routers import health, narrative, metrics, art, policy, ollama, arabic_nlp

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Shaheen - Arabic emotional learning and wellbeing companion API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(narrative.router, prefix="/api/v1", tags=["narrative"])
app.include_router(metrics.router, prefix="/api/v1", tags=["metrics"])
app.include_router(art.router, prefix="/api/v1", tags=["art"])
app.include_router(policy.router, prefix="/api/v1", tags=["policy"])
app.include_router(ollama.router, prefix="/api/v1/ollama", tags=["ollama"])
app.include_router(arabic_nlp.router, prefix="/api/v1/arabic-nlp", tags=["arabic-nlp"])
# app.include_router(artst.router, prefix="/api/v1/artst", tags=["artst"])  # Temporarily disabled until dependencies installed


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Shaheen API",
        "version": settings.app_version,
        "status": "running",
        "disclaimer": "غير سريري — أداة للتعلم العاطفي فقط"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"ok": True}
