from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Optional
from database import get_db
from bson import ObjectId
import os
import jwt
from datetime import datetime

router = APIRouter()

SECRET_KEY = os.environ.get("JWT_SECRET") or "change-this-secret"
ALGORITHM = "HS256"


class HistoryItem(BaseModel):
    filename: str
    file_type: str
    prediction: str
    confidence: float


def get_current_user(request: Request):
    auth = request.headers.get("Authorization")
    if not auth:
        raise HTTPException(status_code=401, detail="Missing authorization")
    parts = auth.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = parts[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# MongoDB collection
db = get_db()
history_collection = db["history"]


@router.post("/save")
def save_history(item: HistoryItem, request: Request):
    user = get_current_user(request)
    doc = {
        "user_id": user.get("sub"),
        "username": user.get("username"),
        "filename": item.filename,
        "file_type": item.file_type,
        "prediction": item.prediction,
        "confidence": item.confidence,
        "created_at": datetime.utcnow(),
    }
    res = history_collection.insert_one(doc)
    inserted_id = str(res.inserted_id)
    print(f"[history] saved {inserted_id} for user {user.get('username')} ({user.get('sub')})")
    return {"id": inserted_id, "saved": doc}


@router.get("")
def list_history(request: Request):
    user = get_current_user(request)
    uid = user.get("sub")
    items = list(history_collection.find({"user_id": uid}).sort("created_at", -1))
    for it in items:
        it["id"] = str(it.get("_id"))
        it.pop("_id", None)
    return {"items": items}


@router.delete("/{item_id}")
def delete_history(item_id: str, request: Request):
    user = get_current_user(request)
    uid = user.get("sub")
    doc = history_collection.find_one({"_id": ObjectId(item_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="History item not found")
    if doc.get("user_id") != uid:
        raise HTTPException(status_code=403, detail="Not allowed")
    history_collection.delete_one({"_id": ObjectId(item_id)})
    return {"status": "deleted"}


@router.delete("")
def clear_history(request: Request):
    user = get_current_user(request)
    uid = user.get("sub")
    history_collection.delete_many({"user_id": uid})
    return {"status": "cleared"}
