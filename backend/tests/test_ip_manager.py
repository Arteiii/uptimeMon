import asyncio
import pytest
from datetime import datetime, timedelta
from app.ip_manager import IPManager
from app.schemas import IPinfo, IPDocument, PingResult

# Replace this with your actual imports and class paths


@pytest.fixture
async def ip_manager():
    # Assuming you have a running MongoDB instance for testing
    mongo_uri = "mongodb://localhost:27017"
    database_name = "test_database"
    ping_interval_seconds = 60

    manager = IPManager(mongo_uri, database_name, ping_interval_seconds)
    yield manager

    # Clean up after testing
    await manager.collection.drop()


@pytest.mark.asyncio
async def test_add_ip(ip_manager):
    name = "TestIP"
    ip_address = "192.168.1.1"
    host_name = "test-host"
    note = "Test Note"

    async for manager in ip_manager:
        ip_document = await manager.add_ip(name, ip_address, host_name, note)

    assert ip_document.ip_info.name == name
    assert ip_document.ip_info.ip_address == ip_address
    assert ip_document.ip_info.host_name == host_name
    assert ip_document.ip_info.note == note


@pytest.mark.asyncio
async def test_remove_ip(ip_manager):
    name = "TestIP"
    ip_address = "192.168.1.1"
    host_name = "test-host"
    note = "Test Note"

    async for manager in ip_manager:
        await manager.add_ip(name, ip_address, host_name, note)
        await manager.remove_ip(ip_address)

        result = await manager.collection.find_one({"ip_info.ip_address": ip_address})
        assert result is None


@pytest.mark.asyncio
async def test_cleanup_old_records(ip_manager):
    async def run_test():
        ip_address = "192.168.1.1"
        await ip_manager.add_ip("TestIP", ip_address, "test-host")

        for _ in range(5):
            timestamp = datetime.utcnow() - timedelta(days=2)
            ping_result = PingResult(
                timestamp=timestamp,
                additional_data={"response_time": 10},
                status="Online",
                note="",
            )
            await ip_manager.collection.update_one(
                {"ip_info.ip_address": ip_address},
                {"$push": {"pings": ping_result.dict()}},
            )

        await ip_manager.cleanup_old_records(interval_days=1)
        ip_document = await ip_manager.collection.find_one(
            {"ip_info.ip_address": ip_address}
        )
        assert (
            len(ip_document["pings"]) == 0
        ) 

    asyncio.create_task(run_test())
    await asyncio.sleep(2)
