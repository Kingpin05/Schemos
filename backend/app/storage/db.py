"""
Database connection setup.

Uses SQLite for the prototype (swap DATABASE_URL for Postgres later —
no other code needs to change since we use SQLAlchemy).
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Resolve the DB path relative to this file so it works regardless of cwd
_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_DEFAULT_DB = f"sqlite:///{os.path.join(_BACKEND_DIR, 'data', 'govrag.db')}"

DATABASE_URL = os.getenv("DATABASE_URL", _DEFAULT_DB)

# check_same_thread=False is needed only for SQLite + FastAPI's threaded requests
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a DB session and closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Call once at startup / from seed script."""
    from app.storage import models  # noqa: F401  (ensures models are registered)
    Base.metadata.create_all(bind=engine)