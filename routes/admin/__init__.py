from fastapi import APIRouter, Depends
from .employee import router as employee_router
from .role import router as role_router
from .user import router as user_router
from .store import router as store_router
from .analytics import router as analytics_router
from .payment_method import router as payment_method_router
from .category import router as category_router
from .product import router as product_router
from dependencies.dependence import admin_required

router = APIRouter(prefix="/admin")  # тестовая
# router = APIRouter(prefix="/admin", dependencies=[Depends(admin_required)])

router.include_router(employee_router, prefix="/employees", tags=["Admin - Employee"])
router.include_router(role_router, prefix="/roles", tags=["Admin - Role"])
router.include_router(user_router, prefix="/users", tags=["Admin - User"])
router.include_router(store_router, prefix="/stores", tags=["Admin - Store"])
router.include_router(payment_method_router, prefix="/payments", tags=["Admin - Payment"])
router.include_router(category_router, prefix="/categories", tags=["Admin - Category"])
router.include_router(product_router, prefix="/products", tags=["Admin - Product"])
router.include_router(analytics_router, prefix="/supplies", tags=["Admin - Analytics"])
