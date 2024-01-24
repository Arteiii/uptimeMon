import asyncio
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import ping3


from app.schemas import IPinfo, IPDocument, PingResult
from app.ping import PingUtility

ping3.DEBUG = True
ping3.EXCEPTIONS = True


class IPManager:
    def __init__(self, mongo_uri, database_name, ping_interval_seconds=60):
        self.mongo_uri = mongo_uri
        self.database_name = database_name
        self.ping_interval_seconds = ping_interval_seconds
        self.client = AsyncIOMotorClient(self.mongo_uri)
        self.db = self.client[self.database_name]
        self.collection = self.db["ips"]

    async def add_ip(self, name, ip_address, host_name, note=""):
        ip_info = IPinfo(
            name=name, ip_address=ip_address, host_name=host_name, note=note
        )
        ip_document = IPDocument(ip_info=ip_info)
        await self.collection.insert_one(ip_document.dict())
        return ip_document

    async def remove_ip(self, ip_address):
        await self.collection.delete_many({"ip_info.ip_address": ip_address})

    async def ping_ips(self):
        print("Starting Pings!!")
        while True:
            ips = await self.collection.find({}).to_list(None)
            for ip_document_dict in ips:
                ip_document = IPDocument(**ip_document_dict)
                timestamp = datetime.utcnow()

                try:
                    result = ping3.ping(
                        ip_document.ip_info.ip_address, timeout=2, unit="ms"
                    )
                    print(result)

                except Exception as e:
                    status = "Offline"
                    additional_data = {"error": str(e)}

                else:
                    status = "Online"
                    additional_data = {"response_time": result}
                    print(status)
                    print(additional_data)

                ping_result = PingResult(
                    timestamp=timestamp,
                    additional_data=additional_data,
                    status=status,
                    note="",
                )

                print(ip_document.dict(exclude={"_id"}))

                # Update the IPDocument with the ping result
                ip_document.pings.append(ping_result)
                await self.collection.update_one(
                    {"ip_info.ip_address": ip_document.ip_info.ip_address},
                    {"$set": ip_document.dict(exclude={"_id"})},
                )

            await asyncio.sleep(self.ping_interval_seconds)
