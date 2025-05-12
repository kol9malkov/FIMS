from datetime import datetime
from sqlalchemy import Column, ForeignKey, Integer, DATETIME, Float, func
from sqlalchemy.orm import relationship
from database import Base


class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True)
    sale_id = Column(Integer, ForeignKey("sales.sale_id"), nullable=False)
    payment_method_id = Column(Integer, ForeignKey("payment_methods.payment_method_id"))
    amount = Column(Float, nullable=False)
    payment_datetime = Column(DATETIME, default=func.now())

    # связи
    sale = relationship("Sale", back_populates="payments")
    payment_method = relationship("PaymentMethod", back_populates="payments")
