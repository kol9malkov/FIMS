from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas import StockCreate, StockUpdate, StockResponse, StockSummaryResponse
from crud import stock as crud_stock
from utils import get_db
from typing import Optional

router = APIRouter()


@router.post("/create", response_model=StockResponse, status_code=201)
def create_product(stock: StockCreate, db: Session = Depends(get_db)):
    return crud_stock.create_stock(db, stock)


@router.get("/", response_model=list[StockResponse])
def get_products(db: Session = Depends(get_db)):
    return crud_stock.get_all_stocks(db)


@router.get("/{stock_id}", response_model=StockResponse)
def get_product(stock_id: int, db: Session = Depends(get_db)):
    return crud_stock.get_stock_by_id(db, stock_id)


@router.get("stock-summary", response_model=list[StockSummaryResponse])
def get_stock_summary(
        db: Session = Depends(get_db),
        category_id: Optional[int] = None,
        name_product: Optional[str] = None
):
    return crud_stock.get_stock_summary(db, category_id, name_product)


@router.put("/{stock_id}", response_model=StockResponse)
def update_product(stock_id: int, stock: StockUpdate, db: Session = Depends(get_db)):
    return crud_stock.update_stock(db, stock_id, stock)


@router.delete("/{stock_id}", response_model=StockResponse)
def delete_product(stock_id: int, db: Session = Depends(get_db)):
    return crud_stock.delete_stock(db, stock_id)
