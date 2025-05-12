from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import SaleCreate, SaleResponse, SaleItemResponse, PaymentResponse
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
    # 1. Агрегируем товары по barcode (могут дублироваться)
    product_quantities: dict[str, int] = {}
    for item in sale_data.sale_items:
        product_quantities[item.barcode] = product_quantities.get(item.barcode, 0) + 1

    total_amount = Decimal("0.00")
    sale_items: list[tuple[int, int, Decimal]] = []  # (product_id, quantity, price)
    stock_map: dict[int, any] = {}  # product_id -> stock

    # 2. Проверка остатков и расчёт суммы
    for barcode, quantity in product_quantities.items():
        product = crud_product.get_product_by_barcode(db, barcode)
        if not product:
            raise HTTPException(status_code=404, detail=f"Товар со штрихкодом {barcode} не найден")

        stock = crud_stock.get_stock_by_product_and_store(db, product.product_id, store_id)
        if not stock or stock.quantity < quantity:
            raise HTTPException(status_code=400, detail=f"Недостаточно товара '{product.name}' на складе")

        sale_items.append((product.product_id, quantity, Decimal(str(product.price))))
        stock_map[product.product_id] = stock
        total_amount += quantity * Decimal(str(product.price))

    # 3. Проверка суммы платежей
    payment_total = sum([Decimal(str(p.amount)) for p in sale_data.payments])
    if payment_total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) != \
            total_amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP):
        raise HTTPException(status_code=400, detail="Сумма платежей не совпадает с общей стоимостью продажи")

    # 4. Создание записи продажи
    sale = crud_sale.create_sale_record(db, user.user_id, total_amount, store_id)

    try:
        # 5. Добавление товаров в продажу и списание остатков
        for product_id, quantity, price in sale_items:
            crud_sale.create_sale_item(db, sale.sale_id, product_id, quantity, float(price))
            stock = stock_map[product_id]
            stock.quantity -= quantity

        # 6. Добавление платежей
        for payment in sale_data.payments:
            crud_sale.create_payment(db, sale.sale_id, payment.payment_method_id, float(payment.amount))

        db.commit()
    except:
        db.rollback()
        raise HTTPException(status_code=500, detail="Ошибка при сохранении продажи")

    db.refresh(sale)
    full_sale: Sale = crud_sale.get_sale_with_details(db, sale.sale_id)

    # 7. Формирование ответа
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
