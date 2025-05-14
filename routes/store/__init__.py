from fastapi import APIRouter
from .stock import router as stock_router
from .supply import router as supply_router
from .sale import router as sale_router

router = APIRouter(prefix="/store")

router.include_router(stock_router, prefix="/stocks", tags=["Store - Stock"])
router.include_router(supply_router, prefix="/supplies", tags=["Store - Supply"])
router.include_router(sale_router, prefix="/sales", tags=["Store - Sales"])
