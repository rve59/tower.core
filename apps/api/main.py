"""
TOWER FastAPI Backend — MVP Edition
Orchestrates the 4 phases of the compliance pipeline.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import psutil
import datetime

from settings import settings
from routers import filings, entities, system, validation, audit
from tasks.ingest import run_ingest
from services.telemetry import timing_store


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Mock some initial timings for the UI
    timing_store.record_load(2450.0)
    timing_store.record_validate(15800.0)
    print(f"[TOWER] API starting — CORS origins: {settings.cors_origins}")
    yield
    print("[TOWER] API shutting down")


app = FastAPI(
    title="TOWER API",
    version="0.1.0",
    description="FERC XBRL Validation Platform — MVP Hub",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All MVP Routers
app.include_router(system.router,     prefix="/v1")
app.include_router(entities.router,   prefix="/v1")
app.include_router(filings.router,    prefix="/v1")
app.include_router(validation.router, prefix="/v1")
app.include_router(audit.router,      prefix="/v1")


@app.post("/v1/ingest")
async def ingest_dataset(background_tasks: BackgroundTasks):
    """Trigger the TOWER-K Ingestion Engine."""
    background_tasks.add_task(run_ingest)
    return {"status": "accepted", "message": "Ingestion task dispatched"}


# WebSocket — Real-time Telemetry (Phase 0 Dashboard Support)
@app.websocket("/ws/telemetry")
async def telemetry_ws(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            # Pull Real OS Metrics as requested
            cpu = psutil.cpu_percent()
            mem = psutil.virtual_memory().percent
            
            await ws.send_json({
                "cpu_usage": cpu,
                "memory_usage": mem,
                "timings": timing_store.timings.dict(),
                "timestamp": datetime.datetime.now().isoformat()
            })
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass


# WebSocket — Pipeline Progress
@app.websocket("/ws/pipeline")
async def pipeline_ws(ws: WebSocket):
    await ws.accept()
    try:
        tick = 0
        while True:
            # Mock pipeline for now, will connect to Celery/Task state in Stage 2
            running = (tick % 10) < 5
            progress = (tick * 7) % 100 if running else 0
            await ws.send_json({
                "health": "healthy",
                "progress": progress,
                "status_message": "Processing FERC Q4 2024 submissions..." if running else "Idle",
                "running": running,
            })
            tick += 1
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass


if __name__ == "__main__":
    import uvicorn
    # Default to Port 9042 as expected by TOWER-K Hub configuration
    uvicorn.run(app, host="0.0.0.0", port=9042)
