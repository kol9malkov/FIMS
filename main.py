from fastapi import FastAPI
from routes import user_router

app = FastAPI(title="FIMS", description="API for managing financial and inventory systems")

app.include_router(user_router, tags=["users"])



