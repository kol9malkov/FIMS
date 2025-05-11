from pydantic import BaseModel
from typing import Optional


class RoleBase(BaseModel):
    role_name: str


class RoleCreate(RoleBase):
    pass


class RoleResponse(RoleBase):
    role_id: int

    class Config:
        orm_mode = True
