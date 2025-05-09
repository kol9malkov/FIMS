from pydantic import BaseModel, field_validator
from datetime import date, datetime


class StockBase(BaseModel):
    product_id: int
    store_id: int
    quantity: int
    stock_date: date

    class Config:
        orm_mode = True


class StockCreate(StockBase):
    pass


class StockUpdate(BaseModel):
    quantity: int

    class Config:
        orm_mode = True


class StockResponse(StockBase):
    stock_id: int
    updated_datetime: datetime

    class Config:
        orm_mode = True


class StockSummaryResponse(BaseModel):
    stock_id: int
    product_name: str
    store_address: str
    quantity: int

    class Config:
        orm_mode = True
