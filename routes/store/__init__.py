from fastapi import APIRouter, Depends
from .category import router as category_router
from .product import router as product_router
from .stock import router as stock_router
from .store import router as store_router
from auth import store_required

router = APIRouter(prefix="/store", dependencies=[Depends(store_required)])

router.include_router(category_router, prefix="/categories", tags=["Store - Category"])
router.include_router(product_router, prefix="/products", tags=["Store - Products"])
router.include_router(stock_router, prefix="/stock", tags=["Store - Stock"])
router.include_router(store_router, prefix="/store", tags=["Store - Store"])
