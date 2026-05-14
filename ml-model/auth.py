from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from database import get_db, users_collection
import bcrypt
import os
import jwt
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = os.environ.get("JWT_SECRET") or "change-this-secret"
ALGORITHM = "HS256"


class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup", status_code=201)
def signup(payload: SignupRequest):
    try:
        db = get_db()
        users = users_collection

        # check existing
        if users.find_one({"email": payload.email}):
            raise HTTPException(status_code=400, detail="Email already registered")

        if users.find_one({"username": payload.username}):
            raise HTTPException(status_code=400, detail="Username already taken")

        pw_hash = bcrypt.hashpw(payload.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        user = {
            "username": payload.username,
            "email": payload.email,
            "password_hash": pw_hash,
            "created_at": datetime.utcnow(),
        }

        res = users.insert_one(user)

        return {"id": str(res.inserted_id), "username": payload.username, "email": payload.email}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup failed: {str(e)}")


@router.post("/login")
def login(payload: LoginRequest):
    try:
        db = get_db()
        users = users_collection

        user = users.find_one({"email": payload.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        stored = user.get("password_hash")
        if isinstance(stored, str):
            stored = stored.encode("utf-8")

        if not bcrypt.checkpw(payload.password.encode("utf-8"), stored):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        to_encode = {
            "sub": str(user.get("_id")),
            "username": user.get("username"),
            "exp": datetime.utcnow() + timedelta(hours=24),
        }

        token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

        return {"message": "Login successful", "access_token": token, "username": user.get("username")}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")
