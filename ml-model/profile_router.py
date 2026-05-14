from fastapi import APIRouter, HTTPException, Request
from database import get_db, users_collection
from history import history_collection, get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter()


@router.get("/profile")
def get_profile(request: Request):
    user = get_current_user(request)
    uid = user.get("sub")

    try:
        # fetch user document
        doc = users_collection.find_one({"_id": ObjectId(uid)})
        if not doc:
            raise HTTPException(status_code=404, detail="User not found")

        created_at = doc.get("created_at")
        if isinstance(created_at, datetime):
            created_at_iso = created_at.isoformat()
        else:
            created_at_iso = str(created_at)

        total = history_collection.count_documents({"user_id": uid})
        fake = history_collection.count_documents({"user_id": uid, "prediction": "fake"})
        real = history_collection.count_documents({"user_id": uid, "prediction": "real"})

        return {
            "username": doc.get("username"),
            "email": doc.get("email"),
            "created_at": created_at_iso,
            "total_uploads": int(total),
            "fake_count": int(fake),
            "real_count": int(real),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
