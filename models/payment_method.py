from sqlalchemy import Integer, String, Column
from sqlalchemy.orm import relationship
from database import Base


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    payment_method_id = Column(Integer, primary_key=True)
    method_name = Column(String, unique=True, nullable=False)

    # связи
    payments = relationship("Payment", back_populates="payment_method")
