from fastapi import APIRouter
import psutil
import platform
import datetime
import asyncio
from pydantic import BaseModel

router = APIRouter(tags=["system"])

@router.get("/system/telemetry")
async def get_telemetry():
    """Returns real-time OS metrics for CPU, Memory, and Disk."""
    return {
        "cpu_usage_percent": psutil.cpu_percent(interval=None),
        "memory_usage_percent": psutil.virtual_memory().percent,
        "disk_usage_percent": psutil.disk_usage('/').percent,
        "timestamp": datetime.datetime.now().isoformat()
    }

@router.get("/system/info")
async def get_system_info():
    """Returns static system information."""
    return {
        "os": platform.system(),
        "processor": platform.processor(),
        "python_version": platform.python_version(),
        "boot_time": datetime.datetime.fromtimestamp(psutil.boot_time()).isoformat()
    }

from tower_kernel.services.registry_mirror import RegistryMirrorService
from tower_kernel.config import REGISTRY_ROOT
from fastapi import BackgroundTasks

@router.post("/system/sync-master")
async def sync_master(background_tasks: BackgroundTasks):
    """Triggers a background synchronization of the FERC CID Registry."""
    background_tasks.add_task(RegistryMirrorService.sync_official_registry)
    return {"status": "sync_dispatched"}

@router.post("/system/registry/import/manual")
async def import_cid_manual(background_tasks: BackgroundTasks):
    """Triggers a manual ingestion of the 'cid_master.csv' file from the registry directory."""
    # Use absolute path from config to avoid CWD issues
    path = str(REGISTRY_ROOT / "cid_master.csv")
    background_tasks.add_task(RegistryMirrorService.import_registry, path)
    return {"status": "import_dispatched", "target": path}

@router.get("/system/sync-status")
async def get_sync_status():
    """Returns the metadata of the last CID registry synchronization."""
    last_synced = RegistryMirrorService._get_last_synced_date()
    return {"last_synced": last_synced or "Never"}

from tower_kernel.config import PATH_DISCOVERY_INDEX
import os

@router.get("/system/discovery-status")
async def get_discovery_status():
    """Checks if the discovery index (discovery_index.parquet) exists."""
    print(f"[DEBUG] Checking discovery index at: {PATH_DISCOVERY_INDEX.absolute()}")
    exists = os.path.exists(PATH_DISCOVERY_INDEX)
    return {"exists": exists}
from fastapi.responses import StreamingResponse
from tower_kernel.utils.logging import IngestionLogger

@router.get("/system/logs/stream")
async def stream_logs():
    """Server-Sent Events (SSE) endpoint to stream ingestion logs."""
    # Register the running loop for thread-safe logging
    IngestionLogger.set_loop(asyncio.get_running_loop())
    
    async def event_generator():
        async for record in IngestionLogger.get_stream():
            # Standard SSE format: "data: <message>\n\n"
            yield f"data: {record}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

class LogEntry(BaseModel):
    message: str
    level: str = "INFO"

@router.post("/system/logs/append")
async def append_log(entry: LogEntry):
    """Allows external services (e.g., TOWER-K) to append logs to the central stream."""
    print(f"[APPEND-LOG] {entry.level}: {entry.message}")
    IngestionLogger.log(entry.message, entry.level)
    return {"status": "log_appended"}
