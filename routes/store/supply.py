from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import supply as crud_supply
from dependencies.dependence import admin_required
from utils import get_db
from utils.to_things_Response import to_supply_response, to_supply_item_response
from schemas import SupplyCreate, SupplyResponse, SupplyItemUpdate, SupplyItemsResponse

router = APIRouter()


@router.post("/create", response_model=SupplyResponse)
def create_supply(supply: SupplyCreate, db: Session = Depends(get_db)):
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


@router.get("/", response_model=list[SupplyResponse])
def get_supplies(db: Session = Depends(get_db)):
    db_supplies = crud_supply.get_all_supplies(db)
    return [to_supply_response(s) for s in db_supplies]


@router.get("/id/{supply_id}", response_model=SupplyResponse)
def get_supply(supply_id: int, db: Session = Depends(get_db)):
    db_supply = crud_supply.get_supply_by_id(db, supply_id)
    if not db_supply:
        raise HTTPException(status_code=404, detail="Поставка не найдена")
    return to_supply_response(db_supply)


@router.patch("/{supply_id}/{item_id}", response_model=SupplyItemsResponse)
def update_supply_item(supply_id: int, supply_item_id: int, update_item: SupplyItemUpdate,
                       db: Session = Depends(get_db)):
    db_supply = crud_supply.get_supply_by_id(db, supply_id)
    if not db_supply:
        raise HTTPException(status_code=404, detail="Поставка не найдена")
    updated_item = crud_supply.update_supply_item(db, db_supply, supply_item_id, update_item)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Элемент поставки не найден")
    return to_supply_item_response(updated_item)


@router.post("/{supply_id}/close", response_model=SupplyResponse)
def close_supply(supply_id: int, db: Session = Depends(get_db)):
    db_supply = crud_supply.get_supply_by_id(db, supply_id)
    if not db_supply:
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
