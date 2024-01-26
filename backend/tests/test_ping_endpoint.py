from fastapi.testclient import TestClient

from uptimemon.main import app


class TestPingEndpoint:
    client = TestClient(app)

    def test_ping_online(self):
        ip = "127.0.0.1"
        response = self.client.get(f"/ping/{ip}")

        assert response.status_code == 200
        result = response.json()

        assert "timestamp" in result
        assert "status" in result
        assert "additional_data" in result
        assert result["status"] == "Online"

    def test_ping_offline(self):
        ip = "192.0.2.1"
        response = self.client.get(f"/ping/{ip}")

        assert response.status_code == 200
        result = response.json()

        assert "timestamp" in result
        assert "status" in result
        assert "additional_data" in result
        assert result["status"] == "Offline"

    def test_ping_exception(self):
        ip = "invalid-ip"
        response = self.client.get(f"/ping/{ip}")

        assert response.status_code == 200
        result = response.json()

        assert "timestamp" in result
        assert "status" in result
        assert "additional_data" in result
        assert result["status"] == "Offline"
        assert "error" in result["additional_data"]
