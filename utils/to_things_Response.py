from models import Product, Stock
from schemas import ProductResponse, StockResponse


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
