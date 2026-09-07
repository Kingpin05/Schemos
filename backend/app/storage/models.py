"""
Structured DB models.

Scheme columns mirror updated_data.csv exactly:
  scheme_name, slug, details, benefits, eligibility, application,
  documents, level, schemeCategory, tags

EligibilityTestCase mirrors Indian_Government_Scheme_Eligibility_Dataset.csv
— kept as a separate table since it's a different, synthetic dataset used
for testing the rules engine, not real scheme content.
"""

from sqlalchemy import Column, Integer, String, Text, Float
from app.storage.db import Base


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    scheme_name = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)

    details = Column(Text)               # long description -> gets chunked/embedded
    benefits = Column(Text)
    eligibility = Column(Text)           # free-text eligibility rules -> embedded
    application = Column(Text)           # application steps
    documents = Column(Text)             # required documents (raw text, comma/period separated)

    level = Column(String)               # "Central" or "State"
    scheme_category = Column(String)     # e.g. "Agriculture,Rural & Environment"
    tags = Column(String)                # comma-separated tags

    source_url = Column(String, nullable=True)  # official source, if available


class EligibilityTestCase(Base):
    """Synthetic rows for validating the deterministic rules engine."""
    __tablename__ = "eligibility_test_cases"

    id = Column(Integer, primary_key=True, autoincrement=True)
    age = Column(Integer)
    annual_income_inr = Column(Integer)
    state = Column(String)
    category = Column(String)
    eligible_scheme = Column(String)     # ground-truth label