from sqlalchemy.orm import Session, joinedload
from models import User
from schemas import UserCreate, UserUpdate, UserResponse
from auth import hash_password


def create_user(db: Session, user: UserCreate) -> User:
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
    return db.query(User).get(user_id)


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_all_users(db: Session) -> list[User]:
    return db.query(User).options(joinedload(User.role)).all()


def update_user(db: Session, db_user: User, user_data: UserUpdate) -> User:
    updates = user_data.model_dump(exclude_unset=True)
    for key, value in updates.items():
        if key == "password" and value:
            value = hash_password(value)
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
