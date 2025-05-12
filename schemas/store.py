from pydantic import BaseModel


class StoreBase(BaseModel):
    address: str


class StoreCreate(StoreBase):
    pass


class StoreUpdate(BaseModel):
    address: str


class StoreResponse(StoreBase):
    store_id: int

    class Config:
        orm_mode = True
