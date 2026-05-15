from fastapi import APIRouter

router = APIRouter(tags=["entities"])

from tower_kernel.services.discovery_indexer import MasterDiscoveryService
from tower_kernel.services.registry_mirror import RegistryMirrorService
import polars as pl

@router.get("/entities")
async def list_entities():
    """Lists all filing entities (Utilities) found in index or registry."""
    # 1. Get from Discovery Index (Actually found in ZIPs)
    index_ldf = MasterDiscoveryService.get_index_ldf()
    index_entities = index_ldf.select(["cid", "legal_name"]).unique().collect()
    
    # 2. Get from Registry Mirror (Official list)
    registry_ldf = RegistryMirrorService.get_mirror_ldf()
    registry_entities = registry_ldf.select([
        pl.col("cid"), 
        pl.col("legal_name")
    ]).unique().collect()
    
    # 3. Merge
    combined = pl.concat([index_entities, registry_entities]).unique(subset=["cid"])
    
    return [
        {"id": row["cid"], "name": row["legal_name"]}
        for row in combined.to_dicts()
    ]
