from fastapi import APIRouter, Depends
from .employee import router as employee_router
from .role import router as role_router
from .user import router as user_router
from .analytics import router as analytics_router
from auth import admin_required

router = APIRouter(prefix="/admin", dependencies=[Depends(admin_required)])

router.include_router(employee_router, prefix="/employees", tags=["Admin - Employee"])
router.include_router(role_router, prefix="/roles", tags=["Admin - Role"])
router.include_router(user_router, prefix="/users", tags=["Admin - User"])
router.include_router(analytics_router, prefix="/analytics", tags=["Admin - Analytics"])
