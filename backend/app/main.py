import asyncio
import os
from typing import List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.ping import PingUtility
from app.schemas import IPDocument

app = FastAPI()

mongo_uri = "mongodb://mongodb:27017"
db_name = "uptimedb"


# retrieve allowed origins from environment variable or provide default values
origins_str = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost,http://localhost:8080,http://localhost:8000,http://localhost:5000",
)
origins = [origin.strip() for origin in origins_str.split(",")]

origins = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/ping/")
async def ping_ip(ip: str):
    ping = PingUtility()

    result = await ping.perform_ping(ip)
    print(result)

    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
