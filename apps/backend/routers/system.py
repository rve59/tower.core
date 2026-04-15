"""GET /v1/system/arelle-version"""

from fastapi import APIRouter
from ..models.filing import SystemInfo
from ..settings import settings

router = APIRouter(tags=["system"])

@router.get("/system/arelle-version", response_model=SystemInfo)
async def get_arelle_version():
    """@system.arelleVersion — installed Arelle version string."""
    # TODO: import importlib.metadata; return metadata("arelle-release").version
    return SystemInfo(version=settings.arelle_version)
