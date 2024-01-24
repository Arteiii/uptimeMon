import asyncio
import os
from typing import List
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient


from app.ping import PingUtility
from app.schemas import IPDocument
from app.ip_manager import IPManager, IPinfo, IPDocument


mongo_uri = os.environ.get("MONGO_URI", "mongodb://mongodb:27017/")

database_name = os.environ.get("MONGO_NAME", "uptimeMon")


# Create an instance of IPManager
ip_manager = IPManager(mongo_uri, database_name)


# Dependency to get the IPManager instance
def get_ip_manager():
    return ip_manager


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def startup_event():
    # start the background task to ping ipüs once when the app starts
    asyncio.create_task(ip_manager.ping_ips())


@app.on_event("startup")
async def startup():
    await startup_event()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


# @app.get("/ping/")
# async def ping_ip(ip: str):
#     ping = PingUtility()

#     result = await ping.perform_ping(ip)
#     print(result)

#     return result


@app.post("/ips/", response_model=IPDocument)
async def create_ip(ip_info: IPinfo, ip_manager: IPManager = Depends(get_ip_manager)):
    result = await ip_manager.add_ip(**ip_info.dict())
    return result


@app.get("/ips/", response_model=List[IPDocument])
async def read_ips(ip_manager: IPManager = Depends(get_ip_manager)):
    return await ip_manager.collection.find({}).to_list(None)


@app.get("/ips/{ip_address}", response_model=IPDocument)
async def read_ip(ip_address: str, ip_manager: IPManager = Depends(get_ip_manager)):
    ip_document = await ip_manager.collection.find_one(
        {"ip_info.ip_address": ip_address}
    )
    if ip_document:
        return ip_document
    else:
        raise HTTPException(status_code=404, detail="IP not found")


@app.delete("/ips/{ip_address}", response_model=dict)
async def delete_ip(ip_address: str, ip_manager: IPManager = Depends(get_ip_manager)):
    await ip_manager.remove_ip(ip_address)
    return {"message": "IP deleted"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
