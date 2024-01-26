from datetime import datetime
import ping3

from fastapi import APIRouter
from uptimemon.api.schemas import PingResult

ping = APIRouter()

ping3.DEBUG = False  # for debug output
ping3.EXCEPTIONS = True  # for exceptions on failed ping


@ping.get("/")
async def ping_root():
    return {"msg": "Hello from Ping"}


@ping.get("/{ip}")
async def ping_root(ip: str):
    timestamp = datetime.utcnow()

    try:
        result = ping3.ping(ip, timeout=2, unit="ms")

    except Exception as e:
        status = "Offline"
        additional_data = {"error": str(e)}

    else:
        status = "Online"
        additional_data = {"response_time": result}
        print(status)
        print(additional_data)

    finally:
        return PingResult(
            timestamp=timestamp,
            additional_data=additional_data,
            status=status,
        )
