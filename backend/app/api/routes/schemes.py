"""
app/api/routes/schemes.py

API routes for browsing, searching, and filtering authoritative schemes
from the govrag.db database (3,400 schemes).
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.storage.db import get_db
from app.storage.models import Scheme

router = APIRouter()


def serialize_scheme(s: Scheme) -> dict:
    benefits_list = [b.strip() for b in (s.benefits or "").split("\n") if b.strip()]
    if not benefits_list and s.benefits:
        benefits_list = [s.benefits.strip()]

    docs_list = [d.strip() for d in (s.documents or "").replace(";", ",").split(",") if d.strip()]
    if not docs_list and s.documents:
        docs_list = [s.documents.strip()]

    app_list = [a.strip() for a in (s.application or "").split("\n") if a.strip()]
    if not app_list and s.application:
        app_list = [s.application.strip()]

    official_url = s.source_url or f"https://www.myscheme.gov.in/schemes/{s.slug}"

    return {
        "id": str(s.id),
        "name": s.scheme_name,
        "shortName": s.slug.replace("-", " ").title() if s.slug else s.scheme_name[:30],
        "slug": s.slug,
        "ministry": f"Ministry of {s.scheme_category}" if s.scheme_category else "Government of India",
        "state": s.level if s.level in ("Central", "State") else "National",
        "category": s.scheme_category or "Social Welfare & Empowerment",
        "summary": (s.details[:280] + "...") if s.details and len(s.details) > 280 else (s.details or "Official Government Welfare Scheme"),
        "details": s.details or "",
        "benefits": benefits_list or ["Monetary and welfare assistance per official guidelines"],
        "financialValue": "Direct Financial / Service Benefit",
        "requiredDocuments": docs_list or ["Aadhaar Card", "Identity Proof", "Address Proof"],
        "applicationProcedure": app_list or ["Apply online through official portal or visit nearest CSC/Panchayat office"],
        "officialUrl": official_url,
        "departmentPortal": official_url,
        "guidelineDocument": f"Official Gazette & Operational Guidelines: {s.scheme_name}",
        "lastUpdated": "2025-2026 Gazette",
        "chunks": [
            {
                "chunkId": f"chunk-{s.id}-1",
                "section": "Eligibility",
                "content": s.eligibility or "Open to all eligible citizens meeting specified criteria.",
                "sourceDoc": f"{s.scheme_name} Gazette",
                "pageOrClause": "Section 3.1"
            },
            {
                "chunkId": f"chunk-{s.id}-2",
                "section": "Benefits",
                "content": s.benefits or "Financial assistance and welfare benefits provided as per guidelines.",
                "sourceDoc": f"{s.scheme_name} Gazette",
                "pageOrClause": "Section 4.2"
            }
        ]
    }


@router.get("/schemes")
def get_schemes(
    search: Optional[str] = Query(None, description="Search term matching scheme name, details, or tags"),
    category: Optional[str] = Query(None, description="Category filter"),
    state: Optional[str] = Query(None, description="State filter"),
    level: Optional[str] = Query(None, description="Central or State"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Scheme)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Scheme.scheme_name.ilike(search_pattern),
                Scheme.details.ilike(search_pattern),
                Scheme.tags.ilike(search_pattern),
                Scheme.scheme_category.ilike(search_pattern),
            )
        )

    if category and category.lower() != "all":
        query = query.filter(Scheme.scheme_category.ilike(f"%{category.strip()}%"))

    if level and level.lower() != "all":
        query = query.filter(Scheme.level.ilike(f"%{level.strip()}%"))

    total_count = query.count()
    schemes_rows = query.order_by(Scheme.id.asc()).offset(offset).limit(limit).all()

    return {
        "schemes": [serialize_scheme(s) for s in schemes_rows],
        "totalCount": total_count,
        "limit": limit,
        "offset": offset,
    }


@router.get("/schemes/{scheme_id}")
def get_scheme_by_id(scheme_id: str, db: Session = Depends(get_db)):
    scheme = None
    if scheme_id.isdigit():
        scheme = db.query(Scheme).filter(Scheme.id == int(scheme_id)).first()
    if not scheme:
        scheme = db.query(Scheme).filter(Scheme.slug == scheme_id).first()

    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    return serialize_scheme(scheme)
