from pydantic import BaseModel
from typing import Optional


class RoleBase(BaseModel):
    role_name: str


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    role_name: Optional[str] = None


class RoleNameResponse(BaseModel):
    role_name: str

    class Config:
        orm_mode = True


class RoleResponse(RoleBase):
    role_id: int

    class Config:
        orm_mode = True
