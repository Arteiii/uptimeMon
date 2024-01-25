import asyncio
from datetime import date, datetime, timedelta
from statistics import mean
from motor.motor_asyncio import AsyncIOMotorClient
import ping3

from app.schemas import IPinfo, IPDocument, PingResult

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
        await self._insert_ip_document(ip_document)
        return ip_document

    async def remove_ip(self, ip_address):
        await self._delete_ip_document(ip_address)

    async def ping_ips(self):
        ips = await self.collection.find({}).to_list(None)
        for ip_document_dict in ips:
            await self._ping_single_ip(ip_document_dict)

    async def cleanup_old_records(self, interval_days=1, grouping_start_time=None):
        await self._cleanup_old_records(interval_days, grouping_start_time)

    async def _insert_ip_document(self, ip_document):
        await self.collection.insert_one(ip_document.dict())

    async def _delete_ip_document(self, ip_address):
        await self.collection.delete_many({"ip_info.ip_address": ip_address})

    async def _ping_single_ip(self, ip_document_dict):
        ip_document = IPDocument(**ip_document_dict)
        timestamp = datetime.utcnow()

        try:
            result = ping3.ping(ip_document.ip_info.ip_address, timeout=2, unit="ms")
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
            timestamp=timestamp, additional_data=additional_data, status=status, note=""
        )

        print(ip_document.dict(exclude={"_id"}))

        ip_document.pings.append(ping_result)
        await self._update_ip_document(ip_document)

    async def _cleanup_old_records(self, interval_days, grouping_start_time):
        current_time = datetime.utcnow()
        cutoff_time = current_time - timedelta(days=interval_days)

        if grouping_start_time:
            grouping_start_time = max(
                grouping_start_time, datetime.combine(date.today(), datetime.min.time())
            )
            if cutoff_time > grouping_start_time:
                cutoff_time = grouping_start_time

        ips = await self.collection.find({}).to_list(None)

        for ip_document_dict in ips:
            await self._cleanup_single_ip(ip_document_dict, cutoff_time)

    async def _cleanup_single_ip(self, ip_document_dict, cutoff_time):
        ip_document = IPDocument(**ip_document_dict)
        valid_pings = [
            ping for ping in ip_document.pings if ping.timestamp >= cutoff_time
        ]

        if valid_pings:
            avg_ping = mean(
                [ping.additional_data.get("response_time", 0) for ping in valid_pings]
            )
            ip_document.avg_ping = avg_ping
            ip_document.pings = valid_pings

            print(f"Merged records for IP {ip_document.ip_info.ip_address}:")
            for ping in valid_pings:
                print(
                    f"  Timestamp: {ping.timestamp}, Response Time: {ping.additional_data.get('response_time', 'N/A')} ms"
                )

            await self._update_ip_document(ip_document)

    async def _update_ip_document(self, ip_document):
        await self.collection.update_one(
            {"ip_info.ip_address": ip_document.ip_info.ip_address},
            {"$set": ip_document.dict(exclude={"_id"})},
        )

    async def ping_all_ips(self):
        ips = await self.collection.find({}).to_list(None)
        for ip_document_dict in ips:
            await self._ping_single_ip(ip_document_dict)
