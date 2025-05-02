from sqlalchemy import Column, ForeignKey, Integer, String, DATE
from sqlalchemy.orm import relationship
from database import Base


class Supply(Base):
    __tablename__ = "supplies"

    supply_id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.store_id"), nullable=False)
    supply_date = Column(DATE, nullable=False)
    supplier_name = Column(String, nullable=False)

    # связи
    store = relationship("Store", back_populates="supplies")
    supply_items = relationship("SupplyItem", back_populates="supply")
