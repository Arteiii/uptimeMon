import asyncio
import os
from dotenv import load_dotenv

from datetime import datetime, timedelta
from typing import List
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient

from app.schemas import IPDocument
from app.ip_manager import IPManager, IPinfo, IPDocument


# load environment variables from .env file
load_dotenv()

# use the environment variables or default values
mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
database_name = os.environ.get("MONGO_NAME", "uptimeMon")

ip_manager = IPManager(mongo_uri, database_name)


def get_ip_manager():
    return ip_manager


uptimemon = FastAPI()

uptimemon.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# async def startup_event(shutdown_flag: asyncio.Event):
#     try:
#         asyncio.create_task(ip_manager.ping_ips())
#         while not shutdown_flag.is_set():
#             await ip_manager.cleanup_old_records()
#             await asyncio.sleep(12 * 3600)
#     except Exception as e:
#         print(f"Exception during startup event: {e}")


# shutdown_flag = asyncio.Event()


# @uptimemon.on_event("startup")
# async def startup():
#     print("mongo_uri: ", mongo_uri)
#     print("database_name: ", database_name)
#     try:
#         asyncio.create_task(startup_event(shutdown_flag))
#     except Exception as e:
#         print(f"Exception during startup: {e}")


# @uptimemon.on_event("shutdown")
# async def shutdown():
#     try:
#         shutdown_flag.set()
#         await asyncio.sleep(1)  # allow some time for the cleanup_old_records to finish
#         ip_manager.client.close()
#     except Exception as e:
#         print(f"Exception during shutdown event: {e}")


@uptimemon.exception_handler(Exception)
async def exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": f"Internal server error: {str(exc)}"},
    )


@uptimemon.get("/")
async def read_root():
    return {"msg": "Hello World"}


@uptimemon.post("/ips/", response_model=IPDocument)
async def create_ip(ip_info: IPinfo, ip_manager: IPManager = Depends(get_ip_manager)):
    try:
        result = await ip_manager.add_ip(**ip_info.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@uptimemon.get("/ips/", response_model=List[IPDocument])
async def read_ips(ip_manager: IPManager = Depends(get_ip_manager)):
    try:
        return await ip_manager.collection.find({}).to_list(None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@uptimemon.get("/ips/{ip_address}", response_model=IPDocument)
async def read_ip(ip_address: str, ip_manager: IPManager = Depends(get_ip_manager)):
    try:
        ip_document = await ip_manager.collection.find_one(
            {"ip_info.ip_address": ip_address}
        )
        if ip_document:
            return ip_document
        else:
            raise HTTPException(status_code=404, detail="IP not found")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@uptimemon.get("/ips/all/{duration_in_hours}", response_model=List[IPDocument])
async def read_all_ips(
    duration_in_hours: str, ip_manager: IPManager = Depends(get_ip_manager)
):
    try:
        duration_in_hours = int(duration_in_hours)
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Invalid duration_in_hours. Must be an integer."
        )

    try:
        all_documents = await ip_manager.collection.find().to_list(length=None)

        for ip_document in all_documents:
            cutoff_time = datetime.utcnow() - timedelta(hours=duration_in_hours)
            ip_document["pings"] = [
                ping
                for ping in ip_document.get("pings", [])
                if ping["timestamp"] >= cutoff_time
            ]

        return all_documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@uptimemon.delete("/ips/{ip_address}", response_model=dict)
async def delete_ip(ip_address: str, ip_manager: IPManager = Depends(get_ip_manager)):
    try:
        await ip_manager.remove_ip(ip_address)
        return {"message": "IP deleted"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
