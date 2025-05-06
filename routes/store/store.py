from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas import StoreCreate, StoreUpdate, StoreResponse
from crud import store as crud_store
from utils import get_db

router = APIRouter()


@router.post("create", response_model=StoreResponse)
def create_store(store: StoreCreate, db: Session = Depends(get_db)):
    return crud_store.create_store(db, store)


@router.get("/", response_model=list[StoreResponse])
def get_stores(db: Session = Depends(get_db)):
    return crud_store.get_all_stores(db)


@router.get("/{store_id}", response_model=StoreResponse)
def get_store(store_id: int, db: Session = Depends(get_db)):
    return crud_store.get_store_by_id(db, store_id)


@router.put("/{store_id}", response_model=StoreResponse)
def update_store(store_id: int, store: StoreUpdate, db: Session = Depends(get_db)):
    return crud_store.update_store(db, store_id, store)


@router.delete("/{store_id}", response_model=StoreResponse)
def delete_store(store_id: int, db: Session = Depends(get_db)):
    return crud_store.delete_store(db, store_id)
