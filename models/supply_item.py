from sqlalchemy import Column, ForeignKey, Integer, Float
from sqlalchemy.orm import relationship
from database import Base


class SupplyItem(Base):
    __tablename__ = "supply_items"

    supply_item_id = Column(Integer, primary_key=True)
    supply_id = Column(Integer, ForeignKey("supplies.supply_id"))
    product_id = Column(Integer, ForeignKey("products.product_id"))
    quantity = Column(Integer)
    purchase_price = Column(Float)

    # связи
    supply = relationship("Supply", back_populates="supply_items")
    product = relationship("Product", back_populates="supply_items")