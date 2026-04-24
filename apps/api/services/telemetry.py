from pydantic import BaseModel
from typing import Optional
import time

class PipelineTimings(BaseModel):
    last_load_ms: Optional[float] = None
    last_validate_ms: Optional[float] = None
    last_map_ms: Optional[float] = None
    last_package_ms: Optional[float] = None

class TimingStore:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TimingStore, cls).__new__(cls)
            cls._instance.timings = PipelineTimings()
        return cls._instance

    def record_load(self, ms: float):
        self.timings.last_load_ms = ms

    def record_validate(self, ms: float):
        self.timings.last_validate_ms = ms

timing_store = TimingStore()
