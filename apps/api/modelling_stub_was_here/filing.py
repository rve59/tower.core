"""
Pydantic models generated from LSL MODEL declarations.

MODEL filings.items Filing  ← structured record
MODEL kpi.*                 ← derived (no model class — Zustand selectors)
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Literal, List, Optional


class Filing(BaseModel):
    """MODEL filings.items Filing"""
    id: str
    entity: str
    period: str
    status: Literal["pending", "pass", "fail"]
    filed_at: datetime
    has_errors: bool


class FilingError(BaseModel):
    rule: str
    severity: Literal["error", "warning"]
    message: str
    location: Optional[str] = None


class Entity(BaseModel):
    id: str
    name: str


class SystemInfo(BaseModel):
    """MODEL system.arelleVersion str"""
    version: str
