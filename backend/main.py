# backend/main.py
import os
import random
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Database
from database import Base, engine
from auth import models as auth_models  # Để SQLAlchemy tự tạo bảng users

# Routers
from auth.routes import router as auth_router
from routes.profile import router as profile_router
from routes.upload import router as upload_router
from routes.placement import router as placement_router

# ===================== Init DB =====================
Base.metadata.create_all(bind=engine)

# ===================== FastAPI App =====================
app = FastAPI(title="English Practice Backend")

# ===================== CORS =====================
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
if not origins:
    # FE dev: Vite (5173), React dev (3000)
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",  # dev fallback
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== Static Files =====================
BASE_DIR = Path(__file__).resolve().parent
ASSETS_DIR = BASE_DIR / "assets"
ASSETS_DIR.mkdir(parents=True, exist_ok=True)

# Map URL /static -> backend/assets
# Ví dụ: backend/assets/levels/A1/file.mp3 => http://127.0.0.1:3000/static/levels/A1/file.mp3
app.mount("/static", StaticFiles(directory=str(ASSETS_DIR)), name="static")

# ===================== Include Routers =====================
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(profile_router, prefix="/api/profile", tags=["Profile"])
app.include_router(upload_router, prefix="/api/upload", tags=["Upload"])
app.include_router(placement_router)  # prefix đã khai báo trong placement.py

# ===================== Level APIs =====================
@app.get("/api/levels/{level}/random")
def pick_random_level_audio(level: str):
    """
    Trả về 1 file mp3 ngẫu nhiên theo level (A1..C2).
    audio_url: FE fetch từ /static/levels/<LV>/<file>.mp3
    """
    lv = level.upper()
    level_dir = ASSETS_DIR / "levels" / lv
    if not level_dir.exists():
        raise HTTPException(status_code=404, detail=f"Level {lv} not found")
    files = [p for p in level_dir.glob("*.mp3")]
    if not files:
        raise HTTPException(status_code=404, detail=f"No audio found in level {lv}")

    pick = random.choice(files)
    rel = pick.relative_to(ASSETS_DIR).as_posix()  # ví dụ: levels/A1/sample.mp3
    return {
        "level": lv,
        "file": pick.name,
        "audio_url": f"/static/{rel}",
    }

# ===================== Root =====================
@app.get("/")
def root():
    return {"ok": True, "message": "Backend running 🚀"}
