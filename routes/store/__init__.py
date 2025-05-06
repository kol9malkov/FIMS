from fastapi import APIRouter, Depends
from .category import router as category_router
from .product import router as product_router
from auth import store_required

router = APIRouter(prefix="/store", dependencies=[Depends(store_required)])

router.include_router(category_router, prefix="/categories", tags=["Store - Category"])
router.include_router(product_router, prefix="/products", tags=["Store - Products"])
