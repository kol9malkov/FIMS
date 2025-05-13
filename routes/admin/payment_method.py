from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import payment_methods as crud_payment_methods
from schemas import PaymentMethodResponse, PaymentMethodCreate, PaymentMethodUpdate
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


@router.get("/id/{payment_id}", response_model=PaymentMethodResponse)
def get_payment_method(payment_method_id: int, db: Session = Depends(get_db)):
    db_payment_method = crud_payment_methods.get_payment_method_by_id(db, payment_method_id)
    if not db_payment_method:
        raise HTTPException(status_code=404, detail="Такого метода не существует")
    return db_payment_method


@router.put("/{payment_id}", response_model=PaymentMethodResponse)
def update_payment(payment_id: int, payment: PaymentMethodUpdate, db: Session = Depends(get_db)):
    db_payment = crud_payment_methods.get_payment_method_by_id(db, payment_id)
    if not db_payment:
        raise HTTPException(status_code=404, detail="Способ оплаты не найден")
    existing = crud_payment_methods.get_payment_method_by_name(db, payment.method_name)
    if existing and existing.payment_method_id != payment_id:
        raise HTTPException(status_code=409, detail="Способ оплаты с таким именем уже существует")
    return crud_payment_methods.update_payment(db, db_payment, payment)


@router.delete("/{payment_id}", status_code=204)
def delete_payment_by_id(payment_id: int, db: Session = Depends(get_db)):
    if not crud_payment_methods.delete_payment(db, payment_id):
        raise HTTPException(status_code=404, detail="Способ оплаты не найден")
