from pydantic import BaseModel
from datetime import date
from enum import Enum


class SupplyItemsCreate(BaseModel):
    product_id: int
    quantity: int


class SupplyCreate(BaseModel):
    store_id: int
    supply_date: date
    supplier_name: str
    supply_items: list[SupplyItemsCreate]

    class Config:
        orm_mode = True


class SupplyStatusEnum(str, Enum):
    PENDING = "Ожидается"
    DELIVERED = "Доставлено"
    PARTIALLY_ACCEPTED = "Принято частично"
    ACCEPTED = "Принято"
    CLOSED = "Закрыто"


class SupplyItemUpdate(BaseModel):
    received_quantity: int
    is_received: bool


class SupplyItemsResponse(BaseModel):
    supply_item_id: int
    product_id: int
    quantity: int
    received_quantity: int
    is_received: bool

    class Config:
        orm_mode = True


class SupplyResponse(BaseModel):
    supply_id: int
    store_id: int
    supply_date: date
    supplier_name: str
    status: str = "Ожидается"  # Задаем дефолтное значение для поля status
    supply_items: list[SupplyItemsResponse] = []

    class Config:
        orm_mode = True
