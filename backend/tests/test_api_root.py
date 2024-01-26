import httpx
import pytest
from fastapi import status


@pytest.mark.asyncio
class TestAPIRoot:
    async def test_root(self, test_client: httpx.AsyncClient):
        reponse = await test_client.get("/")
        assert reponse.status_code == status.HTTP_200_OK

    async def test_ping_root(self, test_client: httpx.AsyncClient):
        reponse = await test_client.get("/ping/")
        assert reponse.status_code == status.HTTP_200_OK
