"""GET /v1/filings/items — @filings.items binding"""

from fastapi import APIRouter
from datetime import datetime, timezone
from ..models.filing import Filing

router = APIRouter(tags=["filings"])

# TODO: replace stub data with Polars parquet query from settings.parquet_data_dir
_STUB_FILINGS = [
    Filing(id="FIL-001", entity="Pacific Gas & Electric", period="2024Q3",
           status="pass", filed_at=datetime(2024, 10, 15, tzinfo=timezone.utc), has_errors=False),
    Filing(id="FIL-002", entity="Duke Energy",            period="2024Q3",
           status="fail", filed_at=datetime(2024, 10, 14, tzinfo=timezone.utc), has_errors=True),
    Filing(id="FIL-003", entity="NextEra Energy",         period="2024Q3",
           status="pending", filed_at=datetime(2024, 10, 16, tzinfo=timezone.utc), has_errors=False),
    Filing(id="FIL-004", entity="Dominion Energy",        period="2024Q2",
           status="pass", filed_at=datetime(2024, 7, 12, tzinfo=timezone.utc), has_errors=False),
    Filing(id="FIL-005", entity="Southern Company",       period="2024Q2",
           status="fail", filed_at=datetime(2024, 7, 10, tzinfo=timezone.utc), has_errors=True),
]


@router.get("/filings/items", response_model=list[Filing])
async def get_filings_items():
    """@filings.items — returns all Filing records."""
    return _STUB_FILINGS
