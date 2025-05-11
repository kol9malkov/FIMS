from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies.dependence import admin_required, store_required
from schemas import CategoryCreate, CategoryUpdate, CategoryResponse
from crud import category as crud_category
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=CategoryResponse, dependencies=[Depends(admin_required)])
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = crud_category.get_category_by_name(db, category.name)
    if db_category:
        raise HTTPException(status_code=409, detail="Категория уже существует")
    return crud_category.create_category(db, category)


@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return crud_category.get_all_categories(db)


@router.get("/id/{category_id}", response_model=CategoryResponse)
def get_category_by_id(category_id: int, db: Session = Depends(get_db)):
    db_category = crud_category.get_category_by_id(db, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    return db_category


@router.get("/by_name/{category_name}", response_model=CategoryResponse)
def get_category_by_name(category_name: str, db: Session = Depends(get_db)):
    db_category = crud_category.get_category_by_name(db, category_name)
    if not db_category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    return db_category


@router.put("/by-name/{category_name}", response_model=CategoryResponse, dependencies=[Depends(admin_required)])
def update_category(category_name: str, category: CategoryUpdate, db: Session = Depends(get_db)):
    db_category = crud_category.get_category_by_name(db, category_name)
    if not db_category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    return crud_category.update_category(db, db_category, category)


@router.put("/id/{category_id}", response_model=CategoryResponse, dependencies=[Depends(admin_required)])
def update_category_by_id(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    db_category = crud_category.get_category_by_id(db, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    return crud_category.update_category(db, db_category, category)


@router.delete("/id/{category_id}", status_code=204, dependencies=[Depends(admin_required)])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    if not crud_category.delete_category(db, category_id):
        raise HTTPException(status_code=404, detail="Категория не найдена")


@router.delete("/by-name/{category_name}", status_code=204, dependencies=[Depends(admin_required)])
def delete_category_by_name(category_name: str, db: Session = Depends(get_db)):
    category = crud_category.get_category_by_name(db, category_name)
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    crud_category.delete_category(db, category.category_id)
