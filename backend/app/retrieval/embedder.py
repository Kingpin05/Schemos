"""
app/retrieval/embedder.py

Converts text into embeddings (number representations of meaning).
This is the "sensor" that lets the system understand meaning instead of
just matching exact keywords.

We use a small, fast, well-tested model (all-MiniLM-L6-v2) — good enough
for a prototype, easy to swap later for a bigger model.
"""

from sentence_transformers import SentenceTransformer

_model = None  # loaded once, reused (loading is slow, embedding is fast)


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        print("Loading embedding model (first time only, may take a moment)...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def embed_text(text: str):
    """Turns a single string into a vector (list of numbers)."""
    model = get_model()
    return model.encode(text, normalize_embeddings=True).tolist()


def embed_texts(texts: list[str]):
    """Turns a list of strings into a list of vectors — faster in batch."""
    model = get_model()
    return model.encode(texts, normalize_embeddings=True).tolist()