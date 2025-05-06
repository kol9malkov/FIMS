from sqlalchemy.orm import Session
from schemas import ProductCreate, ProductUpdate
from fastapi import HTTPException
from models import Product


def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.product_id == product_id).first()


def get_product_by_name(db: Session, name: str):
    return db.query(Product).filter(Product.name == name).first()


def get_all_products(db: Session):
    return db.query(Product).all()


def create_product(db: Session, product: ProductCreate):
    if get_product_by_name(db, product.name):
        raise HTTPException(status_code=400, detail="Product already exists")
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: int, product: ProductUpdate):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in product.model_dump(exclude_unset=True).items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return db_product
