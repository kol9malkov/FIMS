from os.path import exists
from unicodedata import category

from sqlalchemy.orm import Session
from schemas import ProductCreate, ProductUpdate
from models import Product, Category


def create_product(db: Session, product: ProductCreate) -> Product | None:
    db_category = db.query(Category).filter(Category.category_id == product.category_id).first()
    if not db_category:
        return None
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_product_by_id(db: Session, product_id: int) -> Product | None:
    return db.query(Product).filter(Product.product_id == product_id).first()


def get_product_by_name(db: Session, name: str) -> Product | None:
    return db.query(Product).filter(Product.name == name).first()


def get_product_by_barcode(db: Session, barcode: str) -> Product | None:
    return db.query(Product).filter(Product.barcode == barcode).first()


def get_all_products(db: Session):
    return db.query(Product).all()


def update_product(db: Session, db_product: Product, product_data: ProductUpdate):
    data = product_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int) -> bool:
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return False
    db.delete(db_product)
    db.commit()
    return True
