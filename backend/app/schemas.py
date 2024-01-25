from typing import Any, List, Optional
from pydantic import BaseModel
from datetime import datetime


class PingResult(BaseModel):
    timestamp: datetime
    additional_data: Any
    status: str
    note: str


class IPinfo(BaseModel):
    name: str
    ip_address: str
    host_name: str
    note: str


class IPDocument(BaseModel):
    ip_info: IPinfo
    pings: List[PingResult] = []

    class Config:
        from_attributes = True

    @staticmethod
    def add_ping_result(ip_document, timestamp, response_time, status):
        ping_result = PingResult(
            timestamp=timestamp, response_time=response_time, status=status
        )
        ip_document.pings.append(ping_result)
        return ip_document
