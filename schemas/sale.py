from pydantic import BaseModel
from datetime import datetime


# --- Вход ---
class SaleItemByBarcode(BaseModel):
    barcode: str


class PaymentCreate(BaseModel):
    payment_method_id: int
    amount: float


class SaleCreate(BaseModel):
    sale_items: list[SaleItemByBarcode]
    payments: list[PaymentCreate]


# --- Выход ---
class SaleItemResponse(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float

    class Config:
        orm_mode = True


class PaymentResponse(BaseModel):
    payment_id: int
    payment_method: str
    amount: float

    class Config:
        orm_mode = True


class SaleResponse(BaseModel):
    sale_id: int
    sale_datetime: datetime
    total_amount: float
    status: str
    sale_items: list[SaleItemResponse]
    payments: list[PaymentResponse]

    class Config:
        orm_mode = True
