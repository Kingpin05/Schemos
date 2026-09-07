"""
app/main.py

The main entrypoint — this is what actually starts the FastAPI server.
Run with: uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import query, health, schemes
from app.storage.db import init_db

app = FastAPI(title="GovRAG API", description="Retrieval-Augmented Government Scheme Eligibility System")

# Enable CORS for all origins so React / Vite frontend can communicate freely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables on startup if they don't exist yet
init_db()

# Mount routes under /api prefix for API client consistency
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(schemes.router, prefix="/api", tags=["Schemes"])
app.include_router(query.router, prefix="/api", tags=["Query"])

# Also mount on root for direct access convenience
app.include_router(health.router, tags=["Health"])
app.include_router(schemes.router, tags=["Schemes"])
app.include_router(query.router, tags=["Query"])