from datetime import datetime

from sqlalchemy import Column, ForeignKey, Integer, String, DATETIME
from sqlalchemy.orm import relationship
from database import Base

class Sale(Base):
    __tablename__ = "sales"

    sale_id = Column(Integer, primary_key=True)
    sale_datetime = Column(DATETIME, default=datetime.now)
    total_amount = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    status = Column(String, nullable=False, default="Завершена") # статус: Завершена

    # связи
    user = relationship("User", back_populates="sales")
    payments = relationship("Payment", back_populates="sale")
    sale_items = relationship("SaleItem", back_populates="sale")
