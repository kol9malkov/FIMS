from sqlalchemy.orm import Session
from models import Category
from schemas import CategoryCreate, CategoryUpdate


def create_category(db: Session, category: CategoryCreate) -> Category:
    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_all_categories(db: Session, skip: int = 0, limit: int = 15, search: str = ''):
    query = db.query(Category)
    if search:
        query = query.filter(Category.name.ilike(f'%{search}%'))
    return query.offset(skip).limit(limit).all()


def get_category_by_id(db: Session, category_id: int) -> Category | None:
    return db.query(Category).get(category_id)


def get_category_by_name(db: Session, category_name: str) -> Category | None:
    return db.query(Category).filter(Category.name == category_name).first()


def update_category(db: Session, db_category: Category, category_data: CategoryUpdate) -> Category:
    data = category_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int) -> bool:
    db_category = get_category_by_id(db, category_id)
    if not db_category:
        return False

    db.delete(db_category)
    db.commit()
    return True
