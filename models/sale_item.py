from sqlalchemy import ForeignKey, Integer, Float, Column
from sqlalchemy.orm import relationship
from database import Base

class SaleItem(Base):
    __tablename__ = "sale_items"

    sale_item_id = Column(Integer, primary_key=True)
    sale_id = Column(Integer, ForeignKey("sales.sale_id"))
    product_id = Column(Integer, ForeignKey("products.product_id"))
    quantity = Column(Integer)
    price = Column(Float)

    # связи
    sale = relationship("Sale", back_populates="sale_items")
    product = relationship("Product", back_populates="sale_items")