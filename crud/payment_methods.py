from sqlalchemy.orm import Session
from models import PaymentMethod
from schemas import PaymentMethodCreate, PaymentMethodUpdate


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


def update_payment(db: Session, db_payment: PaymentMethod, payment_data: PaymentMethodUpdate) -> PaymentMethod:
    data = payment_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_payment, key, value)
    db.commit()
    db.refresh(db_payment)
    return db_payment


def delete_payment(db: Session, payment_id: int) -> bool:
    payment = get_payment_method_by_id(db, payment_id)
    if not payment:
        return False
    db.delete(payment)
    db.commit()
    return True
