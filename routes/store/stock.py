from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from dependencies.dependence import admin_required, store_required
from schemas import StockCreate, StockUpdate, StockResponse, StockSummaryResponse, StockStoryResponse
from crud import stock as crud_stock
from utils import get_db
from utils.to_things_Response import to_stock_response
from typing import Optional

router = APIRouter()


@router.post("/create", response_model=StockResponse, status_code=201, dependencies=[Depends(store_required)])
def create_stock(stock: StockCreate, db: Session = Depends(get_db)):
    db_stock = crud_stock.get_stock_by_product_and_store(db, stock.product_id, stock.store_id)
    if db_stock:
        raise HTTPException(status_code=400, detail="Товар в магазине уже есть")
    created_stock = crud_stock.create_stock(db, stock)
    return to_stock_response(created_stock)


@router.get("/", response_model=list[StockResponse])
def get_stocks(db: Session = Depends(get_db)):
    stocks = crud_stock.get_all_stocks(db)
    return [to_stock_response(s) for s in stocks]


@router.get("/id/{stock_id}", response_model=StockResponse)
def get_stock(stock_id: int, db: Session = Depends(get_db)):
    db_stock = crud_stock.get_stock_by_id(db, stock_id)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Остатки в данном магазине не найдены")
    return to_stock_response(db_stock)


@router.get("/store/{store_id}", response_model=list[StockStoryResponse])
def get_stock_by_store(store_id: int, db: Session = Depends(get_db)):
    """Получить все остатки товаров в конкретном магазине"""
    db_stocks = crud_stock.get_stock_by_store(db, store_id)
    if not db_stocks:
        raise HTTPException(status_code=404, detail="Остатки в данном магазине не найдены")
    return [
        StockStoryResponse(
            product_name=product.name,
            quantity=stock.quantity,
            updated_datetime=stock.updated_datetime
        )
        for stock, product in db_stocks
    ]


@router.get("/stock-summary", response_model=list[StockSummaryResponse])
def get_stock_summary(
        db: Session = Depends(get_db),
        category_id: Optional[int] = None,
        name_product: Optional[str] = None
):
    db_stocks = crud_stock.get_stock_summary(db, category_id, name_product)
    return [
        StockSummaryResponse(
            stock_id=stock.stock_id,
            product_name=product.name,
            store_address=store.address,
            quantity=stock.quantity
        )
        for stock, product, store in db_stocks
    ]


@router.put("/{stock_id}", response_model=StockResponse)
def update_stock(stock_id: int, stock: StockUpdate, db: Session = Depends(get_db)):
    db_stock = crud_stock.get_stock_by_id(db, stock_id)
    if not db_stock:
        raise HTTPException(404, "Остаток не найден")
    updated_stock = crud_stock.update_stock(db, db_stock, stock)
    return to_stock_response(updated_stock)


@router.delete("/{stock_id}", status_code=204, dependencies=[Depends(admin_required)])
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    if not crud_stock.delete_stock(db, stock_id):
        raise HTTPException(status_code=404, detail="Остатки в данном магазине не найдены")
