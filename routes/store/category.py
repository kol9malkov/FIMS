from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import CategoryCreate, CategoryUpdate, CategoryResponse
from crud import category as crud_category
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud_category.create_category(db, category)


@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return crud_category.get_all_categories(db)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    db_category = crud_category.get_category_by_id(db, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    return crud_category.update_category(db, category_id, category)


@router.delete("/{category_id}", response_model=CategoryResponse)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    return crud_category.delete_category(db, category_id)
