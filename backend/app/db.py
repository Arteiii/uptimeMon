from datetime import datetime, timedelta
import motor.motor_asyncio

from app.schemas import IPDocument, IPinfo, PingResult


class PingDB:
    def __init__(
        self,
        collection_name: str = "Pings",
        db_url: str = "mongodb://localhost:27017",
        db_name: str = "uptimeDB",
    ) -> None:
        """
        Initialize MongoDBManager.

        Args:
            db_url (str): MongoDB connection URL.
            db_name (str): Database name.
            collection_name (str): Collection name.
        """
        self.client: motor.motor_asyncio.AsyncIOMotorClient = (
            motor.motor_asyncio.AsyncIOMotorClient(db_url)
        )
        self.db: motor.motor_asyncio.AsyncIOMotorDatabase = self.client[db_name]
        self.collection: motor.motor_asyncio.AsyncIOMotorCollection = self.db[
            collection_name
        ]

    async def insert_new_ping_result(self, ip_info: IPinfo, results: PingResult):
        existing_document = self.ping_collection.find_one(
            {"ip_info.ip_address": ip_info.ip_address}
        )

        if existing_document:
            self.ping_collection.update_one(
                {"ip_info.ip_address": ip_info.ip_address},
                {"$push": {"pings": results.dict()}},
            )
        else:
            ping_data = IPDocument(ip_info=ip_info, pings=[results])
            self.ping_collection.insert_one(ping_data)

    async def delete_old_records(self, time_days: int = 20):
        time_threshold = datetime.utcnow() - timedelta(days=time_days)
        query = {"timestamp": {"$lt": time_threshold}}
        self.ping_collection.delete_many(query)
