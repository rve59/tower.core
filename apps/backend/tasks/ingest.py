"""emit:IngestDataset — BackgroundTask handler"""

import asyncio


async def run_ingest():
    """
    Background task dispatched by POST /v1/ingest (emit:IngestDataset).

    TODO: implement real ingestion pipeline:
      1. Pull latest FERC XBRL submissions from data directory
      2. Convert to Parquet via Polars
      3. Run TOWER-K validation kernel
      4. Push progress updates via WebSocket /ws/pipeline
      5. Update filing status in database
    """
    print("[TOWER] IngestDataset: starting...")
    await asyncio.sleep(2)   # simulate async work
    print("[TOWER] IngestDataset: complete")
