from sqlalchemy.orm import Session, joinedload
from models import Sale, SaleItem, Payment


def create_sale_record(db: Session, user_id: int, total_amount: float, store_id: int) -> Sale:
    sale = Sale(
        user_id=user_id,
        total_amount=total_amount,
        store_id=store_id
    )
    db.add(sale)
    db.flush()  # получение sale_id
    return sale


def create_sale_item(db: Session, sale_id: int, product_id: int, quantity: int, price: float) -> None:
    sale_item = SaleItem(
        sale_id=sale_id,
        product_id=product_id,
        quantity=quantity,
        price=price
    )
    db.add(sale_item)


def create_payment(db: Session, sale_id: int, payment_method_id: int, amount: float) -> None:
    payment = Payment(
        sale_id=sale_id,
        payment_method_id=payment_method_id,
        amount=amount
    )
    db.add(payment)


def get_sale_with_details(db: Session, sale_id: int) -> Sale | None:
    return db.query(Sale).filter(Sale.sale_id == sale_id).options(
        joinedload(Sale.sale_items).joinedload(SaleItem.product),
        joinedload(Sale.payments).joinedload(Payment.payment_method)
    ).first()


def get_sales_by_store(db: Session, store_id: int):
    return db.query(Sale).filter(Sale.store_id == store_id) \
        .options(
        joinedload(Sale.sale_items).joinedload(SaleItem.product),
        joinedload(Sale.payments).joinedload(Payment.payment_method)
    ).order_by(Sale.sale_datetime.desc()).all()
