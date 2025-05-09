from fastapi import APIRouter, Depends
from .category import router as category_router
from .product import router as product_router
from .stock import router as stock_router
from .store import router as store_router
from .supply import router as supply_router
from auth import store_required

router = APIRouter(prefix="/store", dependencies=[Depends(store_required)])

router.include_router(category_router, prefix="/categories", tags=["Store - Category"])
router.include_router(product_router, prefix="/products", tags=["Store - Product"])
router.include_router(stock_router, prefix="/stocks", tags=["Store - Stock"])
router.include_router(store_router, prefix="/stores", tags=["Store - Store"])
router.include_router(supply_router, prefix="/supplies", tags=["Store - Supply"])
