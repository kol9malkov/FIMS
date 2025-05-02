from pydantic import BaseModel


class UserLogin(BaseModel):
    username: str
    password: str

    class Config:
        orm_mode = True


class UserLoginResponse(BaseModel):
    username: str
    role: str
    access_token: str
    token_type: str = "bearer"

    class Config:
        orm_mode = True
