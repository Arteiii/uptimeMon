import ping3

ping3.DEBUG = True  # advanced ping output
ping3.EXCEPTIONS = True  # throws exception on ping error


class PingUtility:
    def __init__(self):
        pass

    async def perform_ping(self, ip: str):
        try:
            result = ping3.ping(ip, timeout=2, unit="ms")
            print(result)

            if result is not None:
                status = "Online"
                additional_data = {"response_time": result}
                return {"status": status, "additional_data": additional_data}
            else:
                raise Exception("Ping failed")

        except Exception as e:
            return {"status": "Offline", "additional_data": {"error": str(e)}}
