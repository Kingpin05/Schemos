"""
app/generation/prompt_templates.py

Defines the instructions we send to Gemini to generate a grounded,
citation-backed explanation of a scheme.
"""

SYSTEM_PROMPT = """You are a government scheme assistant. You must ONLY use
the information provided in the scheme data below. Do not invent facts,
figures, or benefits that are not explicitly present. If information is
missing, say so clearly instead of guessing. Always mention that the user
should verify details on the official source before applying."""


def build_scheme_prompt(user_profile: dict, scheme: dict) -> str:
    return f"""
User profile:
{user_profile}

Scheme data (from official records):
Name: {scheme.get('scheme_name')}
Eligibility: {scheme.get('eligibility')}
Benefits: {scheme.get('benefits')}
Application process: {scheme.get('application')}
Required documents: {scheme.get('documents')}

Task: Write a short, friendly explanation (3-5 sentences) of why this
scheme may be relevant to this user, what they'd receive, and how to
apply. Only use facts given above.
"""