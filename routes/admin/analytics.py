from fastapi import APIRouter, Depends
from dependencies.dependence import admin_required, all_roles_required
from schemas import SupplyAnalyticsResponse, SalesAnalyticsResponse
from typing import Optional
from models import User
from utils import get_db
from sqlalchemy.orm import Session
from datetime import date
from crud import analytics as crud_analytics

router = APIRouter()


@router.get("/supplies", response_model=SupplyAnalyticsResponse)
def get_supply_analytics(
        store_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        db: Session = Depends(get_db),
        current_user: User = Depends(admin_required)
):
    return crud_analytics.get_supply_analytics(db, store_id, start_date, end_date)


@router.get("/sales", response_model=SalesAnalyticsResponse)
def sales_analytics(
        store_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        db: Session = Depends(get_db),
        current_user: User = Depends(all_roles_required)
):
    return crud_analytics.get_sales_analytics(db, store_id, start_date, end_date)

