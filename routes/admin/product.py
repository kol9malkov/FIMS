from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from dependencies.dependence import admin_required
from schemas import ProductCreate, ProductUpdate, ProductResponse
from crud import product as crud_product
from utils import get_db
from utils.to_things_Response import to_product_response

router = APIRouter()


@router.post("/create", response_model=ProductResponse, dependencies=[Depends(admin_required)])
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = crud_product.get_product_by_barcode(db, product.barcode)
    if db_product:
        raise HTTPException(status_code=409, detail="Продукт уже существует")
    created_product = crud_product.create_product(db, product)
    if created_product is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    return to_product_response(created_product)


@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = crud_product.get_all_products(db)
    return [to_product_response(p) for p in products]


@router.get("/id/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = crud_product.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Продукт не найден")
    return to_product_response(product)


@router.get("/barcode/{barcode}", response_model=ProductResponse)
def get_product_by_barcode(barcode: str, db: Session = Depends(get_db)):
    product = crud_product.get_product_by_barcode(db, barcode)
    if not product:
        raise HTTPException(status_code=404, detail="Продукт не найден")
    return to_product_response(product)


@router.get("/name/{product_name}", response_model=ProductResponse)
def get_product_by_name(product_name: str, db: Session = Depends(get_db)):
    product = crud_product.get_product_by_name(db, product_name)
    if not product:
        raise HTTPException(status_code=404, detail="Продукт не найден")
    return to_product_response(product)


@router.put("/id/{product_id}", response_model=ProductResponse, dependencies=[Depends(admin_required)])
def update_product_by_id(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = crud_product.get_product_by_id(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Продукт не найден")
    updated_product = crud_product.update_product(db, db_product, product)
    return to_product_response(updated_product)


@router.put("/barcode/{barcode}", response_model=ProductResponse, dependencies=[Depends(admin_required)])
def update_product_by_barcode(barcode: str, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = crud_product.get_product_by_barcode(db, barcode)
    if not db_product:
        raise HTTPException(status_code=404, detail="Продукт не найден")
    updated_product = crud_product.update_product(db, db_product, product)
    return to_product_response(updated_product)


@router.delete("/id/{product_id}", status_code=204, dependencies=[Depends(admin_required)])
def delete_product_by_id(product_id: int, db: Session = Depends(get_db)):
    if not crud_product.delete_product(db, product_id):
        raise HTTPException(404, detail="Продукт не найден")


@router.delete("/barcode/{barcode}", status_code=204, dependencies=[Depends(admin_required)])
def delete_product_barcode(barcode: str, db: Session = Depends(get_db)):
    product = crud_product.get_product_by_barcode(db, barcode)
    if not product:
        raise HTTPException(404, detail="Продукт не найден")
    crud_product.delete_product(db, product.product_id)
