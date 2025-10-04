# backend/routes/upload.py
import os, tempfile
from typing import Optional
from faster_whisper import WhisperModel
from fastapi import APIRouter, File, UploadFile, HTTPException

WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL", "base")
_model: WhisperModel | None = None

def get_model() -> WhisperModel:
    global _model
    if _model is None:
        _model = WhisperModel(WHISPER_MODEL_NAME, device="cpu", compute_type="int8")
    return _model

# ❌ Đừng prefix /api ở đây nữa
router = APIRouter(tags=["Upload"])

@router.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...), language: Optional[str] = None):
    try:
        suffix = os.path.splitext(file.filename or "")[-1] or ".tmp"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp_path = tmp.name
            tmp.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cannot save temp file: {e}")

    try:
        model = get_model()
        segments_iter, info = model.transcribe(
            tmp_path, language=language, beam_size=5, vad_filter=True
        )

        segments, texts = [], []
        for i, seg in enumerate(segments_iter):
            segments.append({
                "id": i,
                "start": float(seg.start or 0.0),
                "end": float(seg.end or 0.0),
                "text": seg.text.strip(),
            })
            texts.append(seg.text.strip())

        return {
            "text": " ".join(texts).strip(),
            "segments": segments,
            "language": getattr(info, "language", None),
            "language_probability": getattr(info, "language_probability", None),
            "used_model": WHISPER_MODEL_NAME,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcribe error: {e}")
    finally:
        try: os.remove(tmp_path)
        except: pass
