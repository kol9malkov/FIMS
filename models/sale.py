from sqlalchemy import Column, ForeignKey, Integer, String, DATETIME, DECIMAL, func
from sqlalchemy.orm import relationship
from database import Base


class Sale(Base):
    __tablename__ = "sales"

    sale_id = Column(Integer, primary_key=True)
    sale_datetime = Column(DATETIME, default=func.now())
    total_amount = Column(DECIMAL(precision=10, scale=2))
    user_id = Column(Integer, ForeignKey("users.user_id"))
    status = Column(String, nullable=False, default="Завершена")  # статус: Завершена
    store_id = Column(Integer, ForeignKey("stores.store_id"))

    # связи
    user = relationship("User", back_populates="sales")
    payments = relationship("Payment", back_populates="sale")
    sale_items = relationship("SaleItem", back_populates="sale")
    store = relationship("Store", back_populates="sales")
