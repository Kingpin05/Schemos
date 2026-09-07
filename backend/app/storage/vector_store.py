"""
app/storage/vector_store.py

Stores scheme embeddings and lets us search "which schemes are closest
in meaning" to a given query. Think of it as a map memory — once schemes
are placed on the map, we can find the nearest ones instantly.

Uses FAISS (a fast similarity search library). The index is saved to disk
so we don't have to re-embed everything every time we start the app.
"""

import json
import os
import numpy as np
import faiss

from app.retrieval.embedder import embed_texts

# Resolve paths relative to this file so they work regardless of cwd
# (e.g. started from root or from backend/)
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VECTOR_DIR = os.path.join(_BACKEND_DIR, "data", "vector_index")
INDEX_PATH = os.path.join(VECTOR_DIR, "schemes.index")
METADATA_PATH = os.path.join(VECTOR_DIR, "schemes_meta.json")

EMBEDDING_DIM = 384  # matches all-MiniLM-L6-v2 output size


def build_index(scheme_ids: list[int], texts: list[str]):
    """
    Builds a fresh vector index from scratch.
    scheme_ids: list of DB ids (so we know which scheme each vector belongs to)
    texts: the text to embed for each scheme (e.g. eligibility + details)
    """
    os.makedirs(VECTOR_DIR, exist_ok=True)

    print(f"Embedding {len(texts)} schemes...")
    vectors = embed_texts(texts)
    vectors = np.array(vectors, dtype="float32")

    index = faiss.IndexFlatIP(EMBEDDING_DIM)  # IP = inner product (works well with normalized vectors)
    index.add(vectors)

    faiss.write_index(index, INDEX_PATH)
    with open(METADATA_PATH, "w") as f:
        json.dump(scheme_ids, f)

    print(f"Saved index with {index.ntotal} vectors to {INDEX_PATH}")


def load_index():
    """Loads the saved index + metadata from disk."""
    if not os.path.exists(INDEX_PATH):
        raise FileNotFoundError(
            f"No index found at {INDEX_PATH}. Run the build step first."
        )
    index = faiss.read_index(INDEX_PATH)
    with open(METADATA_PATH) as f:
        scheme_ids = json.load(f)
    return index, scheme_ids


def search(query_text: str, top_k: int = 5):
    """
    Finds the top_k schemes closest in meaning to the query text.
    Returns a list of (scheme_id, similarity_score) tuples.
    """
    index, scheme_ids = load_index()
    query_vector = np.array(embed_texts([query_text]), dtype="float32")

    scores, indices = index.search(query_vector, top_k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx == -1:
            continue
        results.append((scheme_ids[idx], float(score)))
    return results