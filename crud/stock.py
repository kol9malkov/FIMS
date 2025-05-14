from sqlalchemy.orm import Session, joinedload
from models import Stock, Product, Store
from schemas import StockCreate, StockUpdate
from typing import Optional
from sqlalchemy import or_


def create_stock(db: Session, stock: StockCreate) -> Stock:
    db_stock = Stock(
        product_id=stock.product_id,
        store_id=stock.store_id,
        quantity=stock.quantity,
    )
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock


def get_stock_by_id(db: Session, stock_id: int, ) -> Stock | None:
    return db.query(Stock).filter(Stock.stock_id == stock_id).first()


def get_all_stocks(db: Session, skip: int = 0, limit: int = 15, search: str = ''):
    query = (
        db.query(Stock)
        .join(Product)
        .join(Store)
        .options(joinedload(Stock.product), joinedload(Stock.store))
    )

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Store.address.ilike(f"%{search}%")
            )
        )

    return query.offset(skip).limit(limit).all()


def get_stock_by_product_and_store(db: Session, product_id: int, store_id: int) -> Stock | None:
    return db.query(Stock).filter(Stock.product_id == product_id, Stock.store_id == store_id).first()


def get_stock_by_store(db: Session, store_id: int, skip: int = 0, limit: int = 15, search: str = ''):
    """Получаем все остатки товаров в указанном магазине с адресом магазина"""
    query = (
        db.query(Stock)
        .join(Product)
        .join(Store)
        .filter(Stock.store_id == store_id)
        .options(joinedload(Stock.product), joinedload(Stock.store))
    )

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Store.address.ilike(f"%{search}%")
            )
        )

    return query.order_by(Stock.updated_datetime.desc()).offset(skip).limit(limit).all()


def get_stock_summary(db: Session, category_id: Optional[int] = None, name_product: Optional[str] = None):
    query = (
        db.query(Stock, Product, Store)
        .join(Product, Product.product_id == Stock.product_id)
        .join(Store, Stock.store_id == Store.store_id)
    )

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if name_product:
        query = query.filter(Product.name.ilike(f"%{name_product}%"))
    return query.all()


def update_stock(db: Session, db_stock: Stock, stock_update: StockUpdate) -> Stock:
    db_stock.quantity += stock_update.quantity
    db.commit()
    db.refresh(db_stock)
    return db_stock


def delete_stock(db: Session, stock_id: int) -> bool:
    db_stock = get_stock_by_id(db, stock_id)
    if not db_stock:
        return False
    db.delete(db_stock)
    db.commit()
    return True
