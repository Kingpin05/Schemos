"""
Response schema — defines what /query returns.

Field names mirror columns in updated_data.csv (scheme_name, details,
benefits, eligibility, application, documents, level, schemeCategory,
tags) so DB rows can be mapped to this schema with minimal glue code.
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class EligibilityStatus(str, Enum):
    confirmed = "confirmed"
    likely = "likely"
    possible = "possible"
    not_eligible = "not_eligible"


class SchemeLevel(str, Enum):
    central = "Central"
    state = "State"


class Citation(BaseModel):
    source_title: str = Field(..., description="Title of the source document/page")
    source_url: str = Field(..., description="Official government URL")


class RecommendedScheme(BaseModel):
    scheme_name: str
    slug: Optional[str] = None
    level: Optional[SchemeLevel] = None
    scheme_category: Optional[str] = None
    tags: Optional[List[str]] = None

    eligibility_status: EligibilityStatus
    eligibility_reason: str = Field(
        ..., description="Plain-language explanation of why this scheme was matched"
    )
    missing_info: Optional[List[str]] = Field(
        None, description="Fields needed to fully confirm eligibility, if any"
    )

    summary: str = Field(..., description="Short LLM-generated summary of the scheme")
    benefits: Optional[str] = None
    required_documents: Optional[List[str]] = None
    application_procedure: Optional[str] = None

    citations: List[Citation] = Field(default_factory=list)
    relevance_score: Optional[float] = Field(
        None, description="Final reranked score (0-1)"
    )


class QueryResponse(BaseModel):
    query_id: str
    recommended_schemes: List[RecommendedScheme]
    disclaimer: str = (
        "Final eligibility is determined by the concerned government authority. "
        "Please verify details on the official scheme page before applying."
    )