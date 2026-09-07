"""
Seeds the structured DB from the raw CSV datasets.

Run from the govrag-backend/ root:
    python scripts/seed_db.py
"""

import re
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.storage.db import SessionLocal, init_db
from app.storage.models import Scheme, EligibilityTestCase

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"
SCHEMES_CSV = DATA_DIR / "schemes.csv"
ELIGIBILITY_CSV = DATA_DIR / "eligibility_test_cases.csv"


def make_slug(name: str, fallback_slug: str = "") -> str:
    if fallback_slug and isinstance(fallback_slug, str) and fallback_slug.strip():
        return fallback_slug.strip()
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "scheme"


def seed_schemes(db):
    print(f"Reading {SCHEMES_CSV} ...")
    df = pd.read_csv(SCHEMES_CSV)
    df = df.loc[:, ~df.columns.str.startswith("Unnamed")]

    inserted, skipped = 0, 0
    seen_slugs = set()

    for _, row in df.iterrows():
        name = str(row.get("scheme_name", "")).strip()
        if not name or name.lower() == "nan":
            skipped += 1
            continue

        slug = make_slug(name, str(row.get("slug", "")))
        base_slug, n = slug, 1
        while slug in seen_slugs:
            n += 1
            slug = f"{base_slug}-{n}"
        seen_slugs.add(slug)

        scheme = Scheme(
            scheme_name=name,
            slug=slug,
            details=_clean(row.get("details")),
            benefits=_clean(row.get("benefits")),
            eligibility=_clean(row.get("eligibility")),
            application=_clean(row.get("application")),
            documents=_clean(row.get("documents")),
            level=_clean(row.get("level")),
            scheme_category=_clean(row.get("schemeCategory")),
            tags=_clean(row.get("tags")),
        )
        db.add(scheme)
        inserted += 1

    db.commit()
    print(f"Schemes: inserted {inserted}, skipped {skipped} (missing name)")


def seed_eligibility_test_cases(db):
    print(f"Reading {ELIGIBILITY_CSV} ...")
    df = pd.read_csv(ELIGIBILITY_CSV)

    inserted = 0
    for _, row in df.iterrows():
        case = EligibilityTestCase(
            age=int(row["Age"]),
            annual_income_inr=int(row["Annual_Income_INR"]),
            state=str(row["State"]),
            category=str(row["Category"]),
            eligible_scheme=str(row["Eligible_Scheme"]),
        )
        db.add(case)
        inserted += 1

    db.commit()
    print(f"Eligibility test cases: inserted {inserted}")


def _clean(value):
    if pd.isna(value):
        return None
    return str(value).strip()


def main():
    print("Initializing DB (creating tables if needed)...")
    init_db()

    db = SessionLocal()
    try:
        seed_schemes(db)
        seed_eligibility_test_cases(db)
    finally:
        db.close()

    print("Done.")


if __name__ == "__main__":
    main()