import pytest
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
from app.main import app, ping_collection

# This fixture sets up a TestClient for your FastAPI app
@pytest.fixture
def test_app():
    return TestClient(app)

# This fixture sets up an AsyncIOMotorClient for your MongoDB
@pytest.fixture
async def test_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.pingdb
    yield db
    await db.client.close()


def test_read_root(test_app):
    response = test_app.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

# def test_ping_endpoint(test_app, test_db):

