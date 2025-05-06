from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas import ProductCreate, ProductUpdate, ProductResponse
from crud import product as crud_product
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    return crud_product.create_product(db, product)


@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return crud_product.get_all_products(db)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return crud_product.get_product_by_id(db, product_id)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    return crud_product.update_product(db, product_id, product)


@router.delete("/{product_id}", response_model=ProductResponse)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    return crud_product.delete_product(db, product_id)
