import sys
import os
import time

# Ensure local libraries are discoverable
sys.path.append(os.path.join(os.getcwd(), "libraries"))

from lib_xbrl.parser import ingest_taxonomy

def rebuild_registry():
    years = ["2024", "2023", "2022", "2025"]
    
    for year in years:
        entry_point = f"https://xbrl.fasb.org/us-gaap/{year}/elts/us-gaap-{year}.xsd"
        print(f"\n--- Processing US-GAAP {year} ---")
        start_time = time.time()
        
        # This will trigger the one-shot: download, parse, serialize, purge
        dts = ingest_taxonomy(None, entry_point_name=entry_point, use_cache=True)
        
        duration = time.time() - start_time
        print(f"Ingestion Complete for {year}. Concepts: {len(dts.concepts)}. Duration: {duration:.2f}s")

if __name__ == "__main__":
    rebuild_registry()
