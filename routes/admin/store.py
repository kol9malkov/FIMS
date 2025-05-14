from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from dependencies.dependence import admin_required
from schemas import StoreCreate, StoreUpdate, StoreResponse
from crud import store as crud_store
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=StoreResponse)
def create_store(store: StoreCreate, db: Session = Depends(get_db)):
    db_store = crud_store.get_store_by_address(db, address=store.address)
    if db_store:
        raise HTTPException(status_code=409, detail="Магазин уже существует")
    return crud_store.create_store(db, store)


@router.get("/", response_model=list[StoreResponse])
def get_stores(skip: int = 0, limit: int = 15, search: str = '', db: Session = Depends(get_db)):
    return crud_store.get_all_stores(db, skip, limit, search)


@router.get("/id/{store_id}", response_model=StoreResponse)
def get_store(store_id: int, db: Session = Depends(get_db)):
    db_store = crud_store.get_store_by_id(db, store_id)
    if not db_store:
        raise HTTPException(status_code=404, detail="Магазин не найден")
    return db_store


@router.put("/{store_id}", response_model=StoreResponse)
def update_store(store_id: int, store: StoreUpdate, db: Session = Depends(get_db)):
    db_store = crud_store.get_store_by_id(db, store_id)
    if not db_store:
        raise HTTPException(status_code=404, detail="Магазин не найден")
    existing_store = crud_store.get_store_by_address(db, address=store.address)
    if existing_store and existing_store.store_id != store_id:
        raise HTTPException(status_code=409, detail="Магазин с таким адресом уже существует")

    return crud_store.update_store(db, db_store, store)


@router.delete("/{store_id}", status_code=204)
def delete_store(store_id: int, db: Session = Depends(get_db)):
    if not crud_store.delete_store(db, store_id):
        raise HTTPException(status_code=404, detail="Магазин не найден")
