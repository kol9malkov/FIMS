from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/sales/stats")
def get_sales_stats():
    return {"message": "Заглушка: статистика по продажам"}


@router.get("/reports/shifts")
def get_shift_reports():
    return {"message": "Заглушка: отчеты по сменам"}
