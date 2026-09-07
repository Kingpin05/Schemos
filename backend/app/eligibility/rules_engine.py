"""
app/eligibility/rules_engine.py

Deterministic eligibility filtering — checks a user's profile against
each scheme's eligibility text and gives a status: likely / possible /
not_eligible. Never says "confirmed" for free-text matching, since we
can't be 100% certain without a human/LLM reading it carefully.
"""

from dataclasses import dataclass
from typing import List, Optional

from app.schemas.user_profile import UserProfile
from app.schemas.response import EligibilityStatus
from app.storage.models import Scheme


@dataclass
class EligibilityResult:
    scheme: Scheme
    status: EligibilityStatus
    reason: str
    missing_info: Optional[List[str]] = None


def keyword_match_eligibility(profile: UserProfile, scheme: Scheme) -> EligibilityResult:
    text = (scheme.eligibility or "").lower()
    if not text:
        return EligibilityResult(
            scheme=scheme,
            status=EligibilityStatus.possible,
            reason="No eligibility text available for this scheme; cannot verify.",
            missing_info=["eligibility_criteria"],
        )

    matched_signals = []
    missing = []

    if profile.occupation:
        if profile.occupation.lower() in text:
            matched_signals.append(f"occupation '{profile.occupation}'")
    else:
        missing.append("occupation")

    if profile.state:
        if profile.state.lower() in text:
            matched_signals.append(f"state '{profile.state}'")
        elif scheme.level and scheme.level.lower() == "state":
            return EligibilityResult(
                scheme=scheme,
                status=EligibilityStatus.not_eligible,
                reason=f"This is a state-level scheme; eligibility text does not mention '{profile.state}'.",
            )

    if profile.category:
        if profile.category.value.lower() in text:
            matched_signals.append(f"category '{profile.category.value}'")

    if profile.age is not None:
        age_mentioned = any(str(n) in text for n in range(profile.age - 1, profile.age + 2))
        if age_mentioned:
            matched_signals.append(f"age {profile.age}")

    if matched_signals:
        status = EligibilityStatus.likely
        reason = "Eligibility text mentions: " + ", ".join(matched_signals) + "."
    else:
        status = EligibilityStatus.possible
        reason = "No strong keyword overlap found; eligibility unclear from available text."

    return EligibilityResult(
        scheme=scheme,
        status=status,
        reason=reason,
        missing_info=missing or None,
    )


def filter_schemes(profile: UserProfile, schemes: List[Scheme]) -> List[EligibilityResult]:
    return [keyword_match_eligibility(profile, scheme) for scheme in schemes]