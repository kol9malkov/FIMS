from pydantic import BaseModel


class SupplyAnalyticsResponse(BaseModel):
    total_supplies: int
    total_items: int
    total_cost: float
    supplies_per_store: list[dict]

    class Config:
        orm_mode = True
