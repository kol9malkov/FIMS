from models import Product, Stock, Supply, SupplyItem
from schemas import ProductResponse, StockResponse, SupplyResponse, SupplyItemsResponse


def to_product_response(product: Product) -> ProductResponse:
    return ProductResponse(
        name=product.name,
        description=product.description,
        price=product.price,
        category_name=product.category.name,
        barcode=product.barcode,
        product_id=product.product_id,
        category_id=product.category_id
    )


def to_stock_response(stock: Stock) -> StockResponse:
    return StockResponse(
        stock_id=stock.stock_id,
        product_id=stock.product_id,
        store_id=stock.store_id,
        quantity=stock.quantity,
        stock_address=stock.store.address,
        product_name=stock.product.name,
        updated_datetime=stock.updated_datetime
    )


def to_supply_response(supply: Supply) -> SupplyResponse:
    return SupplyResponse(
        supply_id=supply.supply_id,
        store_id=supply.store_id,
        store_name=supply.store.address,
        supply_date=supply.supply_date,
        supplier_name=supply.supplier_name,
        status=supply.status,
        supply_items=[
            SupplyItemsResponse(
                supply_item_id=item.supply_item_id,
                product_id=item.product_id,
                product_name=item.product.name,
                quantity=item.quantity,
                received_quantity=item.received_quantity,
                is_received=item.is_received
            )
            for item in supply.supply_items
        ]
    )


def to_supply_item_response(supply_item: SupplyItem) -> SupplyItemsResponse:
    return SupplyItemsResponse(
        supply_item_id=supply_item.supply_item_id,
        product_id=supply_item.product_id,
        product_name=supply_item.product.name,
        quantity=supply_item.quantity,
        received_quantity=supply_item.received_quantity,
        is_received=supply_item.is_received
    )
