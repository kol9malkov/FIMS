from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class Role(Base):
    __tablename__ = 'roles'

    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(64), unique=True, nullable=False)

    users = relationship('User', back_populates='role')
