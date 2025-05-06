from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud.user as crud_user
from schemas import UserCreate, UserUpdate, UserResponse
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=UserResponse)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = crud_user.get_user_by_username(db, user_in.username)
    if db_user:
        raise HTTPException(status_code=409, detail="User already exists")
    return crud_user.create_user(db, user_in)


@router.get("/", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    return crud_user.get_all_users(db)


@router.get("/id/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    return crud_user.get_user_by_id(db, user_id)


@router.get("/username/{username}", response_model=UserResponse)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    return crud_user.get_user_by_username(db, username)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db)):
    db_user = crud_user.update_user(db, user_id, user_in)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud_user.delete_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}
