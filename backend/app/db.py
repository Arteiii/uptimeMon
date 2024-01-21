from datetime import datetime, timedelta
from pymongo import MongoClient

# MongoDB connection
mongo_uri = "mongodb://mongodb:27017"  # Replace 'mongodb' with your MongoDB service name
client = MongoClient(mongo_uri)
db = client.pingdb
ping_collection = db.pings

# Function to insert ping results into MongoDB
def insert_ping_result(ip_address, response_time, status):
    timestamp = datetime.utcnow()
    ping_data = {
        "ip_address": ip_address,
        "timestamp": timestamp,
        "response_time": response_time,
        "status": status,
    }
    ping_collection.insert_one(ping_data)

# Function to query and delete records older than 30 minutes
def delete_old_records():
    thirty_minutes_ago = datetime.utcnow() - timedelta(minutes=30)
    query = {"timestamp": {"$lt": thirty_minutes_ago}}
    ping_collection.delete_many(query)

# Example usage
ip_address = "example_ip"
response_time = 10.5
status = "Online" if response_time is not None else "Offline"

# Insert ping result into MongoDB
insert_ping_result(ip_address, response_time, status)

# Delete records older than 30 minutes
delete_old_records()
