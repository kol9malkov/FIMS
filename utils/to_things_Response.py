from models import Product
from schemas import ProductResponse


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
