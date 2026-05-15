from fastapi import APIRouter
import os

router = APIRouter(tags=["filings"])

from tower_kernel.services.lake_discovery import LakeDiscoveryService

@router.get("/filings/hierarchy")
async def get_filings_hierarchy():
    """Returns the hierarchical filing tree (Tier > Company > Period)."""
    return LakeDiscoveryService.get_hierarchical_filings()

@router.get("/filings/items")
async def list_filings():
    """Legacy endpoint: Returns a flattened list of all filings for backward compatibility."""
    hierarchy = LakeDiscoveryService.get_hierarchical_filings()
    flattened = []
    for tier in hierarchy:
        for company in tier["companies"]:
            for period in company["periods"]:
                flattened.append({
                    "id": period["id"],
                    "entity": company["name"],
                    "cid": company["cid"],
                    "period": period["period"],
                    "status": period["status"],
                    "tier": tier["id"],
                    "has_errors": False # TODO: Bridge to validation status
                })
    return flattened

from pydantic import BaseModel
from fastapi import BackgroundTasks

class IngestExtractPayload(BaseModel):
    year: str
    quarter: str
    cid: str
    force_overwrite: bool = False

@router.post("/ingest/extract")
async def ingest_extract(payload: IngestExtractPayload):
    """
    Proxies the Master Extraction request to the high-performance Kernel Node (9043).
    """
    import urllib.request
    import json

    kernel_url = "http://tower-kernel:9043/v1/ingest/extract"
    data = json.dumps(payload.dict()).encode("utf-8")
    
    try:
        req = urllib.request.Request(
            kernel_url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            return {"status": "proxied_to_kernel", "kernel_response": res_data}
    except Exception as e:
        return {"status": "kernel_proxy_failed", "error": str(e)}

@router.post("/ingest/extract-csv")
async def ingest_extract_csv(payload: IngestExtractPayload):
    """
    Proxies the CSV Extraction request to the Kernel Node.
    """
    import urllib.request
    import json
    kernel_url = "http://tower-kernel:9043/v1/ingest/extract-csv"
    data = json.dumps(payload.dict()).encode("utf-8")
    try:
        req = urllib.request.Request(kernel_url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {"status": "kernel_proxy_failed", "error": str(e)}

@router.post("/ingest/infiltrate")
async def ingest_infiltrate(payload: IngestExtractPayload, background_tasks: BackgroundTasks):
    """
    Triggers the CSV-to-Parquet infiltration process from the staged CSVs.
    Checks for existing Parquet files and asks for confirmation unless force_overwrite is True.
    """
    from tower_kernel import config
    from tower_kernel.services.lake_merger import LakeMergerService
    from tower_kernel.utils.logging import log_progress

    # 1. Check for existing Parquet files in Data Lake
    lake_dir = config.get_tier_path(payload.cid, config.TIER_BRONZE, payload.year, payload.quarter)
    tables = ["ident", "contracts", "transactions", "index"]
    existing = [t for t in tables if (lake_dir / config.TABLE_MAP[t]).exists()]

    # log_progress(f"Conflict Check: {len(existing)} files found. Force Overwrite: {payload.force_overwrite}")

    if existing and not payload.force_overwrite:
        log_progress(f"CONFLICT: {len(existing)} Parquet files already exist in Bronze Lake for {payload.cid} | {payload.year}-{payload.quarter}.", "WARN")
        return {
            "status": "requires_confirmation", 
            "message": f"Parquet files for {', '.join(existing)} already exist. Overwrite?",
            "cid": payload.cid
        }

    # 2. Proceed with Full Ingestion (Proxied to Kernel)
    import urllib.request
    import json
    
    kernel_url = "http://tower-kernel:9043/v1/ingest/infiltrate"
    data = json.dumps(payload.dict()).encode("utf-8")
    
    try:
        req = urllib.request.Request(
            kernel_url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            return {"status": "proxied_to_kernel", "kernel_response": res_data}
    except Exception as e:
        log_progress(f"Failed to proxy infiltration to Kernel: {e}", "ERROR")
        return {"status": "kernel_proxy_failed", "error": str(e)}
from fastapi import UploadFile, File, Form
from tower_kernel.services.lake_merger import LakeMergerService

@router.post("/ingest/correct")
async def ingest_correct(
    background_tasks: BackgroundTasks,
    year: str = Form(...),
    quarter: str = Form(...),
    cid: str = Form(...),
    file: UploadFile = File(...)
):
    """Surgically merges a correction CSV into the Bronze Lake."""
    # Save the file temporarily
    temp_path = f"tower_kernel/data/current_quarter/temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())
    
    background_tasks.add_task(
        LakeMergerService.upsert_transactions, 
        year, quarter, cid, temp_path
    )
    
    return {"status": "correction_dispatched", "filename": file.filename}

@router.post("/system/rebuild-index")
async def proxy_rebuild_index():
    """
    Proxies the discovery indexing command to the Kernel Node (9043).
    """
    import urllib.request
    import json
    kernel_url = "http://tower-kernel:9043/v1/system/rebuild-index"
    try:
        req = urllib.request.Request(kernel_url, method='POST')
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {"status": "kernel_proxy_failed", "error": str(e)}
