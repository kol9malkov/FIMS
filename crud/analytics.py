from datetime import date
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Supply, Sale
from decimal import Decimal


def get_supply_analytics(
        db: Session,
        store_id: int = None,
        start_date=None,
        end_date=None
):
    query = db.query(Supply).join(Supply.supply_items).join(Supply.store)

    if store_id:
        query = query.filter(Supply.store_id == store_id)
    if start_date:
        query = query.filter(Supply.supply_date >= start_date)
    if end_date:
        query = query.filter(Supply.supply_date <= end_date)

    supplies = query.all()

    total_supplies = len(supplies)
    total_items = 0
    total_cost = Decimal("0.00")
    store_map = {}

    for s in supplies:
        if s.store_id not in store_map:
            store_map[s.store_id] = {
                "store_id": s.store.store_id,
                "store_address": s.store.address,
                "count": 0,
                "total_items": 0,
                "total_cost": Decimal("0.00"),
            }

        store_map[s.store_id]["count"] += 1

        for item in s.supply_items:
            total_items += item.received_quantity
            item_cost = item.received_quantity * item.price
            total_cost += item_cost

            store_map[s.store_id]["total_items"] += item.received_quantity
            store_map[s.store_id]["total_cost"] += item_cost

    supplies_per_store = list(store_map.values())

    return {
        "total_supplies": total_supplies,
        "total_items": total_items,
        "total_cost": float(total_cost),
        "supplies_per_store": [
            {
                **store,
                "total_cost": float(store["total_cost"]),
            }
            for store in supplies_per_store
        ]
    }


def get_sales_analytics(
        db: Session,
        store_id: Optional[int] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
):
    query = db.query(Sale).join(Sale.store)

    if store_id:
        query = query.filter(Sale.store_id == store_id)
    if start_date:
        query = query.filter(Sale.sale_datetime >= start_date)
    if end_date:
        query = query.filter(Sale.sale_datetime <= end_date)

    sales = query.all()
    total_sales = len(sales)
    total_amount = sum(float(s.total_amount) for s in sales)
    average_check = total_amount / total_sales if total_sales else 0.0

    # --- Продажи по магазинам ---
    store_data = {}
    for s in sales:
        sid = s.store_id
        if sid not in store_data:
            store_data[sid] = {
                "store_id": sid,
                "store_address": s.store.address,
                "count": 0,
                "total_amount": 0.0
            }
        store_data[sid]["count"] += 1
        store_data[sid]["total_amount"] += float(s.total_amount)

    # --- Ходовой товар ---
    product_counter = {}
    for s in sales:
        for item in s.sale_items:
            pid = item.product_id
            if pid not in product_counter:
                product_counter[pid] = {
                    "product_id": pid,
                    "name": item.product.name,
                    "total_sold": 0
                }
            product_counter[pid]["total_sold"] += item.quantity

    top_product = max(product_counter.values(), key=lambda x: x["total_sold"], default=None)

    # --- Способы оплаты ---
    payment_stats = {}
    for s in sales:
        for p in s.payments:
            method = p.payment_method.method_name
            if method not in payment_stats:
                payment_stats[method] = 0.0
            payment_stats[method] += float(p.amount)

    return {
        "total_sales": total_sales,
        "total_amount": round(total_amount, 2),
        "average_check": round(average_check, 2),
        "sales_per_store": list(store_data.values()),
        "top_product": top_product,
        "payments_stats": [
            {"method_name": k, "total_amount": round(v, 2)} for k, v in payment_stats.items()
        ]
    }
