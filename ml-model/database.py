import os
from pymongo import MongoClient

# Read MongoDB connection string from environment; fall back to a local/placeholder
MONGO_URL = os.environ.get("MONGODB_URI") or os.environ.get("MONGO_URL") or (
	"mongodb+srv://deepcheck123:deepcheck123@cluster0.n3juutl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)

client = MongoClient(MONGO_URL)

# database name can be overridden by env var MONGO_DB
DB_NAME = os.environ.get("MONGO_DB") or "deepcheck_ai"

db = client[DB_NAME]

users_collection = db["users"]


def get_db():
	return db
