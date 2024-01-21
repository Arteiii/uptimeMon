import asyncio
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from app.ping import PingUtility


app = FastAPI()

mongo_uri = "mongodb://mongodb:27017"
client = AsyncIOMotorClient(mongo_uri)
db = client.pingdb
ping_collection = db.pings

ip_config = {
    "example_hostname1": "example_ip1",
    "example_hostname2": "example_ip2",
    # Add more hostnames and corresponding IPs as needed
}


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/ping/")
async def ping_ip(ip: str):
    ping = PingUtility(max_retries=3, retry_delay=2)
    
    result = await ping.perform_ping(ip)
    print(result)
    
    return result

@app.post("/collection")
async def create_collection(ips: List[str]):
    return {"status": "success"}


if __name__ == "__main__":
    import uvicorn

    # start the uvicorn server when the script is run directly (dev only)
    uvicorn.run(app, host="0.0.0.0", port=8000)