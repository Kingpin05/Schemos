"""
User profile schema — defines what a user submits to /query.

Fields chosen to match:
  - eligibility CSV (Age, Annual_Income_INR, State, Category)
  - free-text eligibility rules found in updated_data.csv (occupation,
    landholding, gender, district etc. appear across scheme eligibility text)
"""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


class Category(str, Enum):
    general = "General"
    obc = "OBC"
    sc = "SC"
    st = "ST"
    ews = "EWS"


class UserProfile(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Age in years")
    state: str = Field(..., description="State or UT of residence, e.g. 'Karnataka'")
    district: Optional[str] = Field(None, description="District of residence")

    occupation: Optional[str] = Field(
        None, description="e.g. 'farmer', 'student', 'fisherman', 'self-employed'"
    )
    annual_income_inr: Optional[int] = Field(
        None, ge=0, description="Annual household income in INR"
    )
    landholding_acres: Optional[float] = Field(
        None, ge=0, description="Landholding size in acres, if applicable"
    )

    gender: Optional[Gender] = None
    category: Optional[Category] = Field(
        None, description="Social category — General/OBC/SC/ST/EWS"
    )

    additional_info: Optional[str] = Field(
        None, description="Any other eligibility-relevant details in free text"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "age": 42,
                "state": "Karnataka",
                "district": "Dharwad",
                "occupation": "farmer",
                "annual_income_inr": 250000,
                "landholding_acres": 1.5,
                "gender": "male",
                "category": "OBC",
            }
        }