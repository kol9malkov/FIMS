from sqlalchemy.orm import Session, joinedload

from models import SupplyItem, Supply
from schemas import SupplyCreate, SupplyItemUpdate, SupplyStatusEnum, StockUpdate, StockCreate
from fastapi import HTTPException
from crud import product as crud_product
from crud import stock as crud_stock


def create_supply(db: Session, supply: SupplyCreate):
    new_supply = Supply(
        store_id=supply.store_id,
        supply_date=supply.supply_date,
        supplier_name=supply.supplier_name
    )
    db.add(new_supply)
    db.flush()  # Получаем supply_id для последующего использования

    for item in supply.supply_items:
        product = crud_product.get_product_by_id(db, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        supply_item = SupplyItem(
            supply_id=new_supply.supply_id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(supply_item)
    db.commit()
    db.refresh(new_supply)
    return new_supply


def get_supply_by_id(db: Session, supply_id: int):
    """ Получение поставки по ID с деталями. """
    supply = db.query(Supply).filter(Supply.supply_id == supply_id).first()
    if not supply:
        raise HTTPException(status_code=404, detail="Supply not found")
    return supply


def get_all_supplies(db: Session):
    return db.query(Supply).options(
        joinedload(Supply.supply_items).joinedload(SupplyItem.product)
    ).all()


def update_supply_item(db: Session, supply_id: int, supply_item_id: int, update_item: SupplyItemUpdate):
    db_supply = get_supply_by_id(db, supply_id)
    item = db.query(SupplyItem).filter(
        SupplyItem.supply_item_id == supply_item_id,
        SupplyItem.supply_id == supply_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Supply not found")

    item.received_quantity = update_item.received_quantity
    item.is_received = update_item.is_received

    if db_supply.status == SupplyStatusEnum.PENDING:
        db_supply.status = SupplyStatusEnum.DELIVERED

    if all(item.is_received for item in db_supply.supply_items):
        db_supply.status = SupplyStatusEnum.ACCEPTED
    elif any(item.is_received for item in db_supply.supply_items):
        db_supply.status = SupplyStatusEnum.PARTIALLY_ACCEPTED

    db.commit()
    db.refresh(db_supply)
    db.refresh(item)
    return item


def close_supply(db: Session, supply_id: int):
    db_supply = get_supply_by_id(db, supply_id)
    if db_supply.status not in [SupplyStatusEnum.ACCEPTED, SupplyStatusEnum.PARTIALLY_ACCEPTED]:
        raise HTTPException(status_code=400, detail="Поставка должна быть принята или принято частично")

    if db_supply.status == SupplyStatusEnum.CLOSED:
        raise HTTPException(status_code=400, detail="Поставка уже закрыта")

    db_supply.status = SupplyStatusEnum.CLOSED

    for item in db_supply.supply_items:
        if item.is_received:
            stock = crud_stock.get_stock_by_product_and_store(db, item.product_id, db_supply.store_id)
            if stock:
                update_data = StockUpdate(quantity=item.received_quantity)
                crud_stock.update_stock(db, stock.stock_id, update_data)
            else:
                new_stock = StockCreate(
                    product_id=item.product_id,
                    store_id=db_supply.store_id,
                    quantity=item.received_quantity,
                    stock_date=db_supply.supply_date
                )
                crud_stock.create_stock(db, new_stock)

    db.commit()
    return db_supply
