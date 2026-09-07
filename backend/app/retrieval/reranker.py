"""
app/retrieval/reranker.py

Combines two signals into one final ranked list:
  1. Rule-based eligibility status (from rules_engine.py) — is it likely/possible/not_eligible?
  2. Semantic similarity score (from vector_store.py) — how close in meaning?

Think of it as a traffic controller: it takes opinions from both the
engine (rules) and the GPS (search), and decides the final order to
show results to the driver.
"""

from dataclasses import dataclass
from typing import List

from app.eligibility.rules_engine import EligibilityResult
from app.schemas.response import EligibilityStatus

# Rule status contributes a base score — "likely" ranks higher than "possible",
# and "not_eligible" schemes get filtered out entirely before reranking.
STATUS_WEIGHT = {
    EligibilityStatus.confirmed: 1.0,
    EligibilityStatus.likely: 0.7,
    EligibilityStatus.possible: 0.4,
    EligibilityStatus.not_eligible: 0.0,
}

# How much each signal matters in the final score
RULE_WEIGHT = 0.5
SIMILARITY_WEIGHT = 0.5


@dataclass
class RankedResult:
    eligibility_result: EligibilityResult
    similarity_score: float
    final_score: float


def rerank(
    eligibility_results: List[EligibilityResult],
    similarity_scores: dict,  # {scheme_id: similarity_score}
    top_k: int = 10,
) -> List[RankedResult]:
    """
    Combines rule status + similarity score into one final ranking.
    Schemes marked 'not_eligible' are dropped entirely.
    Schemes with no similarity score (not found by search) get 0 for that part.
    """
    ranked = []

    for result in eligibility_results:
        if result.status == EligibilityStatus.not_eligible:
            continue  # hard filter — never show these

        sim_score = similarity_scores.get(result.scheme.id, 0.0)
        rule_score = STATUS_WEIGHT[result.status]

        final_score = (RULE_WEIGHT * rule_score) + (SIMILARITY_WEIGHT * sim_score)

        ranked.append(
            RankedResult(
                eligibility_result=result,
                similarity_score=sim_score,
                final_score=final_score,
            )
        )

    ranked.sort(key=lambda r: r.final_score, reverse=True)
    return ranked[:top_k]