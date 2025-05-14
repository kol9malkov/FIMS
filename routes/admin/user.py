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
        raise HTTPException(status_code=409, detail="Пользователь уже существует")
    created_user = crud_user.create_user(db, user_in)
    return UserResponse(
        user_id=created_user.user_id,
        username=created_user.username,
        role_name=created_user.role.role_name
    )


@router.get("/", response_model=list[UserResponse])
def get_all_users(skip: int = 0, limit: int = 15, search: str = '', db: Session = Depends(get_db)):
    users = crud_user.get_all_users(db, skip=skip, limit=limit, search=search)
    return [
        UserResponse(
            user_id=user.user_id,
            username=user.username,
            role_name=user.role.role_name
        )
        for user in users
    ]


@router.get("/id/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_id(db, user_id)
    return UserResponse(
        user_id=user.user_id,
        username=user.username,
        role_name=user.role.role_name
    )


@router.get("/username/{username}", response_model=UserResponse)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_username(db, username)
    return UserResponse(
        user_id=user.user_id,
        username=user.username,
        role_name=user.role.role_name
    )


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db)):
    db_user = crud_user.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    updated_user = crud_user.update_user(db, db_user, user_in)
    return UserResponse(
        user_id=updated_user.user_id,
        username=updated_user.username,
        role_name=updated_user.role.role_name
    )


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud_user.delete_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
