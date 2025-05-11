from pydantic import BaseModel, EmailStr
from typing import Optional


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    position: str
    email: EmailStr
    phone: str


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    position: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    employee_id: int

    class Config:
        orm_mode = True
