from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import UserLoginResponse, UserLogin
from database import SessionLocal
from auth import verify_password, create_access_token
from crud import get_user_by_username
from utils import get_db

router = APIRouter()


@router.post("/login", response_model=UserLoginResponse)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, user_in.username)
    if not db_user or not verify_password(user_in.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": user_in.username})

    return {
        "username": db_user.username,
        "role": db_user.role.role_name,
        "access_token": token,
        "token_type": "bearer"
    }
