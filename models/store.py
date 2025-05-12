from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from database.db import Base


class Store(Base):
    __tablename__ = "stores"

    store_id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False)

    # связи
    stock_items = relationship("Stock", back_populates="store")
    supplies = relationship("Supply", back_populates="store")
    sales = relationship("Sale", back_populates="store")
