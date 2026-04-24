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


async def run_master_extraction(year: str, quarter: str, cid: str):
    """
    Background task dispatched by POST /v1/ingest/extract.
    Extracts the isolated CID dataset from the FERC YYYY-Q master ZIP dump.
    """
    print(f"[TOWER] Starting master extraction: {year} Q{quarter} | CID: {cid}")
    try:
        from tower_kernel.ingest.master_extractor import FERCMasterExtractor
        extractor = FERCMasterExtractor(year, quarter, cid)
        extractor.extract()
        print(f"[TOWER] Master extraction complete for CID {cid}")
    except Exception as e:
        print(f"[TOWER] Master extraction failed for CID {cid}: {e}")
