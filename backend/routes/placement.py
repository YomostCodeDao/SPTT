# backend/routes/placement.py
import random
import difflib
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
BANK_AUDIO_DIR = BASE_DIR / "assets" / "bank-audio"

router = APIRouter(prefix="/api/placement", tags=["Placement Test"])


class PlacementAnswer(BaseModel):
    file: str
    user_answer: str


def calculate_score(user_answer: str, correct_answer: str) -> float:
    """So sánh câu trả lời của user với đáp án chuẩn."""
    ratio = difflib.SequenceMatcher(
        None,
        user_answer.strip().lower(),
        correct_answer.strip().lower()
    ).ratio()
    return round(ratio * 100, 2)


def suggest_level(score: float) -> str:
    """Mapping điểm % → Level CEFR"""
    if score >= 90:
        return "C2"
    elif score >= 80:
        return "C1"
    elif score >= 70:
        return "B2"
    elif score >= 60:
        return "B1"
    elif score >= 50:
        return "A2"
    elif score >= 40:
        return "A1"
    else:
        return "Below A1"


@router.get("/random")
def get_random_test():
    """Lấy 1 file mp3 ngẫu nhiên từ bank-audio"""
    if not BANK_AUDIO_DIR.exists():
        raise HTTPException(status_code=404, detail="bank-audio folder not found")

    files = list(BANK_AUDIO_DIR.glob("*.mp3"))
    if not files:
        raise HTTPException(status_code=404, detail="No audio found in bank-audio")

    pick = random.choice(files)
    return {
        "file": pick.name,
        "audio_url": f"/static/bank-audio/{pick.name}"
    }


@router.post("/submit")
def submit_answer(data: PlacementAnswer):
    """
    Nhận câu trả lời của user, chấm điểm, trả về gợi ý level CEFR.
    """
    answers = {
        "test1.mp3": "Hello world",
        "test2.mp3": "Good morning",
        "test3.mp3": "How are you",
    }

    key = data.file
    if key not in answers:
        raise HTTPException(status_code=404, detail=f"No answer for {key}")

    correct_answer = answers[key]
    score = calculate_score(data.user_answer, correct_answer)
    suggested = suggest_level(score)

    return {
        "file": key,
        "user_answer": data.user_answer,
        "correct_answer": correct_answer,
        "score": score,
        "suggested_level": suggested
    }
