from datetime import date
from typing import Optional

from pydantic import BaseModel


class StoreAnalytics(BaseModel):
    store_id: int
    store_address: str
    count: int
    total_items: int
    total_cost: float


class SupplyAnalyticsResponse(BaseModel):
    total_supplies: int
    total_items: int
    total_cost: float
    supplies_per_store: list[StoreAnalytics]


class StoreSalesAnalytics(BaseModel):
    store_id: int
    store_address: str
    count: int
    total_amount: float


class TopProduct(BaseModel):
    product_id: int
    name: str
    total_sold: int


class PaymentStats(BaseModel):
    method_name: str
    total_amount: float


class SalesAnalyticsResponse(BaseModel):
    total_sales: int
    total_amount: float
    average_check: float
    sales_per_store: list[StoreSalesAnalytics]
    top_product: Optional[TopProduct]
    payments_stats: list[PaymentStats]
