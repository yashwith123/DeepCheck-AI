from fastapi import FastAPI, UploadFile, File, status, Request
import shutil
import sys, os
# Ensure local ml-model folder is importable when running uvicorn from project root
sys.path.insert(0, os.path.dirname(__file__))
# Lazy import predict to avoid importing heavy ML libs at server start
from history import history_collection, get_current_user
import jwt
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
app = FastAPI()
# predict_video will be imported inside endpoint when needed
from auth import router as auth_router
from history import router as history_router
from profile_router import router as profile_router
from settings import router as settings_router

app.include_router(auth_router, prefix="/auth")
app.include_router(history_router, prefix="/history")
app.include_router(profile_router)
app.include_router(settings_router)


@app.post("/predict")
async def predict(request: Request, file: UploadFile = File(...)):

    file_path = "temp.jpg"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        from predict import predict_image
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Model not available: {str(e)}"})

    try:
        label, confidence = predict_image(file_path)
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Prediction failed: {str(e)}"})

    # Try to auto-save history when Authorization header present
    try:
        auth = request.headers.get("Authorization")
        if auth:
            try:
                user_payload = get_current_user(request)
                doc = {
                    "user_id": user_payload.get("sub"),
                    "username": user_payload.get("username"),
                    "filename": file.filename,
                    "file_type": "image",
                    "prediction": label,
                    "confidence": confidence,
                    "created_at": datetime.utcnow(),
                }
                res = history_collection.insert_one(doc)
                print(f"[predict] auto-saved history {res.inserted_id} for {user_payload.get('username')}")
            except Exception as e:
                print("[predict] auto-save failed", str(e))
    except Exception:
        pass

    return {
        "prediction": label,
        "confidence": confidence
    }


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Video endpoint (hyphen) — kept for backward compatibility
@app.post("/predict-video")
async def predict_video_api(request: Request, file: UploadFile = File(...)):
    file_path = file.filename

    with open(file_path, "wb") as f:
        f.write(await file.read())

    try:
        from predict_video import predict_video
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Video model not available: {str(e)}"})

    try:
        label, confidence = predict_video(file_path)
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": str(e)})

    # Try to auto-save history when Authorization header present
    try:
        auth = request.headers.get("Authorization")
        if auth:
            try:
                user_payload = get_current_user(request)
                doc = {
                    "user_id": user_payload.get("sub"),
                    "username": user_payload.get("username"),
                    "filename": file.filename,
                    "file_type": "video",
                    "prediction": label,
                    "confidence": round(confidence, 2),
                    "created_at": datetime.utcnow(),
                }
                res = history_collection.insert_one(doc)
                print(f"[predict_video] auto-saved history {res.inserted_id} for {user_payload.get('username')}")
            except Exception as e:
                print("[predict_video] auto-save failed", str(e))
    except Exception:
        pass

    return {
        "prediction": label,
        "confidence": round(confidence, 2)
    }


# Video endpoint (underscore) — front-end expects this path in some clients
@app.post("/predict_video")
async def predict_video_api_underscore(request: Request, file: UploadFile = File(...)):
    return await predict_video_api(request, file)


# Audio prediction placeholder — not implemented yet
@app.post("/predict_audio")
async def predict_audio_api(file: UploadFile = File(...)):
    return JSONResponse(status_code=status.HTTP_501_NOT_IMPLEMENTED, content={"detail": "Audio prediction not implemented. Use image/video modes."})