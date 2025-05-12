from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from schemas import UserLoginResponse
from auth import verify_password, create_access_token, get_current_user
import crud.user as crud_user
from models import User
from utils import get_db

router = APIRouter()


@router.post("/login", response_model=UserLoginResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = crud_user.get_user_by_username(db, form_data.username)
    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": str(db_user.user_id)})

    return {
        "username": db_user.username,
        "role": db_user.role.role_name,
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/verify-token")
async def verify_token(current_user: User = Depends(get_current_user)):
    return {
        "status": "valid",
        "user": {
            "username": current_user.username,
            "role": current_user.role.role_name
        }
    }
