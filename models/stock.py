from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, DATE, DATETIME
from sqlalchemy.orm import relationship
from database.db import Base


class Stock(Base):
    __tablename__ = "stock"

    stock_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.store_id"), nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    stock_date = Column(DATE, default=datetime.now)
    updated_datetime = Column(DATETIME, default=datetime.now, onupdate=datetime.now)

    # связи
    product = relationship("Product", back_populates="stock_items")
    store = relationship("Store", back_populates="stock_items")
