"""
app/generation/llm_client.py

The "voice" of the system — turns raw scheme data into friendly,
grounded explanations using Google Gemini (google-genai SDK).
Falls back safely to deterministic synthesis if no API key is set or the call fails.
"""

import os
import json
from dotenv import load_dotenv

from app.generation.prompt_templates import build_scheme_prompt, SYSTEM_PROMPT

# Load .env from backend/ directory (where GEMINI_API_KEY lives) — works from any cwd
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(_BACKEND_DIR, ".env"))
# Also try the repo root .env
load_dotenv(os.path.join(os.path.dirname(_BACKEND_DIR), ".env"), override=False)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

_client = None


def _get_client():
    global _client
    if _client is None:
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            return None
        from google import genai
        _client = genai.Client(api_key=key)
    return _client


def generate_explanation(user_profile: dict, scheme: dict) -> str:
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        return _fallback_explanation(scheme)

    try:
        client = _get_client()
        if not client:
            return _fallback_explanation(scheme)
        prompt = build_scheme_prompt(user_profile, scheme)
        full_prompt = SYSTEM_PROMPT + "\n\n" + prompt

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=full_prompt,
        )
        return response.text.strip() if response.text else _fallback_explanation(scheme)
    except Exception as e:
        print(f"Gemini call failed ({e}), using fallback explanation.")
        return _fallback_explanation(scheme)


def generate_batch_grounded_explanations(
    user_profile: dict,
    query_text: str,
    schemes: list
) -> tuple[str, dict, bool]:
    """
    Evaluates up to 5 top candidate schemes simultaneously in a single prompt.
    Returns:
      (global_summary: str, explanations_by_id: dict, ai_grounded: bool)
    """
    key = os.getenv("GEMINI_API_KEY")
    if not key or not schemes:
        return _build_fallback_batch(user_profile, schemes)

    try:
        client = _get_client()
        if not client:
            return _build_fallback_batch(user_profile, schemes)

        context_items = []
        for idx, s in enumerate(schemes[:5]):
            context_items.append(
                f"SCHEME {idx+1} [ID: {s.get('id')}]:\n"
                f"Name: {s.get('scheme_name')}\n"
                f"Category: {s.get('scheme_category')}\n"
                f"Level/State: {s.get('level')}\n"
                f"Eligibility: {s.get('eligibility')}\n"
                f"Benefits: {s.get('benefits')}\n"
                f"Documents: {s.get('documents')}\n"
                f"Application: {s.get('application')}\n"
            )
        rag_context = "\n---\n".join(context_items)

        prompt = f"""You are the GovRAG Grounded Public Welfare Advisor (Government Scheme Eligibility Assistant).
Analyze the citizen's profile and provide source-grounded advice based STRICTLY on the retrieved official scheme details.

Citizen Profile:
- Age: {user_profile.get('age')}
- State: {user_profile.get('state')}
- District: {user_profile.get('district', 'Not specified')}
- Occupation: {user_profile.get('occupation')}
- Annual Income: INR {user_profile.get('annual_income_inr') or user_profile.get('annual_income') or 'Not specified'}
- Landholding: {user_profile.get('landholding_acres', 0)} acres
- Category: {user_profile.get('category')}
- Specific Citizen Goal: {query_text or 'Identify relevant welfare schemes'}

RETRIEVED OFFICIAL SCHEMES:
{rag_context}

MANDATORY RULES:
1. Grounding: Use ONLY information supported by the retrieved government scheme records.
2. Missing Info: If any documentation or proof is needed, explicitly state what is missing.
3. Keep the tone helpful, clear, and easy to understand.

Return your response in valid JSON with this exact schema:
{{
  "summary": "2-3 concise sentences summarizing citizen eligibility across these schemes",
  "schemeExplanations": [
    {{
      "schemeId": "id-string-from-SCHEME-header",
      "verdict": "Confirmed Eligible | Likely Eligible | Conditionally Eligible",
      "whyEligible": "Clear explanation referencing profile vs criteria",
      "benefitHighlights": "Exact benefits",
      "actionableSteps": "How to apply",
      "missingDocs": "Any required documents or notes"
    }}
  ]
}}
"""
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )

        raw_text = response.text.strip() if response.text else ""
        if raw_text:
            # Strip potential markdown code block markers
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

            parsed = json.loads(raw_text)
            summary = parsed.get("summary", "")
            explanations = {}
            for item in parsed.get("schemeExplanations", []):
                sid = str(item.get("schemeId", ""))
                explanations[sid] = {
                    "verdict": item.get("verdict", "Likely Eligible"),
                    "explanation": f"{item.get('whyEligible', '')} {item.get('benefitHighlights', '')}".strip(),
                    "missingDocs": item.get("missingDocs", ""),
                    "actionableSteps": item.get("actionableSteps", ""),
                }
            return summary, explanations, True

    except Exception as e:
        print(f"Batch Gemini generation error: {e}, reverting to rule-based fallback.")

    return _build_fallback_batch(user_profile, schemes)


def _build_fallback_batch(user_profile: dict, schemes: list) -> tuple[str, dict, bool]:
    age = user_profile.get("age", "")
    occ = user_profile.get("occupation", "citizen")
    state = user_profile.get("state", "India")
    summary = (
        f"Evaluated authoritative government schemes against demographic constraints "
        f"(Age {age}, {occ} in {state}). Identified top eligible and matching welfare schemes "
        f"based on official central and state guidelines."
    )
    explanations = {}
    for s in schemes:
        sid = str(s.get("id"))
        explanations[sid] = {
            "verdict": "Likely Eligible",
            "explanation": _fallback_explanation(s),
            "missingDocs": "Verify official identity and income records at your local Panchayat or CSC center.",
            "actionableSteps": s.get("application") or "Apply online on the official portal.",
        }
    return summary, explanations, False


def _fallback_explanation(scheme: dict) -> str:
    name = scheme.get("scheme_name", "This scheme")
    benefits = scheme.get("benefits") or "Benefit details are not available."
    application = scheme.get("application") or "Application process details are not available."
    documents = scheme.get("documents") or "Document requirements are not listed."

    return (
        f"{name} provides valuable welfare assistance. "
        f"Benefits: {benefits[:180]}... "
        f"To apply: {application[:150]}... "
        f"Documents typically required: {documents[:120]}... "
        f"Please verify these details on the official government portal before applying."
    )