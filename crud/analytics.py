# crud/analytics.py
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from models import Supply


def get_supply_analytics(db: Session, store_id: Optional[int], start_date: Optional[date], end_date: Optional[date]):
    query = db.query(Supply)

    if store_id:
        query = query.filter(Supply.store_id == store_id)
    if start_date:
        query = query.filter(Supply.supply_date >= start_date)
    if end_date:
        query = query.filter(Supply.supply_date <= end_date)

    supplies = query.all()
    total_items = sum(len(s.supply_items) for s in supplies)
    total_cost = sum(item.quantity * item.price for s in supplies for item in s.supply_items)

    supplies_per_store = (
        db.query(Supply.store_id, func.count(Supply.supply_id))
        .group_by(Supply.store_id)
        .all()
    )

    return {
        "total_supplies": len(supplies),
        "total_items": total_items,
        "total_cost": total_cost,
        "supplies_per_store": [{"store_id": s[0], "count": s[1]} for s in supplies_per_store],
    }
