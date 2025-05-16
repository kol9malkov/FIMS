from datetime import date
from sqlalchemy import func
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from schemas import SaleCreate, SaleResponse, SaleItemResponse, PaymentResponse, SaleSummary, SummaryResponse
from crud import sale as crud_sale
from crud import product as crud_product
from crud import stock as crud_stock
from utils import get_db
from auth import get_current_user
from models import User, Sale
from dependencies.dependence import get_store_id
from decimal import Decimal, ROUND_HALF_UP

router = APIRouter()


@router.post("/create", response_model=SaleResponse)
def create_sale(
        sale_data: SaleCreate,
        db: Session = Depends(get_db),
        user: User = Depends(get_current_user),
        store_id: int = Depends(get_store_id)
):
    sale_items_data: list[tuple[int, int, Decimal]] = []
    stock_map: dict[int, any] = {}
    total_amount = Decimal("0.00")

    # 1. Проверка остатков и сбор инфо по каждому товару
    for item in sale_data.sale_items:
        product = crud_product.get_product_by_id(db, item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail=f"Товар ID {item.product_id} не найден")

        stock = crud_stock.get_stock_by_product_and_store(db, item.product_id, store_id)
        if not stock or stock.quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Недостаточно товара '{product.name}' на складе")

        sale_items_data.append((item.product_id, item.quantity, Decimal(str(item.price))))
        stock_map[item.product_id] = stock
        total_amount += Decimal(str(item.price)) * item.quantity

    # 2. Проверка суммы платежей
    payment_total = sum([Decimal(str(p.amount)) for p in sale_data.payments])
    if payment_total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) != \
            total_amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP):
        raise HTTPException(status_code=400, detail="Сумма платежей не совпадает с общей стоимостью продажи")

    # 3. Создание записи о продаже
    sale = crud_sale.create_sale_record(db, user.user_id, total_amount, store_id)

    try:
        # 4. Добавление позиций и списание остатков
        for product_id, quantity, price in sale_items_data:
            crud_sale.create_sale_item(db, sale.sale_id, product_id, quantity, float(price))
            stock_map[product_id].quantity -= quantity

        # 5. Добавление платежей
        for payment in sale_data.payments:
            crud_sale.create_payment(db, sale.sale_id, payment.payment_method_id, float(payment.amount))

        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Ошибка при сохранении продажи")

    db.refresh(sale)
    full_sale: Sale = crud_sale.get_sale_with_details(db, sale.sale_id)

    # 6. Формирование ответа
    return SaleResponse(
        sale_id=full_sale.sale_id,
        sale_datetime=full_sale.sale_datetime,
        total_amount=float(full_sale.total_amount),
        status=full_sale.status,
        sale_items=[
            SaleItemResponse(
                product_id=item.product_id,
                product_name=item.product.name,
                quantity=item.quantity,
                price=item.price
            )
            for item in full_sale.sale_items
        ],
        payments=[
            PaymentResponse(
                payment_id=p.payment_id,
                payment_method=p.payment_method.method_name,
                amount=p.amount
            )
            for p in full_sale.payments
        ]
    )


@router.get("/", response_model=list[SaleResponse])
def get_sales(
        db: Session = Depends(get_db),
        store_id: int = Depends(get_store_id),
        user: User = Depends(get_current_user),
):
    sales = crud_sale.get_sales_by_store(db, store_id)
    return [
        SaleResponse(
            sale_id=sale.sale_id,
            sale_datetime=sale.sale_datetime,
            total_amount=float(sale.total_amount),
            status=sale.status,
            sale_items=[
                SaleItemResponse(
                    product_id=item.product_id,
                    product_name=item.product.name,
                    quantity=item.quantity,
                    price=item.price
                )
                for item in sale.sale_items
            ],
            payments=[
                PaymentResponse(
                    payment_id=p.payment_id,
                    payment_method=p.payment_method.method_name,
                    amount=p.amount
                )
                for p in sale.payments
            ]
        )
        for sale in sales
    ]


@router.get("/summary", response_model=SummaryResponse)
def get_sales_summary(
        db: Session = Depends(get_db),
        store_id: int = Depends(get_store_id),
        date_: date = Query(default_factory=date.today)
):
    # 1. Фильтруем продажи по дате и магазину
    sales: list[Sale] = (
        db.query(Sale)
        .filter(Sale.store_id == store_id)
        .filter(func.date(Sale.sale_datetime) == date_)
        .all()
    )

    total_cash = Decimal("0.00")
    total_card = Decimal("0.00")
    sales_data: list[SaleSummary] = []

    for sale in sales:
        for payment in sale.payments:
            method_name = payment.payment_method.method_name.lower()
            amount = Decimal(str(payment.amount))

            if method_name == "наличные":
                total_cash += amount
            else:
                total_card += amount

            sales_data.append(SaleSummary(
                sale_id=sale.sale_id,
                datetime=sale.sale_datetime,
                amount=float(payment.amount),
                payment_method=payment.payment_method.method_name
            ))

    return SummaryResponse(
        date=date_.isoformat(),
        total_cash=float(total_cash),
        total_card=float(total_card),
        sales=sales_data
    )


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale_by_id(
        sale_id: int,
        db: Session = Depends(get_db),
        store_id: int = Depends(get_store_id)
):
    sale = crud_sale.get_sale_with_details(db, sale_id)
    if not sale or sale.store_id != store_id:
        raise HTTPException(status_code=404, detail="Продажа не найдена")

    return SaleResponse(
        sale_id=sale.sale_id,
        sale_datetime=sale.sale_datetime,
        total_amount=sale.total_amount,
        status=sale.status,
        sale_items=[
            SaleItemResponse(
                product_id=item.product_id,
                product_name=item.product.name,
                quantity=item.quantity,
                price=item.price
            ) for item in sale.sale_items
        ],
        payments=[
            PaymentResponse(
                payment_id=payment.payment_id,
                payment_method=payment.payment_method.method_name,
                amount=payment.amount
            ) for payment in sale.payments
        ]
    )
