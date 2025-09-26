from fastapi import APIRouter, Depends
from auth.routes import get_current_user
from auth import models, schemas

router = APIRouter(prefix="/api", tags=["profile"])

@router.get("/profile", response_model=schemas.UserOut)
def read_profile(current_user: models.User = Depends(get_current_user)):
    return current_user
