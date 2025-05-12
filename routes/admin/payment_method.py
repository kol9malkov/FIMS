from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import payment_methods as crud_payment_methods
from schemas import PaymentMethodResponse, PaymentMethodCreate
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=PaymentMethodResponse)
def create_payment_method(payment_method: PaymentMethodCreate, db: Session = Depends(get_db)):
    db_payment_method = crud_payment_methods.get_payment_method_by_name(db, payment_method.method_name)
    if db_payment_method:
        raise HTTPException(status_code=409, detail="Такой метод существует")
    return crud_payment_methods.create_payment_method(db, payment_method)


@router.get("/", response_model=list[PaymentMethodResponse])
def get_payment_methods(db: Session = Depends(get_db)):
    db_payment_method = crud_payment_methods.get_all_payment_methods(db)
    return db_payment_method


@router.get("/id/{id}", response_model=PaymentMethodResponse)
def get_payment_method(payment_method_id: int, db: Session = Depends(get_db)):
    db_payment_method = crud_payment_methods.get_payment_method_by_id(db, payment_method_id)
    if not db_payment_method:
        raise HTTPException(status_code=404, detail="Такого метода не существует")
    return db_payment_method
