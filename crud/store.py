from sqlalchemy.orm import Session
from models import Store
from schemas import StoreCreate, StoreUpdate


def create_store(db: Session, store: StoreCreate) -> Store:
    db_store = Store(**store.model_dump())
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store


def get_all_stores(db: Session, skip: int = 0, limit: int = 15, search: str = ''):
    query = db.query(Store)
    if search:
        query = query.filter(Store.address.ilike(f'%{search}%'))
    return query.offset(skip).limit(limit).all()


def get_store_by_id(db: Session, store_id: int) -> Store | None:
    return db.query(Store).filter(Store.store_id == store_id).first()


def get_store_by_address(db: Session, address: str) -> Store | None:
    return db.query(Store).filter(Store.address == address).first()


def update_store(db: Session, db_store: Store, store_data: StoreUpdate) -> Store:
    db_store.address = store_data.address
    db.commit()
    db.refresh(db_store)
    return db_store


def delete_store(db: Session, store_id: int) -> bool:
    db_store = get_store_by_id(db, store_id)
    if not db_store:
        return False
    db.delete(db_store)
    db.commit()
    return True
