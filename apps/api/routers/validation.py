from fastapi import APIRouter, HTTPException, Query
from tower_kernel.services.diagnostic import DiagnosticService
import os

router = APIRouter(tags=["validation"])

from tower_kernel.services.lake_discovery import LakeDiscoveryService

@router.get("/validations/scorecard")
async def get_scorecard(filing_id: str = Query(..., description="The unique ID of the filing")):
    """
    Returns the high-level compliance scorecard for a given filing.
    """
    path = LakeDiscoveryService.resolve_filing_path(filing_id)
    if not path or not path.exists():
        raise HTTPException(status_code=404, detail=f"Filing {filing_id} parquet not found")
    
    try:
        results = DiagnosticService.get_compliance_scorecard(str(path))
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/validations/evidence")
async def get_rule_evidence(
    filing_id: str = Query(...), 
    rule_id: str = Query(...), 
    limit: int = 100
):
    """
    Returns specific records that violated a given rule.
    """
    path = LakeDiscoveryService.resolve_filing_path(filing_id)
    if not path or not path.exists():
        raise HTTPException(status_code=404, detail=f"Filing {filing_id} parquet not found")
    
    try:
        df = DiagnosticService.get_rule_evidence(str(path), rule_id, limit)
        if df is None:
            raise HTTPException(status_code=404, detail=f"Rule {rule_id} not found or no evidence")
        
        return df.to_dicts()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/validations/analyze")
async def analyze_failures(
    filing_id: str = Query(...), 
    rule_id: str = Query(...)
):
    """
    Invokes the AI Agent to analyze patterns in a failure set.
    """
    path = LakeDiscoveryService.resolve_filing_path(filing_id)
    if not path or not path.exists():
        raise HTTPException(status_code=404, detail=f"Filing {filing_id} parquet not found")
        
    try:
        results = DiagnosticService.analyze_failure_set_with_ai(str(path), rule_id)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
