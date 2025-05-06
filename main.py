from fastapi import FastAPI
from routes import login_router, admin_router, store_router

app = FastAPI(title="FIMS", description="API for managing financial and inventory systems")

app.include_router(login_router, tags=["users"])
app.include_router(admin_router)
app.include_router(store_router)
