from sqlalchemy.orm import Session
from models import Store
from schemas import StoreCreate, StoreUpdate
from fastapi import HTTPException


def get_all_stores(db: Session):
    return db.query(Store).all()


def get_store_by_id(db: Session, store_id: int):
    return db.query(Store).filter(Store.store_id == store_id).first()


def get_store_by_address(db: Session, address: str):
    return db.query(Store).filter(Store.address == address).first()


def create_store(db: Session, store: StoreCreate):
    existing_store = get_store_by_address(db, store.address)
    if existing_store:
        raise HTTPException(status_code=400, detail="Store already exists")
    db_store = Store(**store.model_dump())
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store


def update_store(db: Session, store_id: int, store: StoreUpdate):
    db_store = get_store_by_id(db, store_id)
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")

    if store.address:
        db_store.address = store.address
    db.commit()
    db.refresh(db_store)
    return db_store


def delete_store(db: Session, store_id: int):
    db_store = get_store_by_id(db, store_id)
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")

    db.delete(db_store)
    db.commit()
    return db_store
