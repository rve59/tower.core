from fastapi import APIRouter, HTTPException, Query
from tower_kernel.services.diagnostic import DiagnosticService

router = APIRouter(tags=["audit"])

@router.post("/audit/analyze")
async def analyze_rule_failure(
    path: str = Query(...), 
    rule_id: str = Query(...)
):
    """
    Triggers targeted AI analysis for a specific failure set.
    Bridges to TOWER-S RegulatoryAuditorAgent.
    """
    try:
        analysis = DiagnosticService.analyze_failure_set_with_ai(path, rule_id)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
