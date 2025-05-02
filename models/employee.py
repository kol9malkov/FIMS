from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Employee(Base):
    __tablename__ = 'employees'

    employee_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    position = Column(String)
    email = Column(String)
    phone = Column(String)

    user = relationship("User", back_populates="employee", uselist=False)

