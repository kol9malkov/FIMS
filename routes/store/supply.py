from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from crud import supply as crud_supply
from utils import get_db
from models import Supply
from schemas import SupplyCreate, SupplyResponse, SupplyItemUpdate, SupplyItemsResponse

router = APIRouter()


@router.post("/create", response_model=SupplyResponse)
def create_supply(supply: SupplyCreate, db: Session = Depends(get_db)):
    return crud_supply.create_supply(db, supply)


@router.get("/", response_model=list[SupplyResponse])
def get_supplies(db: Session = Depends(get_db)):
    return crud_supply.get_all_supplies(db)


@router.get("/{supply_id}", response_model=SupplyResponse)
def get_supply(supply_id: int, db: Session = Depends(get_db)):
    return crud_supply.get_supply_by_id(db, supply_id)


@router.patch("/{supply_id}/{item_id}", response_model=SupplyItemsResponse)
def update_supply_item(supply_id: int, supply_item_id: int, update_item: SupplyItemUpdate,
                       db: Session = Depends(get_db)):
    return crud_supply.update_supply_item(db, supply_id, supply_item_id, update_item)


@router.post("/{supply_id}/close", response_model=SupplyResponse)
def close_supply(supply_id: int, db: Session = Depends(get_db)):
    return crud_supply.close_supply(db, supply_id)
