import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from ping3 import ping, verbose_ping

app = FastAPI()

mongo_uri = "mongodb://mongodb:27017"  # Replace 'mongodb' with the name of your MongoDB service in Docker Compose
client = AsyncIOMotorClient(mongo_uri)
db = client.pingdb
ping_collection = db.pings

ip_config = {
    "example_hostname1": "example_ip1",
    "example_hostname2": "example_ip2",
    # Add more hostnames and corresponding IPs as needed
}

@app.get("/ping/")
async def ping_hostnames(hostnames: list):
    try:
        start_time = datetime.utcnow()

        # Extract corresponding IPs from the ip_config dictionary
        ips = [ip_config.get(hostname) for hostname in hostnames]

        # Remove None values (hostnames without corresponding IPs)
        ips = [ip for ip in ips if ip is not None]

        # Perform concurrent ping operations and store the results in a list of tasks
        tasks = [perform_ping(ip) for ip in ips]
        ping_results = await asyncio.gather(*tasks)

        end_time = datetime.utcnow()
        response_time = (end_time - start_time).total_seconds()

        # Store the results in MongoDB
        for hostname, (status, additional_data) in zip(hostnames, ping_results):
            await ping_collection.insert_one({
                "hostname": hostname,
                "ip": ip_config.get(hostname),
                "status": status,
                "timestamp": end_time,
                "response_time": response_time,
                "additional_data": additional_data
            })

        return JSONResponse(content={
            "hostnames": hostnames,
            "ips": ips,
            "status": [status for status, _ in ping_results],
            "timestamp": end_time.isoformat(),
            "response_time": response_time,
            "additional_data": [additional_data for _, additional_data in ping_results]
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing ping: {str(e)}")

async def perform_ping(ip: str):
    try:
        # Send a single ping request
        result = ping(ip, timeout=2, unit="ms")

        # Check if the ping was successful
        if result is not None:
            status = "Online"
            additional_data = {"response_time": result}
        else:
            status = "Offline"
            additional_data = {"error": "Ping failed"}

        return status, additional_data

    except Exception as e:
        # Handle other exceptions
        return "Offline", {"error": str(e)}
