from sqlalchemy.orm import Session
from models import Stock, Product, Store
from schemas import StockCreate, StockUpdate
from fastapi import HTTPException
from typing import Optional


def create_stock(db: Session, stock: StockCreate) -> Stock:
    existing_stock = get_stock_by_product_and_store(db, stock.product_id, stock.store_id)
    if existing_stock:
        raise HTTPException(status_code=400, detail="Stock already exists")
    db_stock = Stock(
        product_id=stock.product_id,
        store_id=stock.store_id,
        quantity=stock.quantity,
        stock_date=stock.stock_date,
    )
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock


def get_stock_by_id(db: Session, stock_id: int, ) -> Stock | None:
    return db.query(Stock).filter(Stock.stock_id == stock_id).first()


def get_all_stocks(db: Session):
    return db.query(Stock).all()


def get_stock_by_product_and_store(db: Session, product_id: int, store_id: int):
    return db.query(Stock).filter(Stock.product_id == product_id, Stock.store_id == store_id).first()


def get_stock_by_store(db: Session, store_id: int):
    """Получаем все остатки товаров в указанном магазине с адресом магазина"""
    stocks = (
        db.query(Stock, Product)
        .join(Product, Stock.product_id == Product.product_id)
        .filter(Stock.store_id == store_id)
        .order_by(Stock.updated_datetime.desc())  # Сортируем по дате обновления
        .all()
    )

    return [
        {
            "product_name": product.name,
            "quantity": stock.quantity,
            "updated_datetime": stock.updated_datetime,
        }
        for stock, product in stocks
    ]


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
    results = query.all()
    return [
        {
            "stock_id": stock.stock_id,
            "product_name": product.name,
            "store_address": store.address,
            "quantity": stock.quantity,
        }
        for stock, product, store in results
    ]


def update_stock(db: Session, stock_id: int, stock: StockUpdate) -> Stock:
    db_stock = get_stock_by_id(db, stock_id)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    db_stock.quantity = db_stock.quantity + stock.quantity
    db.commit()
    db.refresh(db_stock)
    return db_stock


def delete_stock(db: Session, stock_id: int):
    db_stock = get_stock_by_id(db, stock_id)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    db.delete(db_stock)
    db.commit()
    return db_stock
