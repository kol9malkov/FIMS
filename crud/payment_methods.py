from sqlalchemy.orm import Session
from models import PaymentMethod
from schemas import PaymentMethodCreate


def create_payment_method(db: Session, payment_method: PaymentMethodCreate) -> PaymentMethod:
    db_payment_method = PaymentMethod(**payment_method.model_dump())
    db.add(db_payment_method)
    db.commit()
    db.refresh(db_payment_method)
    return db_payment_method


def get_all_payment_methods(db: Session):
    return db.query(PaymentMethod).all()


def get_payment_method_by_id(db: Session, payment_method_id: int):
    return db.query(PaymentMethod).get(payment_method_id)


def get_payment_method_by_name(db: Session, payment_method_name: str):
    return db.query(PaymentMethod).get(payment_method_name)
