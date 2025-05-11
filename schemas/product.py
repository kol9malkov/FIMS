from pydantic import BaseModel
from typing import Optional


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category_id: int
    barcode: str


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    barcode: Optional[str] = None


class ProductResponse(ProductBase):
    product_id: int
    category_name: str

    class Config:
        orm_mode = True
