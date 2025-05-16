from pydantic import BaseModel
from datetime import datetime


# --- Вход ---
class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float


class PaymentCreate(BaseModel):
    payment_method_id: int
    amount: float


class SaleCreate(BaseModel):
    sale_items: list[SaleItemCreate]
    payments: list[PaymentCreate]


class SaleSummary(BaseModel):
    sale_id: int
    datetime: datetime
    amount: float
    payment_method: str

    class Config:
        orm_mode = True


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


class SummaryResponse(BaseModel):
    date: str
    total_cash: float
    total_card: float
    sales: list[SaleSummary]
