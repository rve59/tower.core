from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from tower_kernel.services.diagnostic import DiagnosticService
from tower_kernel.rules.transpiler import CypherTranspiler
from lib_ldbg_tower_bridge.bridge import LadybugTowerBridge
import os
import polars as pl

router = APIRouter(tags=["validation"])

# Simple in-memory cache to track which filings have been "warmed up" in LadybugDB
INITIALIZED_FILINGS = set()

from tower_kernel.services.lake_discovery import LakeDiscoveryService

@router.get("/validations/scorecard")
async def get_scorecard(
    filing_id: str = Query(..., description="The unique ID of the filing"),
    rule_types: Optional[str] = Query(None, description="Comma-separated list of RuleType values")
):
    """
    Returns the high-level compliance scorecard for a given filing.
    """
    path = LakeDiscoveryService.resolve_filing_path(filing_id)
    if not path or not path.exists():
        raise HTTPException(status_code=404, detail=f"Filing {filing_id} parquet not found")
    
    try:
        types_list = rule_types.split(",") if rule_types else None
        results = DiagnosticService.get_compliance_scorecard(str(path), rule_types=types_list)
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
@router.get("/validations/brief")
async def get_audit_brief(
    filing_id: str = Query(...), 
    rule_id: str = Query(...)
):
    """
    Returns the persisted forensic audit brief (Markdown) for a given rule.
    """
    path = LakeDiscoveryService.resolve_filing_path(filing_id)
    if not path or not path.exists():
        raise HTTPException(status_code=404, detail=f"Filing {filing_id} parquet not found")
        
    try:
        brief = DiagnosticService.get_audit_brief(str(path), rule_id)
        if brief is None:
            raise HTTPException(status_code=404, detail=f"No brief found for rule {rule_id}")
        return {"brief": brief}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validations/cypher/test")
async def test_cypher_rule(
    filing_id: str,
    query: str
):
    """
    Executes a Cypher query against LadybugDB and returns sample results.
    """
    path = LakeDiscoveryService.resolve_filing_path(filing_id)
    if not path or not path.exists():
        raise HTTPException(status_code=404, detail="Filing not found")
        
    try:
        # 1. Initialize the Bridge
        bridge = LadybugTowerBridge()
        
        # 2. Ensure Sandbox is initialized (Phase 2: Live Integration)
        # We use the parent directory of the transactions file as the lake root for this filing
        lake_dir = path.parent
        
        # Heuristic: If we are doing a join or relationship query, we MUST use Ladybug
        is_graph_query = any(k in query.upper() for k in ["-[:", "]->", "MATCH (", "CREATE ("])
        
        if is_graph_query:
            # Only generate and push schema if this filing hasn't been initialized in this session
            if filing_id not in INITIALIZED_FILINGS:
                print(f"[SANDBOX] Initializing graph for {filing_id}...")
                schema_ddl = bridge.generate_icebug_schema(str(lake_dir))
                
                # Execute schema DDL line-by-line
                for statement in schema_ddl.split(";"):
                    if statement.strip():
                        bridge.execute_cypher(statement.strip())
                
                INITIALIZED_FILINGS.add(filing_id)
                print(f"[SANDBOX] Initialization complete for {filing_id}")
            
            # Execute the actual user query
            payload = bridge.execute_cypher(query)
            return {
                "results": payload.get("rows", []),
                "metadata": payload.get("metadata", {})
            }
        else:
            # Phase 1 Fallback: Local Transpilation for simple filters
            ldf = pl.scan_parquet(str(path))
            result_ldf = CypherTranspiler.transpile(query, ldf)
            df = result_ldf.head(50).collect()
            return {
                "results": df.to_dicts(),
                "metadata": {"count": len(df), "engine": "polars-transpiler"}
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cypher Error: {str(e)}")

@router.post("/validations/cypher/promote")
async def promote_cypher_rule(
    rule_id: str,
    query: str,
    category: str = "XULE"
):
    """
    Transpiles a Cypher rule and promotes it to the production Polars engine.
    """
    # Logic to save the transpiled rule to a dynamic registry or file
    # For MVP, we log the intent and mock the success
    print(f"[PROMOTION] Promoting Cypher rule {rule_id}: {query}")
    return {"status": "promoted", "rule_id": rule_id, "category": category}
