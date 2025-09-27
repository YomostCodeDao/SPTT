# backend/main.py
import os
import random
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine
from auth import models as auth_models  # giữ để SQLAlchemy tạo bảng users
from auth.routes import router as auth_router
from routes.profile import router as profile_router
from routes.upload import router as upload_router

# ===================== DB init =====================
Base.metadata.create_all(bind=engine)

app = FastAPI(title="English Practice Backend")

# ===================== CORS =====================
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
if not origins:
    # FE dev (Vite): 5173; Bạn có thể thêm domain khác nếu cần
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",  # dev
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===================== Static: /static -> backend/assets =====================
BASE_DIR = Path(__file__).resolve().parent
ASSETS_DIR = BASE_DIR / "assets"
ASSETS_DIR.mkdir(parents=True, exist_ok=True)  # đảm bảo tồn tại
# cấu trúc mong muốn: backend/assets/levels/A1/*.mp3 ... C2/*.mp3
app.mount("/static", StaticFiles(directory=str(ASSETS_DIR)), name="static")

# ===================== Routers (giữ nguyên) =====================
app.include_router(auth_router)     # /auth/...
app.include_router(profile_router)  # /api/profile
app.include_router(upload_router)   # /api/upload-audio

# ===================== Level APIs (mới, tùy chọn) =====================
@app.get("/api/levels/{level}/random")
def pick_random_level_audio(level: str):
    """
    Trả về 1 file mp3 ngẫu nhiên theo level (A1..C2).
    audio_url là đường dẫn tĩnh để FE fetch: /static/levels/<LV>/<file>.mp3
    """
    lv = level.upper()
    level_dir = ASSETS_DIR / "levels" / lv
    if not level_dir.exists():
        raise HTTPException(status_code=404, detail=f"Level {lv} not found")
    files = [p for p in level_dir.glob("*.mp3")]
    if not files:
        raise HTTPException(status_code=404, detail=f"No audio found in level {lv}")

    pick = random.choice(files)
    rel = pick.relative_to(ASSETS_DIR).as_posix()  # levels/A1/sample.mp3
    return {
        "level": lv,
        "file": pick.name,
        "audio_url": f"/static/{rel}",
    }

@app.get("/")
def root():
    return {"ok": True, "message": "Backend running"}
