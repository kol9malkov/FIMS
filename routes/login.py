from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from schemas import UserLoginResponse, UserLogin
from auth import verify_password, create_access_token
import crud.user as crud_user
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
