from fastapi import APIRouter, Depends

router = APIRouter()


@router.get("/sales/stats")
def get_sales_stats():
    return {"message": "Заглушка: статистика по продажам"}
