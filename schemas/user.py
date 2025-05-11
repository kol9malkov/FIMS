from pydantic import BaseModel
from typing import Optional


class UserLogin(BaseModel):
    username: str
    password: str


class UserLoginResponse(BaseModel):
    username: str
    role: str
    access_token: str
    token_type: str = "bearer"

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    employee_id: int
    username: str
    password: str
    role_id: int


class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None


class UserResponse(BaseModel):
    user_id: int
    username: str
    role_name: str


    class Config:
        orm_mode = True
