from typing import Any, List
from pydantic import BaseModel
from datetime import datetime


class PingResult(BaseModel):
    timestamp: datetime
    additional_data: Any
    status: str


class IPDocument(BaseModel):
    name: str
    ip_address: str
    host_name: str
    note: str
    pings: List[PingResult] = []
