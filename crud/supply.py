from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload
from models import SupplyItem, Supply, Store
from schemas import SupplyCreate, SupplyItemUpdate, SupplyStatusEnum, StockUpdate, StockCreate
from crud import product as crud_product
from crud import stock as crud_stock


def existing_supply(db: Session, supply: SupplyCreate) -> Supply | None:
    # Ищем существующую поставку по store_id, supply_date и supplier_name
    return db.query(Supply).filter(
        Supply.store_id == supply.store_id,
        Supply.supply_date == supply.supply_date,
        Supply.supplier_name == supply.supplier_name
    ).first()  # Должен вернуть найденную поставку или None, если не найдена.


def create_supply(db: Session, supply: SupplyCreate) -> Supply | None:
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
            return None

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
    return db.query(Supply).filter(Supply.supply_id == supply_id).first()


def get_all_supplies(db: Session, skip: int = 0, limit: int = 20, search: str = ''):
    query = (
        db.query(Supply)
        .join(Store, Supply.store_id == Store.store_id)
        .options(
            joinedload(Supply.supply_items).joinedload(SupplyItem.product),
            joinedload(Supply.store)
        )
    )

    if search:
        query = query.filter(
            or_(
                Supply.supplier_name.ilike(f'%{search}%'),
                Store.address.ilike(f'%{search}%'),
                Supply.status.ilike(f'%{search}%')
            )
        )

    return query.order_by(Supply.supply_date.desc()).offset(skip).limit(limit).all()


def update_supply_item(db: Session, db_supply: Supply, supply_item_id: int, update_item: SupplyItemUpdate):
    item = next((i for i in db_supply.supply_items if i.supply_item_id == supply_item_id), None)
    if not item:
        return None

    item.received_quantity = update_item.received_quantity
    item.is_received = update_item.is_received
    # Обновления статуса поставки
    if db_supply.status == SupplyStatusEnum.PENDING:
        db_supply.status = SupplyStatusEnum.DELIVERED

    if all(i.is_received for i in db_supply.supply_items):
        db_supply.status = SupplyStatusEnum.ACCEPTED
    elif any(i.is_received for i in db_supply.supply_items):
        db_supply.status = SupplyStatusEnum.PARTIALLY_ACCEPTED

    db.commit()
    db.refresh(item)
    return item


def close_supply(db: Session, db_supply: Supply) -> Supply | None:
    if db_supply.status not in [SupplyStatusEnum.ACCEPTED, SupplyStatusEnum.PARTIALLY_ACCEPTED]:
        return None
    if db_supply.status == SupplyStatusEnum.CLOSED:
        return None

    db_supply.status = SupplyStatusEnum.CLOSED

    # Обновляем складские остатки для каждого товара в поставке
    for item in db_supply.supply_items:
        if item.is_received:
            stock = crud_stock.get_stock_by_product_and_store(db, item.product_id, db_supply.store_id)
            if stock:
                # Если товар уже есть на складе, обновляем его количество
                update_data = StockUpdate(quantity=item.received_quantity)
                crud_stock.update_stock(db, stock, update_data)
            else:
                # Если товара нет на складе, создаем новый
                new_stock = StockCreate(
                    product_id=item.product_id,
                    store_id=db_supply.store_id,
                    quantity=item.received_quantity,
                )
                crud_stock.create_stock(db, new_stock)
    db.commit()
    return db_supply
