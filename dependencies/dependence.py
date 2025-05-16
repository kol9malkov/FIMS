from fastapi import Depends, HTTPException, Header

from auth.auth import get_current_user
from models import User


def admin_required(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role.role_name != "Администратор":
        raise HTTPException(status_code=403, detail="Доступ закрыт, обратитесь к администратору")
    return current_user


def store_required(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role.role_name not in ["Администратор", "Склад"]:
        raise HTTPException(status_code=403, detail="Доступ закрыт, обратитесь к администратору")
    return current_user


def sale_required(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role.role_name not in ["Кассир", "Администратор"]:
        raise HTTPException(status_code=403, detail="Доступ закрыт, обратитесь к администратору")
    return current_user


def all_roles_required(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role.role_name not in ["Администратор", "Склад", "Кассир"]:
        raise HTTPException(status_code=403, detail="Доступ закрыт, обратитесь к администратору")
    return current_user


def get_store_id(x_store_id: int = Header(...)) -> int:
    if not x_store_id:
        raise HTTPException(status_code=400, detail="Store id требуется указать в X-Store-ID header")
    return x_store_id
