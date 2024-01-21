from ping3 import ping
import time

class PingUtility:
    def __init__(self, max_retries: int = 3, retry_delay: int = 2):
        self.max_retries = max_retries
        self.retry_delay = retry_delay

    async def perform_ping(self, ip: str):
        for retry in range(self.max_retries + 1):
            try:
                result = ping(ip, timeout=2, unit="ms")
                print(result)

                if result is not None:
                    status = "Online"
                    additional_data = {"response_time": result}
                    return {"status": status, "additional_data": additional_data}
                else:
                    raise Exception("Ping failed")

            except Exception as e:
                if retry < self.max_retries:
                    # Retry if the exception occurred within the allowed retries
                    print(f"Retry {retry + 1} after {self.retry_delay} seconds due to error: {str(e)}")
                    time.sleep(self.retry_delay)
                else:
                    # Return the final offline state with the last error
                    return {"status": "Offline", "additional_data": {"error": str(e)}}

