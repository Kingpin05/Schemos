# GovRAG Backend

Retrieval-Augmented Government Scheme Eligibility System — backend service.

## Structure
- `app/ingestion/` — scrapers & extractors for official government sources
- `app/processing/` — cleaning, chunking, metadata extraction
- `app/storage/` — structured DB models + vector store wrapper
- `app/eligibility/` — deterministic rule-based eligibility filtering
- `app/retrieval/` — embedding, semantic search, reranking
- `app/generation/` — LLM prompt templates + grounded response generation
- `app/api/routes/` — FastAPI endpoints
- `scripts/` — offline pipeline scripts (ingestion, DB seeding)
- `tests/` — unit tests

## Setup
```bash
pip install -r requirements.txt
cp .env.example .env
python scripts/seed_db.py
python scripts/run_ingestion.py
uvicorn app.main:app --reload
```
