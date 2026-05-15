import sys
import polars as pl
from pathlib import Path

# Add tower_kernel to path
sys.path.append("/home/raynier/Development/workspaces/fullstack/vibes/TOWER_WORKSPACE/tower_kernel/src")
sys.path.append("/home/raynier/Development/workspaces/fullstack/vibes/TOWER_WORKSPACE/tower_core/apps")

from tower_kernel.services.diagnostic import DiagnosticService

parquet_path = "/home/raynier/Development/workspaces/fullstack/vibes/TOWER_WORKSPACE/tower_kernel/data/lake/C000171/2025-Q1/bronze/transactions.parquet"
rule_id = "F.25.17.2"

try:
    print(f"Analyzing {rule_id} for {parquet_path}...")
    result = DiagnosticService.analyze_failure_set_with_ai(parquet_path, rule_id)
    print("SUCCESS:")
    print(result)
except Exception as e:
    print("FAILED:")
    import traceback
    traceback.print_exc()
