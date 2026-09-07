import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.generation.llm_client import generate_explanation

profile = {"age": 42, "state": "Maharashtra", "occupation": "farmer"}
scheme = {
    "scheme_name": "Pradhan Mantri Kisan Samman Nidhi",
    "eligibility": "Small and marginal farmers with landholding",
    "benefits": "Rs 6000 per year in three installments",
    "application": "Apply via PM-Kisan portal",
    "documents": "Aadhaar card, land records",
}

print(generate_explanation(profile, scheme))