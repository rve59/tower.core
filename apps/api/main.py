"""
TOWER FastAPI Backend — generated from tower_app_ui_definition.md
Serves all @model.field bindings declared in the LSL spec.

Routes:
  GET  /v1/filings/items          → @filings.items (Filing[])
  GET  /v1/entities               → @entities.list (Entity[])
  GET  /v1/system/arelle-version  → @system.arelleVersion
  POST /v1/ingest                 → emit:IngestDataset (BackgroundTask)
  WS   /ws/pipeline               → @pipeline.health / .progress / .statusMessage / .running
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

from .settings import settings
from .routers import filings, entities, system
from .tasks.ingest import run_ingest


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[TOWER] API starting — CORS origins: {settings.cors_origins}")
    yield
    print("[TOWER] API shutting down")


app = FastAPI(
    title="TOWER API",
    version="0.1.0",
    description="FERC XBRL Validation Platform — scaffolded by TOWER-LSL",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(filings.router,  prefix="/v1")
app.include_router(entities.router, prefix="/v1")
app.include_router(system.router,   prefix="/v1")


@app.post("/v1/ingest")
async def ingest_dataset(background_tasks: BackgroundTasks):
    """emit:IngestDataset — dispatches background ingestion task."""
    background_tasks.add_task(run_ingest)
    return {"status": "accepted", "message": "Ingestion task dispatched"}


# WebSocket — @pipeline.health, @pipeline.progress, @pipeline.statusMessage, @pipeline.running
@app.websocket("/ws/pipeline")
async def pipeline_ws(ws: WebSocket):
    await ws.accept()
    try:
        tick = 0
        while True:
            # TODO: replace with real pipeline state from Celery / task queue
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
