"""
tests/test_pipeline.py

End-to-end smoke test: combines rules_engine + vector_store + reranker
to produce a final ranked list of schemes for a sample user profile.

Fix: both rules_engine and vector_store now check the SAME candidate
schemes (the ones semantic search found), instead of two different sets.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.storage.db import SessionLocal
from app.storage.models import Scheme
from app.schemas.user_profile import UserProfile, Category
from app.eligibility.rules_engine import filter_schemes
from app.storage.vector_store import search
from app.retrieval.reranker import rerank


def run():
    db = SessionLocal()
    profile = UserProfile(
        age=42, state="Maharashtra", occupation="farmer", category=Category.obc
    )

    # Step 1: semantic search finds the most relevant candidates FIRST
    query_text = "farmer small landholding financial support Maharashtra"
    sim_results = search(query_text, top_k=50)
    similarity_scores = dict(sim_results)
    candidate_ids = [scheme_id for scheme_id, _ in sim_results]

    # Step 2: only run rule-checking on THOSE SAME candidates
    candidate_schemes = db.query(Scheme).filter(Scheme.id.in_(candidate_ids)).all()
    eligibility_results = filter_schemes(profile, candidate_schemes)

    # Step 3: rerank using both signals on the same candidate pool
    final = rerank(eligibility_results, similarity_scores, top_k=5)

    print(f"\nTop {len(final)} recommended schemes:\n")
    for r in final:
        print(
            f"{round(r.final_score, 3)} - {r.eligibility_result.scheme.scheme_name} "
            f"(status: {r.eligibility_result.status.value})"
        )


if __name__ == "__main__":
    run()