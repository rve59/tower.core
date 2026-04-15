"""GET /v1/entities — @entities.list binding"""

from fastapi import APIRouter
from ..models.filing import Entity

router = APIRouter(tags=["entities"])

_STUB_ENTITIES = [
    Entity(id="E001", name="Pacific Gas & Electric"),
    Entity(id="E002", name="Duke Energy"),
    Entity(id="E003", name="NextEra Energy"),
    Entity(id="E004", name="Dominion Energy"),
    Entity(id="E005", name="Southern Company"),
]

@router.get("/entities", response_model=list[Entity])
async def get_entities():
    """@entities.list — all registered FERC entities."""
    return _STUB_ENTITIES
