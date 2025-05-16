from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import supply as crud_supply
from dependencies.dependence import admin_required, get_store_id, store_required
from utils import get_db
from utils.to_things_Response import to_supply_response, to_supply_item_response
from schemas import SupplyCreate, SupplyResponse, SupplyItemUpdate, SupplyItemsResponse, SupplyStatusEnum

router = APIRouter()


@router.post("/create", response_model=SupplyResponse, dependencies=[Depends(store_required)])
def create_supply(supply: SupplyCreate, db: Session = Depends(get_db), store_id: int = Depends(get_store_id)):
    # Защита: создание только в рамках текущего магазина
    if supply.store_id != store_id:
        raise HTTPException(status_code=403, detail="Вы не можете создать поставку в другой магазин")

    db_supply = crud_supply.existing_supply(db, supply)
    if db_supply:
        # Сравниваем товары в уже существующей поставке и новой
        existing_items = sorted(
            [(item.product_id, item.quantity) for item in db_supply.supply_items],
            key=lambda x: x[0]  # Сортируем по product_id
        )
        new_items = sorted(
            [(item.product_id, item.quantity) for item in supply.supply_items],
            key=lambda x: x[0]
        )

        if existing_items == new_items:
            raise HTTPException(status_code=400, detail="Дублирующаяся поставка")

    new_supply = crud_supply.create_supply(db, supply)
    if not new_supply:
        raise HTTPException(status_code=404, detail="Продукты не найдены")
    return to_supply_response(new_supply)


@router.get("/", response_model=list[SupplyResponse], dependencies=[Depends(store_required)])
def get_supplies(
        skip: int = 0,
        limit: int = 15,
        search: str = '',
        status: str | None = None,
        db: Session = Depends(get_db),
        store_id: int = Depends(get_store_id),
):
    db_supplies = crud_supply.get_all_supplies(db, skip, limit, search, status, store_id)
    return [to_supply_response(s) for s in db_supplies]


@router.get("/id/{supply_id}", response_model=SupplyResponse, dependencies=[Depends(store_required)])
def get_supply(
        supply_id: int,
        db: Session = Depends(get_db),
        store_id: int = Depends(get_store_id)
):
    db_supply = crud_supply.get_supply_by_id(db, supply_id)
    if not db_supply or db_supply.store_id != store_id:
        raise HTTPException(status_code=404, detail="Поставка не найдена")

    return to_supply_response(db_supply)


@router.post("/{supply_id}/deliver", response_model=SupplyResponse, dependencies=[Depends(store_required)])
def deliver_supply(
        supply_id: int,
        db: Session = Depends(get_db),
        store_id: int = Depends(get_store_id)
):
    db_supply = crud_supply.get_supply_by_id(db, supply_id)
    if not db_supply or db_supply.store_id != store_id:
        raise HTTPException(status_code=404, detail="Поставка не найдена")
    if db_supply.status != SupplyStatusEnum.PENDING:
        raise HTTPException(status_code=400, detail="Поставка уже доставлена")

    db_supply.status = SupplyStatusEnum.DELIVERED
    db.commit()
    db.refresh(db_supply)
    return to_supply_response(db_supply)


@router.patch("/{supply_id}/{supply_item_id}", response_model=SupplyItemsResponse, dependencies=[Depends(store_required)])
def update_supply_item(
        supply_id: int,
        supply_item_id: int,
        update_item: SupplyItemUpdate,
        db: Session = Depends(get_db),
        store_id: int = Depends(get_store_id)
):
    db_supply = crud_supply.get_supply_by_id(db, supply_id)
    if not db_supply:
        raise HTTPException(status_code=404, detail="Поставка не найдена")
    if db_supply.store_id != store_id:
        raise HTTPException(status_code=403, detail="Вы не можете редактировать поставки другого магазина")

    try:
        updated_item = crud_supply.update_supply_item(db, db_supply, supply_item_id, update_item)
    except crud_supply.SupplyNotDeliverableError:
        raise HTTPException(status_code=400, detail="Сначала отметьте поставку как доставленную")

    if updated_item is None:
        raise HTTPException(status_code=404, detail="Элемент поставки не найден")

    return to_supply_item_response(updated_item)


@router.post("/{supply_id}/close", response_model=SupplyResponse, dependencies=[Depends(store_required)])
def close_supply(
        supply_id: int,
        db: Session = Depends(get_db),
        store_id: int = Depends(get_store_id)
):
    db_supply = crud_supply.get_supply_by_id(db, supply_id)
    if not db_supply or db_supply.store_id != store_id:
        raise HTTPException(status_code=404, detail="Поставка не найдена")

    closed_supply = crud_supply.close_supply(db, db_supply)
    if not closed_supply:
        raise HTTPException(status_code=400, detail="Не удалось закрыть поставку или она уже закрыта")

    return to_supply_response(closed_supply)


@router.delete("/{supply_id}", status_code=204, dependencies=[Depends(admin_required)])
def delete_supply(supply_id: int, db: Session = Depends(get_db)):
    db_supply = crud_supply.get_supply_by_id(db, supply_id)
    if not db_supply:
        raise HTTPException(status_code=404, detail="Поставка не найдена")
    db.delete(db_supply)
    db.commit()
