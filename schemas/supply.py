from decimal import Decimal
from pydantic import BaseModel
from datetime import date
from enum import Enum


class SupplyItemsCreate(BaseModel):
    product_id: int
    quantity: int
    price: Decimal


class SupplyCreate(BaseModel):
    store_id: int
    supply_date: date
    supplier_name: str
    supply_items: list[SupplyItemsCreate]


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
    product_name: str
    quantity: int
    received_quantity: int
    is_received: bool

    class Config:
        orm_mode = True


class SupplyResponse(BaseModel):
    supply_id: int
    store_id: int
    store_name: str
    supply_date: date
    supplier_name: str
    status: SupplyStatusEnum = SupplyStatusEnum.PENDING
    supply_items: list[SupplyItemsResponse] = []

    class Config:
        orm_mode = True
