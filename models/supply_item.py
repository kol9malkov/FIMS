from sqlalchemy import Column, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Numeric


class SupplyItem(Base):
    __tablename__ = "supply_items"

    supply_item_id = Column(Integer, primary_key=True)
    supply_id = Column(Integer, ForeignKey("supplies.supply_id"))
    product_id = Column(Integer, ForeignKey("products.product_id"))
    quantity = Column(Integer)
    received_quantity = Column(Integer, default=0)
    is_received = Column(Boolean, default=False)
    price = Column(Numeric(10, 2), nullable=False)

    # связи
    supply = relationship("Supply", back_populates="supply_items")
    product = relationship("Product", back_populates="supply_items")
