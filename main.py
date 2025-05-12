from fastapi import FastAPI
from routes import login_router, admin_router, store_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FIMS", description="API for managing financial and inventory systems")

app.include_router(login_router, tags=["users"])
app.include_router(admin_router)
app.include_router(store_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем доступ с любого домена
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (включая POST)
    allow_headers=["*"],  # Разрешаем все заголовки
)
