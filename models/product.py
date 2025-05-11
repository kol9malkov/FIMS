from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)
    price = Column(Float, nullable=False)
    barcode = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)

    # связи
    category = relationship("Category", back_populates="products")
    sale_items = relationship("SaleItem", back_populates="product")
    stock_items = relationship("Stock", back_populates="product")
    supply_items = relationship("SupplyItem", back_populates="product")
