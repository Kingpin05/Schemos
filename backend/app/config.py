"""
Central configuration: env vars, paths, model names, DB URLs.
Replace values via a .env file (see .env.example).
"""
import os

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/govrag.db")

# Vector store
VECTOR_INDEX_PATH = os.getenv("VECTOR_INDEX_PATH", "./data/vector_index")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")

# LLM
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME", "gpt-4o-mini")

# Retrieval
TOP_K_RETRIEVAL = int(os.getenv("TOP_K_RETRIEVAL", "20"))
TOP_N_RERANKED = int(os.getenv("TOP_N_RERANKED", "5"))
