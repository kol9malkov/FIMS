from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class Employee(Base):
    __tablename__ = 'employees'

    employee_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)

    user = relationship("User", back_populates="employee", uselist=False)
