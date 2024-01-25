import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
from app.main import uptimemon
from app.schemas import IPinfo, IPDocument

client = TestClient(uptimemon)

pytestmark = pytest.mark.asyncio


@pytest.fixture
async def create_test_ip():
    # Fixture to create a test IP
    payload = {
        "name": "Example",
        "ip_address": "192.168.0.1",
        "host_name": "example.com",
        "note": "Test IP",
    }
    response = client.post("/ips/", json=payload)
    assert response.status_code == 200
    return payload["ip_address"]


async def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}


async def test_create_ip():
    payload = {
        "name": "Example",
        "ip_address": "192.168.0.1",
        "host_name": "example.com",
        "note": "Test IP",
    }
    response = client.post("/ips/", json=payload)

    # Add print statements or breakpoints here if needed
    print(response.json())  # Example print statement

    assert response.status_code == 200
    assert "ip_info" in response.json()


async def test_read_ips():
    response = client.get("/ips/")

    # Add print statements or breakpoints here if needed
    print(response.json())  # Example print statement

    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_read_ip(create_test_ip):
    # Use the created IP from the fixture
    ip_address = create_test_ip
    response = client.get(f"/ips/{ip_address}")

    # Add print statements or breakpoints here if needed
    print(response.json())  # Example print statement

    assert response.status_code == 200
    assert "ip_info" in response.json()


async def test_read_all_ips(create_test_ip):
    # Use the created IP from the fixture
    create_test_ip  # Ensure the IP is created before running this test
    response = client.get("/ips/all/24")

    # Add print statements or breakpoints here if needed
    print(response.json())  # Example print statement

    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_delete_ip(create_test_ip):
    # Use the created IP from the fixture
    ip_address = create_test_ip
    response = client.delete(f"/ips/{ip_address}")

    # Add print statements or breakpoints here if needed
    print(response.json())  # Example print statement

    assert response.status_code == 200
    assert response.json() == {"message": "IP deleted"}


async def test_add_ping_result(create_test_ip):
    # Use the created IP from the fixture
    ip_info = IPinfo(
        name="Example",
        ip_address=create_test_ip,
        host_name="example.com",
        note="Test IP",
    )
    ip_document = IPDocument(ip_info=ip_info)

    timestamp = datetime.utcnow()
    response_time = 50  # Replace with your actual response time
    status = "OK"  # Replace with your actual status

    updated_ip_document = IPDocument.add_ping_result(
        ip_document, timestamp, response_time, status
    )

    # Add print statements or breakpoints here if needed
    print(updated_ip_document.pings)  # Example print statement

    assert len(updated_ip_document.pings) == 1
    assert updated_ip_document.pings[0].timestamp == timestamp
    assert (
        updated_ip_document.pings[0].additional_data is None
    )  # Additional data not provided in the schema
    assert updated_ip_document.pings[0].status == status
    assert updated_ip_document.pings[0].note is None  # Note not provided in the schema
