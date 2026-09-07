"""
app/api/routes/health.py

Detailed health check — confirms server running, database scheme count, vector store status, and Gemini API key configuration.
"""

import os
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.storage.db import get_db
from app.storage.models import Scheme
from app.storage.vector_store import METADATA_PATH

router = APIRouter()


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    scheme_count = 0
    try:
        scheme_count = db.query(Scheme).count()
    except Exception as e:
        print(f"Error querying scheme count: {e}")

    vector_count = 0
    try:
        if os.path.exists(METADATA_PATH):
            with open(METADATA_PATH, "r", encoding="utf-8") as f:
                scheme_ids = json.load(f)
                vector_count = len(scheme_ids)
    except Exception as e:
        print(f"Error reading vector metadata: {e}")

    return {
        "status": "ok",
        "hasApiKey": bool(os.getenv("GEMINI_API_KEY")),
        "schemeCount": scheme_count,
        "indexedVectorsCount": vector_count,
        "version": "1.0.0",
    }