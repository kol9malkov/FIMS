from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from models import User
from schemas import UserCreate, UserUpdate
from auth import hash_password


def create_user(db: Session, user: UserCreate) -> User:
    existing_user = get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        password=hashed_password,
        role_id=user.role_id,
        employee_id=user.employee_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.user_id == user_id).first()


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_all_users(db: Session) -> list[User]:
    return db.query(User).options(joinedload(User.role)).all()


def update_user(db: Session, user_id: int, user_data: UserUpdate) -> User | None:
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return None
    for key, value in user_data.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return False
    db.delete(db_user)
    db.commit()
    return True
