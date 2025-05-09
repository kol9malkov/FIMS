from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey('employees.employee_id'))
    username = Column(String, unique=True)
    password = Column(String)
    role_id = Column(Integer, ForeignKey('roles.role_id'))

    # связи
    employee = relationship("Employee", back_populates="user")
    role = relationship("Role", back_populates="users")
    sales = relationship("Sale", back_populates="user")


