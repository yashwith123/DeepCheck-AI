from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from database import users_collection
from history import get_current_user
import bcrypt
from bson import ObjectId

router = APIRouter()


class UsernamePayload(BaseModel):
    username: str


class PasswordPayload(BaseModel):
    old_password: str
    new_password: str


@router.put("/settings/username")
def update_username(payload: UsernamePayload, request: Request):
    user = get_current_user(request)
    uid = user.get("sub")
    newname = payload.username.strip()
    if not newname:
        raise HTTPException(status_code=400, detail="Username cannot be empty")

    # prevent duplicate
    if users_collection.find_one({"username": newname, "_id": {"$ne": ObjectId(uid)}}):
        raise HTTPException(status_code=400, detail="Username already taken")

    res = users_collection.update_one({"_id": ObjectId(uid)}, {"$set": {"username": newname}})
    if res.modified_count:
        return {"message": "Username updated successfully", "username": newname}
    return {"message": "No changes made"}


@router.put("/settings/password")
def change_password(payload: PasswordPayload, request: Request):
    user = get_current_user(request)
    uid = user.get("sub")

    doc = users_collection.find_one({"_id": ObjectId(uid)})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")

    stored = doc.get("password_hash")
    if isinstance(stored, str):
        stored = stored.encode("utf-8")

    if not bcrypt.checkpw(payload.old_password.encode("utf-8"), stored):
        raise HTTPException(status_code=401, detail="Old password is incorrect")

    new_hash = bcrypt.hashpw(payload.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    users_collection.update_one({"_id": ObjectId(uid)}, {"$set": {"password_hash": new_hash}})
    return {"message": "Password changed successfully"}
