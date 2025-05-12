from pydantic import BaseModel


class PaymentMethodCreate(BaseModel):
    method_name: str


class PaymentMethodResponse(BaseModel):
    payment_method_id: int
    method_name: str

    class Config:
        orm_mode = True
