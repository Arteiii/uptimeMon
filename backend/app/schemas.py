from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class PingResult(BaseModel):
    timestamp: datetime
    response_time: Optional[float]
    status: str

class IPDocument(BaseModel):
    ip_address: str
    pings: List[PingResult] = []

    class Config:
        orm_mode = True

    @staticmethod
    def add_ping_result(ip_document, timestamp, response_time, status):
        ping_result = PingResult(timestamp=timestamp, response_time=response_time, status=status)
        ip_document.pings.append(ping_result)
        return ip_document
