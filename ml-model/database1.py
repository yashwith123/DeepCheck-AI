from pymongo import MongoClient

MONGO_URL = "mongodb+srv://deepcheck123:deepcheck123@cluster0.n3juutl.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URL)

db = client["deepcheck_ai"]

users_collection = db["users"]

print("MongoDB Connected Successfully")