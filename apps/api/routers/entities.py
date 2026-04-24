from fastapi import APIRouter

router = APIRouter(tags=["entities"])

@router.get("/entities")
async def list_entities():
    """Lists all filing entities (Utilities)."""
    # TODO: Bridge to tower_kernel.services.master_data
    return [
        {"id": "6153783", "name": "Amazon Energy LLC", "type": "Major Electric"},
        {"id": "6278165", "name": "Tribal Power Utility", "type": "Tribal Enterprise"},
    ]
