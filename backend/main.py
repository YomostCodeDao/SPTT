import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from auth import models as auth_models
from auth.routes import router as auth_router
from routes.profile import router as profile_router
from routes.upload import router as upload_router


# Khởi tạo DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title="English Practice Backend")

# CORS
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
if not origins:
    origins = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]  # dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)     # /api/register, /api/login
app.include_router(profile_router)  # /api/profile
app.include_router(upload_router)   # /api/upload-audio

@app.get("/")
def root():
    return {"ok": True, "message": "Backend running"}
