from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Category
from schemas import CategoryCreate, CategoryUpdate


def create_category(db: Session, category: CategoryCreate):
    existing_category = get_category_by_name(db, category.name)
    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists")

    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_all_categories(db: Session):
    return db.query(Category).all()


def get_category_by_id(db: Session, category_id: int):
    return db.query(Category).filter(Category.category_id == category_id).first()


def get_category_by_name(db: Session, category_name: str):
    return db.query(Category).filter(Category.name == category_name).first()


def update_category(db: Session, category_id: int, category: CategoryUpdate):
    db_category = get_category_by_id(db, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    for key, value in category.model_dump(exclude_unset=True).items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int):
    db_category = get_category_by_id(db, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(db_category)
    db.commit()
    return db_category
